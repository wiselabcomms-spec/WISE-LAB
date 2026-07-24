import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Hero3D } from '@/components/Hero3D'
import { TrackToggle } from '@/components/Hero3D/TrackToggle'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/MagneticButton'
import { useTrack } from '@/lib/useTrackState'
import { TRACK_THEME } from '@/lib/theme'
import { isRtl } from '@/i18n'
import { cn } from '@/lib/utils'

export function Hero() {
  const { t, i18n } = useTranslation()
  const { track } = useTrack()
  const dark = track !== 'neutral'
  // LTR (English): figure right, text left (default reading order).
  // RTL (Urdu/Pashto/Punjabi): mirrored — figure left, text right — so the
  // text sits on the side reading naturally starts from.
  const rtl = isRtl(i18n.language)

  // Split on spaces so the line-reveal animation works for any translated
  // headline, not just the hardcoded English word count.
  const words = t('hero.headline', 'Her idea. Her enterprise.').split(' ')

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Atmospheric background — recolors with the active track */}
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{
          background: `radial-gradient(120% 120% at ${rtl ? '28%' : '72%'} 30%, var(--hero-bg-b) 0%, var(--hero-bg-a) 62%)`,
        }}
      />
      {/* accent glow */}
      <div
        className="pointer-events-none absolute -z-10 h-[60vh] w-[60vh] rounded-full blur-[120px] transition-all duration-700"
        style={{
          [rtl ? 'left' : 'right']: '14%',
          top: '18%',
          background: 'var(--track-glow)',
          opacity: dark ? 0.7 : 0.35,
        }}
      />
      <div className="grain -z-10" />

      {/* 3D figure — occupies the side opposite the text on desktop; hidden on
          mobile where the particle silhouette killed text contrast */}
      <div
        className={cn(
          'absolute inset-0 hidden lg:block',
          rtl ? 'lg:right-[42%]' : 'lg:left-[42%]'
        )}
      >
        <Hero3D />
      </div>

      <div className="container-wise relative z-10 flex flex-1 flex-col justify-center pt-28 pb-40 md:pt-32 lg:items-start">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow theme-shift"
            style={{ color: dark ? TRACK_THEME[track].accent : undefined }}
          >
            {t('hero.eyebrow', 'Women Innovation & Startup Empowerment Lab')}
          </motion.p>

          <h1
            className="mt-5 font-display text-[clamp(2.9rem,7vw,5.5rem)] font-bold leading-[0.98] theme-shift"
            style={{ color: dark ? 'var(--track-ink)' : '#4A2E3D' }}
          >
            {words.map((w, i) => (
              <span key={i} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.6 + i * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-md text-lg leading-relaxed theme-shift"
            style={{ color: dark ? 'rgba(255,255,255,0.78)' : 'rgba(74,46,61,0.72)' }}
          >
            {t(
              'hero.subheadline',
              'Where women-led ideas move from quiet potential to visible enterprise.'
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Button
                asChild
                variant="track"
                size="lg"
                style={{ background: 'var(--track-primary)' }}
              >
                <a href="#enter-the-lab">{t('nav.cta', 'Enter the Lab')}</a>
              </Button>
            </MagneticButton>
            <span
              className="text-sm theme-shift"
              style={{ color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(74,46,61,0.55)' }}
            >
              {t('hero.previewHint', 'or preview a flight path ↓')}
            </span>
          </motion.div>

          {/* Track selectors — the centerpiece interaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <TrackToggle />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
