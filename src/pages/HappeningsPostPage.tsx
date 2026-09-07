import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { getPostBySlug } from '@/lib/happenings/api'
import type { HappeningsPost } from '@/lib/happenings/types'
import { useDocumentMeta } from '@/lib/useDocumentMeta'
import { articleSchema, breadcrumbSchema } from '@/lib/structuredData'

export function HappeningsPostPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<HappeningsPost | null | undefined>(undefined)
  useDocumentMeta({
    title: post?.title,
    description: post?.excerpt,
    path: `/happenings/${slug ?? ''}`,
    structuredData: post
      ? [
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'WISE Happenings', path: '/happenings' },
            { name: post.title, path: `/happenings/${slug ?? ''}` },
          ]),
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path: `/happenings/${slug ?? ''}`,
            image: post.coverImageUrl ?? undefined,
            author: post.author,
            datePublished: post.publishedAt ?? undefined,
          }),
        ]
      : undefined,
  })

  useEffect(() => {
    if (!slug) return
    let alive = true
    getPostBySlug(slug).then((p) => {
      if (alive) setPost(p)
    })
    return () => {
      alive = false
    }
  }, [slug])

  if (post === null) return <Navigate to="/happenings" replace />

  return (
    <main className="relative min-h-screen overflow-hidden bg-white py-16 md:py-24">
      <div className="container-wise relative max-w-3xl">
        <Reveal>
          <Link
            to="/happenings"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-plum/60 transition-colors hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {t('happeningsPostPage.backToJournal')}
          </Link>
        </Reveal>

        {post === undefined ? (
          <div className="mt-16 animate-pulse space-y-4">
            <div className="h-10 w-2/3 rounded bg-plum/10" />
            <div className="h-4 w-full rounded bg-plum/10" />
            <div className="h-4 w-5/6 rounded bg-plum/10" />
          </div>
        ) : (
          <Reveal delay={0.1}>
            <article className="mt-10">
              {post.coverImageUrl && (
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="mb-8 aspect-[16/9] w-full rounded-3xl object-cover shadow-card"
                />
              )}
              <p className="eyebrow">{post.author}</p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.05] text-black">
                {post.title}
              </h1>
              {post.publishedAt && (
                <p className="mt-3 text-sm font-medium text-plum/50">
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              <div className="prose prose-plum mt-8 max-w-none whitespace-pre-wrap text-[17px] leading-relaxed text-plum/80">
                {post.content}
              </div>
            </article>
          </Reveal>
        )}
      </div>
    </main>
  )
}
