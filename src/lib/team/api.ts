import { getSupabase } from '@/lib/supabase'
import type { TeamMember } from './types'

interface DbRow {
  id: string
  name: string
  role: string
  tagline: string
  bio: string
  image_url: string
  linkedin_url: string
  is_featured: boolean
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

function fromRow(row: DbRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    tagline: row.tagline,
    bio: row.bio,
    imageUrl: row.image_url,
    linkedinUrl: row.linkedin_url,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Visible members ordered by sort_order — for the public section. */
export async function listVisibleTeamMembers(): Promise<TeamMember[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return (data as DbRow[]).map(fromRow)
}

/** All members including hidden — admin only, relies on RLS. */
export async function listAllTeamMembersForAdmin(): Promise<TeamMember[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return (data as DbRow[]).map(fromRow)
}

export async function upsertTeamMember(
  member: Partial<TeamMember> & { name: string }
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { error } = await supabase.from('team_members').upsert({
    id: member.id,
    name: member.name,
    role: member.role ?? '',
    tagline: member.tagline ?? '',
    bio: member.bio ?? '',
    image_url: member.imageUrl ?? '',
    linkedin_url: member.linkedinUrl ?? '',
    is_featured: member.isFeatured ?? false,
    sort_order: member.sortOrder ?? 0,
    is_visible: member.isVisible ?? true,
  })
  if (error) throw error
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { error } = await supabase.from('team_members').delete().eq('id', id)
  if (error) throw error
}
