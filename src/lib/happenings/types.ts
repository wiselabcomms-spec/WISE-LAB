import type { NAV_LINKS } from '@/lib/nav'

export type HappeningsSection = (typeof NAV_LINKS)[number]['id'] | 'enter-the-lab' | 'testimonials'

export interface HappeningsPost {
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
  section: HappeningsSection | null
}
