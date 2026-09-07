import { getSupabase } from '@/lib/supabase'
import type { HappeningsPost } from './types'

interface DbRow {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image_url: string | null
  author: string
  published_at: string | null
  status: 'draft' | 'published'
  tags: string[] | null
  section: HappeningsPost['section'] | undefined
}

function fromRow(row: DbRow): HappeningsPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    author: row.author,
    publishedAt: row.published_at,
    status: row.status,
    tags: row.tags ?? [],
    section: row.section ?? null,
  }
}

/** Published posts, newest first. Returns [] (never throws) when Supabase isn't configured. */
export async function listPublishedPosts(): Promise<HappeningsPost[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error || !data) return []
  return (data as DbRow[]).map(fromRow)
}

export async function getPostBySlug(slug: string): Promise<HappeningsPost | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !data) return null
  return fromRow(data as DbRow)
}

/** All posts including drafts — admin only, relies on RLS to restrict access. */
export async function listAllPostsForAdmin(): Promise<HappeningsPost[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: true })

  if (error || !data) return []
  return (data as DbRow[]).map(fromRow)
}

export async function upsertPost(post: Partial<HappeningsPost> & { slug: string }): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { error } = await supabase.from('blog_posts').upsert({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    cover_image_url: post.coverImageUrl,
    author: post.author,
    published_at: post.status === 'published' ? post.publishedAt ?? new Date().toISOString() : null,
    status: post.status ?? 'draft',
    tags: post.tags ?? [],
    section: post.section ?? null,
  })
  if (error) throw error
}

export async function deletePost(id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw error
}
