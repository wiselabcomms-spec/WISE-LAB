import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Rocket, Sprout } from 'lucide-react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { SectionJournal } from '@/components/SectionJournal'
import { useTrack, type Track } from '@/lib/useTrackState'
import { cn } from '@/lib/utils'

interface TrackCard {
  id: Exclude<Track, 'neutral'>
  index: string
  kicker: string
  title: string
  lead: string
  body: string
  motto: string
  cta: string
  readMoreHref: string
  primary: string
  accent: string
  soft: string
  Icon: typeof Rocket
}

function getCards(t: TFunction): TrackCard[] {
  return [
    {
      id: 'founder',
      index: '01',
      kicker: t('buildTracks.founder.kicker', 'Startup Incubation'),
      title: t('buildTracks.founder.title', 'Founder Flightpath'),
      lead: t(
        'buildTracks.founder.lead',
        'A structured six-month programme for women-led, technology-enabled startups ready to validate, strengthen, launch, or scale.'
      ),
      body: t(
        'buildTracks.founder.body',
        'From an early idea to an investment-ready enterprise — with business-model refinement, product validation, real-time mentorship, pitch development, investor readiness, legal & financial guidance, market access, and ecosystem linkages.'
      ),
      motto: t('buildTracks.founder.motto', 'From idea to investor-ready — unseen to undeniable.'),
      cta: t('buildTracks.founder.cta', 'Take Flight'),
      readMoreHref: '/founder-flightpath',
      primary: '#0F3D3B',
      accent: '#2E7D7B',
      soft: 'rgba(46,125,123,0.10)',
      Icon: Rocket,
    },
    {
      id: 'enterprise',
      index: '02',
      kicker: t('buildTracks.enterprise.kicker', 'MSME Training'),
      title: t('buildTracks.enterprise.title', 'Enterprise Flightpath'),
      lead: t(
        'buildTracks.enterprise.lead',
        'A nationwide capacity-building programme for women running micro, small, home-based, or early-stage businesses.'
      ),
      body: t(
        'buildTracks.enterprise.body',
        'Turning skills, home-based work, and small businesses into sustainable enterprises — with business planning, financial literacy, digital tools, branding, pricing, customer management, and market access.'
      ),
      motto: t('buildTracks.enterprise.motto', 'From skill to income — cocoon to flight.'),
      cta: t('buildTracks.enterprise.cta', 'Grow Your Enterprise'),
      readMoreHref: '/enterprise-flightpath',
      primary: '#B85C1A',
      accent: '#E8823C',
      soft: 'rgba(232,130,60,0.10)',
      Icon: Sprout,
    },
  ]
}

export function BuildTracks() {
  const { t } = useTranslation()
  const { track, selectTrack } = useTrack()
  const CARDS = getCards(t)

  return (
    <section
      id="build-tracks"
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <div className="container-wise relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{t('nav.links.build-tracks', 'Build Tracks')}</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
            {t('buildTracks.title', 'Choose your flight path')}
          </h2>
          <p className="mt-4 text-lg text-plum/70">
            {t('buildTracks.subtitle', 'Two tracks. One destination: women-led enterprise growth.')}
          </p>
          <p className="mt-3 text-sm text-plum/50">
            {t(
              'buildTracks.hint',
              'Select a track to preview it in the scene above — the whole page responds to your choice.'
            )}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {CARDS.map((c, i) => {
            const active = track === c.id
            return (
              <Reveal key={c.id} delay={i * 0.1}>
                <motion.div
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => selectTrack(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      selectTrack(c.id)
                    }
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className={cn(
                    'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border p-8 transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:p-10'
                  )}
                  style={{
                    borderColor: active ? c.accent : 'rgba(74,46,61,0.12)',
                    background: active ? c.soft : '#fff',
                    boxShadow: active
                      ? `0 24px 60px -24px ${c.accent}`
                      : '0 1px 2px rgb(74 46 61 / 0.05), 0 16px 40px -24px rgb(74 46 61 / 0.35)',
                  }}
                >
                  {/* index watermark */}
                  <span
                    className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[9rem] font-bold leading-none transition-opacity duration-500"
                    style={{ color: c.accent, opacity: active ? 0.14 : 0.05 }}
                  >
                    {c.index}
                  </span>

                  <div className="relative flex items-center justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-500"
                      style={{
                        background: active ? c.primary : c.soft,
                        color: active ? '#fff' : c.primary,
                      }}
                    >
                      <c.Icon className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                    <AnimatedBadge active={active} accent={c.accent} />
                  </div>

                  <p
                    className="relative mt-6 text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: c.accent }}
                  >
                    {c.kicker}
                  </p>
                  <h3 className="relative mt-2 font-display text-3xl font-bold text-plum">
                    {c.title}
                  </h3>
                  <p className="relative mt-3 text-[15px] font-medium text-plum/75">
                    {c.lead}
                  </p>
                  <p className="relative mt-4 text-[15px] leading-relaxed text-plum/60">
                    {c.body}
                  </p>

                  <p
                    className="relative mt-6 font-display text-lg font-medium italic"
                    style={{ color: c.primary }}
                  >
                    {c.motto}
                  </p>

                  <Link
                    to={c.readMoreHref}
                    onClick={(e) => e.stopPropagation()}
                    className="link-underline relative mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold"
                    style={{ color: c.accent }}
                  >
                    {t('buildTracks.readMore', 'Read more')}
                  </Link>

                  <div className="relative mt-8 flex items-center justify-between pt-6">
                    <a
                      href="#enter-the-lab"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                      style={{ background: c.primary }}
                    >
                      {c.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <span
                      className="text-xs font-medium transition-opacity duration-300"
                      style={{ color: c.accent, opacity: active ? 1 : 0 }}
                    >
                      {t('buildTracks.previewingAbove', 'Previewing above ↑')}
                    </span>
                  </div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>

        <SectionJournal section="build-tracks" />
      </div>
    </section>
  )
}

function AnimatedBadge({ active, accent }: { active: boolean; accent: string }) {
  const { t } = useTranslation()
  return (
    <motion.span
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
      style={{ background: accent, color: '#fff' }}
    >
      <Check className="h-3.5 w-3.5" /> {t('buildTracks.selected', 'Selected')}
    </motion.span>
  )
}
