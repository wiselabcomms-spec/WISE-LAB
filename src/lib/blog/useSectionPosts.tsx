import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { listPublishedPosts } from './api'
import type { BlogPost, BlogSection } from './types'

const BlogSectionsContext = createContext<Partial<Record<BlogSection, BlogPost[]>>>({})

export function BlogSectionsProvider({ children }: { children: ReactNode }) {
  const [bySection, setBySection] = useState<Partial<Record<BlogSection, BlogPost[]>>>({})

  useEffect(() => {
    let alive = true
    listPublishedPosts().then((posts) => {
      if (!alive) return
      const grouped: Partial<Record<BlogSection, BlogPost[]>> = {}
      for (const post of posts) {
        if (!post.section) continue
        ;(grouped[post.section] ??= []).push(post)
      }
      setBySection(grouped)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <BlogSectionsContext.Provider value={bySection}>{children}</BlogSectionsContext.Provider>
  )
}

export function useSectionPosts(section: BlogSection): BlogPost[] {
  const bySection = useContext(BlogSectionsContext)
  return bySection[section] ?? []
}
