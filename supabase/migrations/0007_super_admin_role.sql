-- WISE Lab — Migration 0007: super_admin role
-- Extends admin_profiles to support a super_admin role that can manage
-- other admin accounts. Run via the Supabase SQL editor or `supabase db push`.

-- 1. Widen the role check constraint to include 'super_admin'
ALTER TABLE public.admin_profiles
  DROP CONSTRAINT IF EXISTS admin_profiles_role_check;

ALTER TABLE public.admin_profiles
  ADD CONSTRAINT admin_profiles_role_check
  CHECK (role IN ('admin', 'editor', 'super_admin'));

-- 2. Non-recursive helper function for super_admin RLS policies.
--    SECURITY DEFINER means the function runs as its owner (bypassing RLS on
--    the inner admin_profiles query), which prevents infinite recursion that
--    would occur if the policy's USING clause queries the same RLS-protected
--    table it is guarding.
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- 3. Super admins can read ALL admin profiles (needed for the Users management page)
CREATE POLICY "admin_profiles: super_admin read all"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

-- 4. Super admins can insert new admin profiles (after creating the auth user
--    via the manage-admins edge function which uses the service role key)
CREATE POLICY "admin_profiles: super_admin insert"
  ON public.admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

-- 5. Super admins can delete any admin profile
CREATE POLICY "admin_profiles: super_admin delete"
  ON public.admin_profiles FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- 6. Super admins can update any admin profile (e.g. role changes)
CREATE POLICY "admin_profiles: super_admin update"
  ON public.admin_profiles FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());
