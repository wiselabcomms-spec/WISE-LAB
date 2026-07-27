import { Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from '@/lib/auth/useAdminAuth'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminLayout } from './AdminLayout'
import { AdminDashboardPage } from './AdminDashboardPage'
import { AdminSubmissionsPage } from './AdminSubmissionsPage'
import { AdminWiseConnectPage } from './AdminWiseConnectPage'
import { AdminBlogPage } from './AdminBlogPage'
import { AdminBlogEditorPage } from './AdminBlogEditorPage'

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
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="blog/:id" element={<AdminBlogEditorPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}
