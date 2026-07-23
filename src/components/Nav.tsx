import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { WiseMark } from './WiseLabLogo'
import { Button } from './ui/button'
import { MagneticButton } from './MagneticButton'
import { NAV_LINKS } from '@/lib/nav'
import { useTrack } from '@/lib/useTrackState'
import { cn } from '@/lib/utils'

export function Nav() {
  const { t } = useTranslation()
  const { track } = useTrack()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['hero', ...NAV_LINKS.map((l) => l.id)]
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // over hero with a track active -> dark backdrop -> white logo/links
  const overDarkHero = !scrolled && active === 'hero' && track !== 'neutral'
  const lightText = overDarkHero
  const logoVariant = lightText ? 'white' : 'color'

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'sticky top-0 z-50 transition-colors duration-500',
        scrolled
          ? 'border-b border-plum/10 bg-beige/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      )}
    >
      <nav className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-3 md:px-10">
        <a
          href="#hero"
          aria-label={t('nav.home')}
          className="flex items-center gap-3 shrink-0"
        >
          <WiseMark variant={logoVariant} className="h-20 w-auto" />
        </a>

        {/* Links + CTA — all on one line */}
        <div className="order-3 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:order-none lg:w-auto lg:gap-x-4 xl:gap-x-5">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-active={active === l.id}
              className={cn(
                'link-underline whitespace-nowrap text-[13px] xl:text-sm font-medium transition-colors',
                lightText
                  ? 'text-white/85 hover:text-white'
                  : 'text-plum/75 hover:text-plum',
                active === l.id && (lightText ? 'text-white' : 'text-plum')
              )}
            >
              {t(`nav.links.${l.id}`, l.label)}
            </a>
          ))}
          <MagneticButton strength={0.4}>
            <Button
              asChild
              size="sm"
              className="h-9 px-4 shadow-none hover:shadow-none"
              style={{ background: 'var(--track-primary)', color: 'var(--track-ink)' }}
            >
              <a href="#enter-the-lab">{t('nav.cta')}</a>
            </Button>
          </MagneticButton>
        </div>
      </nav>
    </motion.header>
  )
}
