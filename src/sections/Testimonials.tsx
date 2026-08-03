import { Link } from 'react-router-dom'
import { ArrowUpRight, Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { useSectionPosts } from '@/lib/blog/useSectionPosts'

/**
 * Founder stories / testimonials, sourced from the same admin Blog editor
 * as every other section's "Latest from the Journal" strip (tag a post's
 * Homepage section to "testimonials") — rather than inventing quotes here,
 * this only ever shows real published content.
 */
export function Testimonials() {
  const { t } = useTranslation()
  const posts = useSectionPosts('testimonials')

  return (
    <section id="testimonials" className="relative overflow-hidden bg-white py-28 md:py-36">
      <div className="container-wise relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{t('nav.links.testimonials', 'Founder Stories')}</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
            {t('testimonials.title', 'In their own words')}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-plum/70">
            {t(
              'testimonials.subtitle',
              'Real founders, real progress — stories from the women building inside WISE Lab.'
            )}
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-plum/15 bg-beige/40 p-10 text-center md:p-14">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-plum/5 text-plum/50">
                <Quote className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <p className="max-w-md text-plum/60">
                {t('testimonials.empty', "Founder stories are being gathered and will appear here soon.")}
              </p>
            </div>
          </Reveal>
        ) : (
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {posts.slice(0, 6).map((post) => (
              <RevealItem key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-plum/10 bg-white p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
                >
                  <Quote className="h-6 w-6 text-teal" strokeWidth={1.6} />
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-plum">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 line-clamp-4 text-sm leading-relaxed text-plum/65">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal">
                    {t('journal.readMore', 'Read more')}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  )
}
