import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { listPublishedPosts } from '@/lib/happenings/api'
import type { HappeningsPost } from '@/lib/happenings/types'

const MotionLink = motion(Link)

export function GlobalHappenings() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<HappeningsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    listPublishedPosts().then((p) => {
      if (alive) {
        setPosts(p.slice(0, 3)) // Show top 3 recent posts
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  if (!loading && posts.length === 0) return null

  return (
    <section id="happenings" className="relative overflow-hidden bg-white py-24 md:py-32 border-t border-plum/10">
      <div className="container-wise relative">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{t('journal.latestFrom', 'Happenings')}</p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-black">
                Latest updates
              </h2>
            </div>
            <Link
              to="/happenings"
              className="hidden md:inline-flex shrink-0 items-center gap-2 rounded-full border border-plum/20 px-6 py-2.5 text-sm font-semibold text-plum transition-colors hover:bg-plum/[0.04]"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-12 text-sm text-plum/60 animate-pulse">Loading happenings...</div>
        ) : (
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {posts.map((post) => (
              <RevealItem key={post.id}>
              <MotionLink
                to={`/happenings/${post.slug}`}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-plum/10 bg-white shadow-card transition-shadow duration-500 hover:shadow-card-hover"
              >
                {post.coverImageUrl && (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-plum/5">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold text-plum">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-plum/65">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                    {t('happeningsPage.readMore', 'Read more')}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </MotionLink>
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        <Reveal delay={0.1}>
          <Link
            to="/happenings"
            className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full border border-plum/20 px-6 py-3 text-sm font-semibold text-plum transition-colors hover:bg-plum/[0.04] md:hidden"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
