// Supabase Edge Function: manage-admins
//
// Provides privileged admin account management (create, delete, update password)
// that requires the Supabase service role key — which can never be exposed in
// the browser. The service role key is automatically injected by the Supabase
// runtime via SUPABASE_SERVICE_ROLE_KEY.
//
// Actions (POST body: { action, payload }):
//   create_admin  — create a new Supabase Auth user + admin_profiles row
//   delete_admin  — delete a Supabase Auth user (cascades to admin_profiles)
//   update_password — reset an admin's password
//
// Security: validates the caller's JWT and confirms super_admin role in
// admin_profiles before executing any privileged operation.
//
// Deploy with:
//   supabase functions deploy manage-admins
//
// @ts-nocheck — Deno runtime globals not typed under the Node/Vite tsconfig.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    // Verify the caller's JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create a client using the caller's JWT to verify their identity
    const callerClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authHeader } },
    })

    // Get the caller's user info
    const { data: { user: callerUser }, error: userError } = await callerClient.auth.getUser()
    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Admin client (service role) for privileged operations
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Verify caller is a super_admin
    const { data: callerProfile, error: profileError } = await adminClient
      .from('admin_profiles')
      .select('role')
      .eq('id', callerUser.id)
      .maybeSingle()

    if (profileError || !callerProfile || callerProfile.role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: super_admin role required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, payload } = await req.json()

    // -------------------------------------------------------------------------
    // CREATE ADMIN
    // -------------------------------------------------------------------------
    if (action === 'create_admin') {
      const { email, password, full_name, role = 'admin' } = payload

      if (!email || !password || !full_name) {
        return new Response(JSON.stringify({ error: 'email, password, and full_name are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (!['admin', 'editor'].includes(role)) {
        return new Response(JSON.stringify({ error: 'role must be admin or editor' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Try to create the auth user
      let userId: string
      let createdNew = false

      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (createError) {
        // If the user already exists in auth.users, look them up and reuse
        if (createError.message?.toLowerCase().includes('already been registered')) {
          const { data: listData, error: listError } = await adminClient.auth.admin.listUsers()
          const existingUser = listData?.users?.find(
            (u: { email?: string }) => u.email?.toLowerCase() === email.toLowerCase()
          )
          if (listError || !existingUser) {
            return new Response(
              JSON.stringify({ error: 'User exists in auth but could not be found. Please check Supabase dashboard.' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Check if they already have an admin_profiles row
          const { data: existingProfile } = await adminClient
            .from('admin_profiles')
            .select('id')
            .eq('id', existingUser.id)
            .maybeSingle()

          if (existingProfile) {
            return new Response(
              JSON.stringify({ error: 'This user is already an admin.' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Update the existing user's password and confirm email
          await adminClient.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true,
          })

          userId = existingUser.id
        } else {
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      } else {
        userId = newUser.user.id
        createdNew = true
      }

      // Insert the admin_profiles row
      const { error: insertError } = await adminClient
        .from('admin_profiles')
        .insert({ id: userId, full_name, role })

      if (insertError) {
        // Rollback: only delete the auth user if we just created it
        if (createdNew) {
          await adminClient.auth.admin.deleteUser(userId)
        }
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(
        JSON.stringify({ success: true, id: userId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // -------------------------------------------------------------------------
    // DELETE ADMIN
    // -------------------------------------------------------------------------
    if (action === 'delete_admin') {
      const { id } = payload

      if (!id) {
        return new Response(JSON.stringify({ error: 'id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Prevent self-deletion
      if (id === callerUser.id) {
        return new Response(JSON.stringify({ error: 'You cannot delete your own account' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Prevent deleting another super_admin
      const { data: targetProfile } = await adminClient
        .from('admin_profiles')
        .select('role')
        .eq('id', id)
        .maybeSingle()

      if (targetProfile?.role === 'super_admin') {
        return new Response(JSON.stringify({ error: 'Cannot delete another super_admin' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Delete the auth user — cascades to admin_profiles via FK on delete cascade
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(id)
      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // -------------------------------------------------------------------------
    // UPDATE PASSWORD
    // -------------------------------------------------------------------------
    if (action === 'update_password') {
      const { id, new_password } = payload

      if (!id || !new_password) {
        return new Response(JSON.stringify({ error: 'id and new_password are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (new_password.length < 8) {
        return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { error: updateError } = await adminClient.auth.admin.updateUserById(id, {
        password: new_password,
      })

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // -------------------------------------------------------------------------
    // LIST ADMINS (returns emails from auth.users)
    // -------------------------------------------------------------------------
    if (action === 'list_admins') {
      const { data: profiles } = await adminClient
        .from('admin_profiles')
        .select('id')

      const ids = (profiles ?? []).map((p: { id: string }) => p.id)
      const users: { id: string; email: string }[] = []

      for (const id of ids) {
        const { data: u } = await adminClient.auth.admin.getUserById(id)
        if (u?.user) users.push({ id: u.user.id, email: u.user.email ?? '' })
      }

      return new Response(JSON.stringify({ users }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('manage-admins error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
