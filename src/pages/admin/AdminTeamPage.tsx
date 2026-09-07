import { useEffect, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, Star, EyeOff, Eye, X, Check, Upload, ImageIcon } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getSupabase } from '@/lib/supabase'
import {
  listAllTeamMembersForAdmin,
  upsertTeamMember,
  deleteTeamMember,
} from '@/lib/team/api'
import type { TeamMember } from '@/lib/team/types'

const STORAGE_BUCKET = 'team-images'

const EMPTY_FORM: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  role: '',
  tagline: '',
  bio: '',
  imageUrl: '',
  linkedinUrl: '',
  isFeatured: false,
  sortOrder: 0,
  isVisible: true,
}

export function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState<Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY_FORM)

  // Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reload = () => {
    setLoading(true)
    listAllTeamMembersForAdmin().then((data) => {
      setMembers(data)
      setLoading(false)
    })
  }

  useEffect(reload, [])

  const openNew = () => {
    setEditing({ id: '', ...EMPTY_FORM })
    setForm({ ...EMPTY_FORM, sortOrder: members.length })
    setError(null)
    setUploadError(null)
  }

  const openEdit = (member: TeamMember) => {
    setEditing(member)
    setForm({
      name: member.name,
      role: member.role,
      tagline: member.tagline,
      bio: member.bio,
      imageUrl: member.imageUrl,
      linkedinUrl: member.linkedinUrl,
      isFeatured: member.isFeatured,
      sortOrder: member.sortOrder,
      isVisible: member.isVisible,
    })
    setError(null)
    setUploadError(null)
  }

  const closeForm = () => {
    setEditing(null)
    setError(null)
    setUploadError(null)
  }

  const onSave = async () => {
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await upsertTeamMember({
        ...(editing?.id ? { id: editing.id } : {}),
        ...form,
      })
      reload()
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (member: TeamMember) => {
    if (!confirm(`Delete "${member.name}"? This cannot be undone.`)) return
    try {
      await deleteTeamMember(member.id)
      reload()
    } catch {
      alert('Failed to delete. Please try again.')
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const supabase = getSupabase()
      if (!supabase) throw new Error('Supabase is not configured.')

      // Build a unique filename: timestamp-originalname
      const ext = file.name.split('.').pop() ?? 'jpg'
      const base = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .toLowerCase()
      const filename = `${base}-${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, file, { upsert: true, contentType: file.type })

      if (uploadErr) throw uploadErr

      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename)
      setForm((f) => ({ ...f, imageUrl: data.publicUrl }))
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Upload failed. Please try again.'
      )
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const isNew = editing !== null && !editing.id

  return (
    <div>
      {/* Header */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-plum sm:text-3xl">Team Members</h1>
            <p className="mt-2 text-plum/60">
              Manage the "Behind the Wings" team shown on the homepage.
            </p>
          </div>
          <Button size="sm" onClick={openNew} disabled={editing !== null}>
            <Plus className="h-4 w-4" />
            Add member
          </Button>
        </div>
      </Reveal>

      {/* Inline Form */}
      {editing !== null && (
        <Reveal>
          <div className="mt-8 rounded-3xl border border-plum/10 bg-white p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-plum">
                {isNew ? 'Add New Member' : `Edit — ${editing.name}`}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-full text-plum/50 transition-colors hover:bg-plum/10 hover:text-plum"
                aria-label="Close form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-plum">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Muneaza Durrani"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-plum">Role / Title</label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Project Director"
                />
              </div>

              {/* Tagline */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-plum">Tagline</label>
                <Input
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  placeholder="A short inspiring description..."
                />
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-plum">
                  Bio{' '}
                  <span className="text-xs font-normal text-plum/50">
                    (shown only on the featured card)
                  </span>
                </label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Extended biography for the featured team member card..."
                  rows={3}
                />
              </div>

              {/* Photo Upload */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-plum">
                  Photo
                  <span className="ml-2 text-xs font-normal text-plum/50">
                    (JPG, PNG, WebP — saved to /public/team/)
                  </span>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  {/* Preview */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-plum/10 bg-plum/5">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-plum/30" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    {/* Upload button */}
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        id="team-photo-upload"
                        onChange={onFileChange}
                        disabled={uploading}
                      />
                      <label
                        htmlFor="team-photo-upload"
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                          uploading
                            ? 'border-plum/10 bg-plum/5 text-plum/40 cursor-wait'
                            : 'border-plum/20 bg-white text-plum hover:border-teal hover:bg-teal/5 hover:text-teal'
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        {uploading ? 'Uploading…' : 'Upload Photo'}
                      </label>
                    </div>

                    {uploadError && (
                      <p className="text-xs text-destructive">{uploadError}</p>
                    )}

                    {/* Manual URL field as fallback */}
                    <Input
                      value={form.imageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="Or paste a URL: /team/photo.jpg or https://..."
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-plum">LinkedIn URL</label>
                <Input
                  value={form.linkedinUrl}
                  onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-plum">
                  Sort Order{' '}
                  <span className="text-xs font-normal text-plum/50">(lower = first)</span>
                </label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 self-end pb-1">
                <ToggleField
                  label="Featured"
                  hint="Shows in the large hero card"
                  value={form.isFeatured}
                  onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
                />
                <ToggleField
                  label="Visible"
                  hint="Show on homepage"
                  value={form.isVisible}
                  onChange={(v) => setForm((f) => ({ ...f, isVisible: v }))}
                />
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <div className="mt-6 flex items-center gap-3">
              <Button onClick={onSave} disabled={saving || uploading}>
                <Check className="h-4 w-4" />
                {saving ? 'Saving…' : isNew ? 'Add Member' : 'Save Changes'}
              </Button>
              <Button variant="ghost" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Member List */}
      {loading ? (
        <p className="mt-8 text-plum/50">Loading…</p>
      ) : members.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-plum/10 bg-white p-6 text-plum/50">
          No team members yet. Add one above.
        </p>
      ) : (
        <RevealGroup className="mt-8 space-y-3" stagger={0.04}>
          {members.map((member) => (
            <RevealItem key={member.id}>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-plum/10 bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                {/* Left: avatar + info */}
                <div className="flex min-w-0 items-center gap-4">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-12 w-12 shrink-0 rounded-full object-cover object-top ring-2 ring-plum/10"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-plum/10 text-sm font-bold text-plum">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-plum">{member.name}</p>
                      {member.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          <Star className="h-3 w-3" /> Featured
                        </span>
                      )}
                      {!member.isVisible && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-plum/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-plum/60">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-plum/55">
                      {member.role || '—'} · Order: {member.sortOrder}
                    </p>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    disabled={editing !== null}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-plum/60 transition-colors hover:bg-plum/10 hover:text-plum disabled:opacity-40"
                    aria-label={`Edit ${member.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(member)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-plum/60 transition-colors hover:bg-red-50 hover:text-destructive"
                    aria-label={`Delete ${member.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      upsertTeamMember({ ...member, isVisible: !member.isVisible }).then(reload)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full text-plum/60 transition-colors hover:bg-plum/10 hover:text-plum"
                    aria-label={member.isVisible ? 'Hide member' : 'Show member'}
                    title={member.isVisible ? 'Hide from homepage' : 'Show on homepage'}
                  >
                    {member.isVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}

function ToggleField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-teal' : 'bg-plum/20'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="select-none">
        <span className="text-sm font-medium text-plum">{label}</span>
        <span className="block text-[11px] text-plum/50">{hint}</span>
      </span>
    </label>
  )
}
