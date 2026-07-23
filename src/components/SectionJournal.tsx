import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { useSectionPosts } from '@/lib/blog/useSectionPosts'
import type { BlogSection } from '@/lib/blog/types'
import { cn } from '@/lib/utils'

export function SectionJournal({
  section,
  variant = 'light',
}: {
  section: BlogSection
  variant?: 'light' | 'dark'
}) {
  const { t } = useTranslation()
  const posts = useSectionPosts(section)
  if (posts.length === 0) return null

  const dark = variant === 'dark'

  return (
    <Reveal delay={0.1}>
      <div
        className={cn(
          'mt-14 border-t pt-8',
          dark ? 'border-beige/10' : 'border-plum/10'
        )}
      >
        <p
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.2em]',
            dark ? 'text-beige/45' : 'text-plum/45'
          )}
        >
          {t('journal.latestFrom', 'Latest from the Journal')}
        </p>
        <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {posts.slice(0, 3).map((post) => (
            <RevealItem key={post.id}>
              <Link
                to={`/blog/${post.slug}`}
                className={cn(
                  'group block h-full rounded-2xl border p-5 transition-colors',
                  dark
                    ? 'border-beige/10 hover:border-beige/25'
                    : 'border-plum/10 hover:border-plum/25'
                )}
              >
                <h3
                  className={cn(
                    'font-display text-base font-semibold leading-snug',
                    dark ? 'text-beige' : 'text-plum'
                  )}
                >
                  {post.title}
                </h3>
                <p
                  className={cn(
                    'mt-2 line-clamp-2 text-sm leading-relaxed',
                    dark ? 'text-beige/70' : 'text-plum/65'
                  )}
                >
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal">
                  {t('journal.readMore', 'Read more')}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Reveal>
  )
}
