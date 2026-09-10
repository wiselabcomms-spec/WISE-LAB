import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { UserPlus, Trash2, KeyRound, Shield, RefreshCw, X, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminAuth } from '@/lib/auth/useAdminAuth'
import { useSuperAdmin, type AdminProfile } from '@/lib/auth/useSuperAdmin'
import { useDocumentMeta } from '@/lib/useDocumentMeta'
import { cn } from '@/lib/utils'

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-violet-100 text-violet-700 border-violet-200',
  admin: 'bg-teal/10 text-teal border-teal/20',
  editor: 'bg-amber-100 text-amber-700 border-amber-200',
}

// ── Shared modal wrapper ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-plum/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-plum/10 bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-plum">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-plum/50 transition-colors hover:bg-plum/10 hover:text-plum"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

// ── Password visibility toggle input ─────────────────────────────────────────
function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/40 hover:text-plum"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

// ── Create Admin Modal ────────────────────────────────────────────────────────
function CreateAdminModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (email: string, password: string, fullName: string, role: 'admin' | 'editor') => Promise<{ error: string | null }>
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'editor'>('admin')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error: err } = await onCreate(email, password, fullName, role)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      onClose()
    }
  }

  return (
    <Modal title="Create Admin" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="new-admin-name">Full Name</Label>
          <Input
            id="new-admin-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sarah Ahmed"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-admin-email">Email</Label>
          <Input
            id="new-admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@wiselab.org.pk"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-admin-password">Password</Label>
          <PasswordInput
            id="new-admin-password"
            value={password}
            onChange={setPassword}
            placeholder="Minimum 8 characters"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-admin-role">Role</Label>
          <select
            id="new-admin-role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'editor')}
            className="h-11 w-full rounded-xl border border-plum/15 bg-white px-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-teal/40"
          >
            <option value="admin">Admin full access</option>
            <option value="editor">Editor blog only</option>
          </select>
        </div>
        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Admin'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Reset Password Modal ──────────────────────────────────────────────────────
function ResetPasswordModal({
  admin,
  onClose,
  onReset,
}: {
  admin: AdminProfile
  onClose: () => void
  onReset: (id: string, newPassword: string) => Promise<{ error: string | null }>
}) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error: err } = await onReset(admin.id, password)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
      setTimeout(onClose, 1500)
    }
  }

  return (
    <Modal title={`Reset Password ${admin.full_name}`} onClose={onClose}>
      {success ? (
        <div className="rounded-xl border border-teal/20 bg-teal/5 px-4 py-4 text-center text-sm font-medium text-teal">
          ✓ Password updated successfully!
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <p className="text-sm text-plum/60">
            Set a new password for <span className="font-semibold text-plum">{admin.email ?? admin.full_name}</span>.
          </p>
          <div className="space-y-2">
            <Label htmlFor="reset-password">New Password</Label>
            <PasswordInput
              id="reset-password"
              value={password}
              onChange={setPassword}
              placeholder="Minimum 8 characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reset-password-confirm">Confirm Password</Label>
            <PasswordInput
              id="reset-password-confirm"
              value={confirm}
              onChange={setConfirm}
              placeholder="Repeat the new password"
            />
          </div>
          {error && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Updating…' : 'Update Password'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteConfirmModal({
  admin,
  onClose,
  onDelete,
}: {
  admin: AdminProfile
  onClose: () => void
  onDelete: (id: string) => Promise<{ error: string | null }>
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onConfirm = async () => {
    setSubmitting(true)
    setError(null)
    const { error: err } = await onDelete(admin.id)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      onClose()
    }
  }

  return (
    <Modal title="Delete Admin" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">This cannot be undone</p>
            <p className="mt-1 text-sm text-amber-700">
              <span className="font-semibold">{admin.full_name}</span>{' '}
              {admin.email ? `(${admin.email})` : ''} will permanently lose access to the admin
              portal.
            </p>
          </div>
        </div>
        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-destructive text-white hover:bg-destructive/90"
            disabled={submitting}
            onClick={onConfirm}
          >
            {submitting ? 'Deleting…' : 'Yes, Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function AdminUsersPage() {
  const { role, session } = useAdminAuth()
  useDocumentMeta({ title: 'Admin Users', path: '/admin/users', noIndex: true })
  const { isSuperAdmin, admins, loading, error, createAdmin, deleteAdmin, updatePassword, refresh } =
    useSuperAdmin()

  const [showCreate, setShowCreate] = useState(false)
  const [resetTarget, setResetTarget] = useState<AdminProfile | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProfile | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const currentUserId = session?.user?.id ?? null

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Guard: only super_admin can access this page
  if (!isSuperAdmin && role !== null) {
    return <Navigate to="/admin" replace />
  }

  const handleDelete = async (id: string) => {
    const result = await deleteAdmin(id)
    if (!result.error) showToast('Admin deleted successfully.')
    return result
  }

  return (
    <div className="relative">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-lg">
          {toastMsg}
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateAdminModal
          onClose={() => setShowCreate(false)}
          onCreate={async (email, password, fullName, role) => {
            const result = await createAdmin(email, password, fullName, role)
            if (!result.error) showToast(`Admin "${fullName}" created successfully.`)
            return result
          }}
        />
      )}
      {resetTarget && (
        <ResetPasswordModal
          admin={resetTarget}
          onClose={() => setResetTarget(null)}
          onReset={updatePassword}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          admin={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDelete={handleDelete}
        />
      )}

      {/* Header */}
      <Reveal>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-plum sm:text-3xl">
              Manage Admins
            </h1>
            <p className="mt-2 text-plum/60">
              Create, update, and remove admin accounts. Changes take effect immediately.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-plum/10 bg-white text-plum/50 transition-colors hover:bg-plum/5 hover:text-plum"
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
            <Button
              id="create-admin-btn"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Create Admin
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Error state */}
      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && admins.length === 0 ? (
        <p className="mt-8 text-plum/50">Loading admins…</p>
      ) : (
        <RevealGroup className="mt-8 space-y-3" stagger={0.04}>
          {admins.map((admin) => {
            const isSelf = admin.id === currentUserId
            const isSuperAdminRow = admin.role === 'super_admin'
            return (
              <RevealItem key={admin.id}>
                <div
                  className={cn(
                    'flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover',
                    isSelf ? 'border-teal/30' : 'border-plum/10'
                  )}
                >
                  {/* Avatar / initial */}
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold',
                      isSuperAdminRow
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-teal/10 text-teal'
                    )}
                  >
                    {admin.full_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-plum">{admin.full_name}</p>
                      {isSelf && (
                        <span className="rounded-full border border-teal/20 bg-teal/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal">
                          You
                        </span>
                      )}
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                          ROLE_COLORS[admin.role] ?? 'bg-plum/5 text-plum/60 border-plum/10'
                        )}
                      >
                        {ROLE_LABELS[admin.role] ?? admin.role}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-plum/50">
                      {admin.email ?? 'Email loading…'} ·{' '}
                      {new Date(admin.created_at).toLocaleDateString('en-PK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id={`reset-pw-${admin.id}`}
                      onClick={() => setResetTarget(admin)}
                      title="Reset password"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-plum/10 bg-white text-plum/50 transition-colors hover:border-teal/30 hover:bg-teal/5 hover:text-teal"
                    >
                      <KeyRound className="h-4 w-4" />
                    </button>
                    {!isSelf && !isSuperAdminRow && (
                      <button
                        type="button"
                        id={`delete-admin-${admin.id}`}
                        onClick={() => setDeleteTarget(admin)}
                        title="Delete admin"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-plum/10 bg-white text-plum/50 transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {isSuperAdminRow && !isSelf && (
                      <div
                        title="Super admins cannot be deleted"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-plum/5 bg-plum/2 text-plum/20"
                      >
                        <Shield className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      )}

      {!loading && admins.length === 0 && !error && (
        <p className="mt-8 rounded-2xl border border-plum/10 bg-white p-6 text-plum/50">
          No admin accounts found.
        </p>
      )}
    </div>
  )
}
