import type { BlogPost } from '@/lib/blog/types'
import { DEMO_BLOG_POSTS, DEMO_SUBMISSIONS } from './seedData'

/**
 * In-memory demo store. Blog CRUD in demo mode mutates this array so the
 * admin UI feels interactive within a session — it resets on page reload,
 * which is expected and fine for a demo (nothing here is meant to persist).
 */
let demoPosts: BlogPost[] = [...DEMO_BLOG_POSTS]

export function getDemoSubmissions() {
  return [...DEMO_SUBMISSIONS]
}

export function getDemoBlogPosts() {
  return [...demoPosts]
}

export function getDemoPublishedPosts() {
  return demoPosts.filter((p) => p.status === 'published')
}

export function getDemoPostBySlug(slug: string) {
  return demoPosts.find((p) => p.slug === slug && p.status === 'published') ?? null
}

export function upsertDemoPost(post: Partial<BlogPost> & { slug: string }) {
  const existingIndex = post.id ? demoPosts.findIndex((p) => p.id === post.id) : -1
  const now = new Date().toISOString()
  if (existingIndex >= 0) {
    demoPosts[existingIndex] = {
      ...demoPosts[existingIndex],
      ...post,
      publishedAt:
        post.status === 'published' ? post.publishedAt ?? demoPosts[existingIndex].publishedAt ?? now : null,
    } as BlogPost
  } else {
    demoPosts = [
      {
        id: `demo-post-${Date.now()}`,
        slug: post.slug,
        title: post.title ?? 'Untitled',
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        coverImageUrl: post.coverImageUrl ?? null,
        author: post.author ?? 'WISE Lab Team',
        publishedAt: post.status === 'published' ? now : null,
        status: post.status ?? 'draft',
        tags: post.tags ?? [],
        section: post.section ?? null,
      },
      ...demoPosts,
    ]
  }
}

export function deleteDemoPost(id: string) {
  demoPosts = demoPosts.filter((p) => p.id !== id)
}
