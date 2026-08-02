import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { listPublishedPosts } from '@/lib/blog/api'
import type { BlogPost } from '@/lib/blog/types'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useDocumentMeta } from '@/lib/useDocumentMeta'
import { breadcrumbSchema } from '@/lib/structuredData'

const MotionLink = motion(Link)

export function BlogListPage() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  useDocumentMeta({
    title: 'Journal',
    description:
      'Stories, updates, and insights from WISE Lab — Women Innovation & Startup Empowerment Lab.',
    path: '/blog',
    structuredData: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'WISE Journal', path: '/blog' },
    ]),
  })

  useEffect(() => {
    let alive = true
    listPublishedPosts().then((p) => {
      if (alive) {
        setPosts(p)
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-beige py-16 md:py-24">
      <div className="grain" />
      <div className="container-wise relative">
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-plum/60 transition-colors hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {t('blogPage.backToWiseLab')}
          </Link>
          <p className="eyebrow mt-8">{t('blogPage.eyebrow')}</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
            {t('blogPage.title')}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-plum/70">
            {t('blogPage.intro')}
          </p>
        </Reveal>

        <div className="mt-16">
          {!isSupabaseConfigured && (
            <p className="rounded-2xl border border-plum/10 bg-white/60 p-6 text-sm text-plum/60">
              {t('blogPage.unconfigured')}
            </p>
          )}

          {isSupabaseConfigured && !loading && posts.length === 0 && (
            <p className="rounded-2xl border border-plum/10 bg-white/60 p-6 text-sm text-plum/60">
              {t('blogPage.empty')}
            </p>
          )}

          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <RevealItem key={post.id}>
                <MotionLink
                  to={`/blog/${post.slug}`}
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
                    <h2 className="font-display text-xl font-semibold text-plum">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-plum/65">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                      {t('blogPage.readMore')}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </MotionLink>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </main>
  )
}
