import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://khtrjbqhqgzxpomcwwmx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodHJqYnFocWd6eHBvbWN3d214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NzA3MjgsImV4cCI6MjEwMDM0NjcyOH0.EUHPac2hCR-Zff94cxqnWdSsp-AUC40sEygCuRpoujg'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function createLogin() {
  const email = 'admin@wiselab.org.pk'
  const password = 'WiseLabAdmin2026!'
  
  console.log(`Attempting to sign up ${email}...`)
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) {
    console.error('Error creating user:', error.message)
    process.exit(1)
  }
  
  console.log('Success!', data)
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  
  // Also try to insert into admin_profiles if needed
  if (data.user) {
    const { error: profileError } = await supabase
      .from('admin_profiles')
      .insert({ id: data.user.id, email: email, name: 'Admin User' })
    
    if (profileError) {
      console.error('Failed to create admin_profile (might need RLS bypass):', profileError.message)
    } else {
      console.log('Created admin_profile successfully.')
    }
  }
}

createLogin()
