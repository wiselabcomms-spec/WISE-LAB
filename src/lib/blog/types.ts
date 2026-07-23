import type { NAV_LINKS } from '@/lib/nav'

export type BlogSection = (typeof NAV_LINKS)[number]['id']

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl: string | null
  author: string
  publishedAt: string | null
  status: 'draft' | 'published'
  tags: string[]
  section: BlogSection | null
}
