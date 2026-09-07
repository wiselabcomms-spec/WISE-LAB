import { Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from '@/lib/auth/useAdminAuth'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminLayout } from './AdminLayout'
import { AdminDashboardPage } from './AdminDashboardPage'
import { AdminSubmissionsPage } from './AdminSubmissionsPage'
import { AdminWiseConnectPage } from './AdminWiseConnectPage'
import { AdminHappeningsPage } from './AdminHappeningsPage'
import { AdminHappeningsEditorPage } from './AdminHappeningsEditorPage'
import { AdminUsersPage } from './AdminUsersPage'
import { AdminTeamPage } from './AdminTeamPage'

/**
 * The entire /admin/* subtree as one lazy-loaded chunk (see AppRouter.tsx).
 * AdminAuthProvider lives here rather than at the app root specifically so
 * its Supabase auth check — and the @supabase/supabase-js import it
 * pulls in — never loads for a homepage visitor who never touches /admin.
 */
export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="submissions" element={<AdminSubmissionsPage />} />
          <Route path="wise-connect" element={<AdminWiseConnectPage />} />
          <Route path="happenings" element={<AdminHappeningsPage />} />
          <Route path="happenings/:id" element={<AdminHappeningsEditorPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="team" element={<AdminTeamPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}
