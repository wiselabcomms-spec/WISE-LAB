import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { listPublishedPosts } from './api'
import type { HappeningsPost, HappeningsSection } from './types'

const HappeningsSectionsContext = createContext<Partial<Record<HappeningsSection, HappeningsPost[]>>>({})

export function HappeningsSectionsProvider({ children }: { children: ReactNode }) {
  const [bySection, setBySection] = useState<Partial<Record<HappeningsSection, HappeningsPost[]>>>({})

  useEffect(() => {
    let alive = true
    listPublishedPosts().then((posts) => {
      if (!alive) return
      const grouped: Partial<Record<HappeningsSection, HappeningsPost[]>> = {}
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
    <HappeningsSectionsContext.Provider value={bySection}>{children}</HappeningsSectionsContext.Provider>
  )
}

export function useSectionPosts(section: HappeningsSection): HappeningsPost[] {
  const bySection = useContext(HappeningsSectionsContext)
  return bySection[section] ?? []
}
