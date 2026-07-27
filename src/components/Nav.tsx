import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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

  // Drawer: lock page scroll (Lenis drives window scroll, so hiding overflow
  // on the root is enough), close on Escape, and move focus into the panel.
  useEffect(() => {
    if (!menuOpen) return
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      root.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

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
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-x-4 px-6 py-2 md:px-10 xl:py-3 2xl:gap-x-6">
        <a
          href="#hero"
          aria-label={t('nav.home')}
          className="flex items-center gap-3 shrink-0"
        >
          {/* smaller on phones/tablets now that links live in the drawer, not
              inline — no need to reserve the taller desktop header there.
              Steps back down at xl so the full link row + CTA fit on one
              line on a 1280px laptop; the drawer handles everything narrower. */}
          <WiseMark variant={logoVariant} className="h-14 w-auto sm:h-16 xl:h-24 2xl:h-32" />
        </a>

        {/* Desktop links + CTA */}
        <div className="hidden xl:flex xl:items-center xl:flex-nowrap xl:gap-x-4 2xl:gap-x-5">
          <div className="flex flex-nowrap gap-x-4 2xl:gap-x-5">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-active={active === l.id}
                className={cn(
                  'link-underline whitespace-nowrap text-[13px] 2xl:text-sm font-medium transition-colors',
                  lightText
                    ? 'text-white/85 hover:text-white'
                    : 'text-plum/75 hover:text-plum',
                  active === l.id && (lightText ? 'text-white' : 'text-plum')
                )}
              >
                {t(`nav.links.${l.id}`, l.label)}
              </a>
            ))}
          </div>
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

        {/* Mobile / tablet menu trigger */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t('nav.openMenu')}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center transition-colors xl:hidden',
            lightText
              ? 'text-white'
              : 'text-plum'
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      {/* Mobile drawer — portalled to <body> so it can't inherit the header's
          stacking/containing block (the header animates its own transform). */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <div className="xl:hidden">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="fixed inset-0 z-[60] bg-plum/50 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={t('nav.home')}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-[84%] max-w-sm flex-col border-l border-plum/10 bg-beige shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4">
                <WiseMark variant="color" className="h-16 w-auto" />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMenu}
                  aria-label={t('nav.closeMenu')}
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-plum transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    data-active={active === l.id}
                    onClick={closeMenu}
                    className={cn(
                      'rounded-xl px-3 py-3 text-[15px] font-medium transition-colors',
                      active === l.id
                        ? 'bg-plum/[0.06] text-plum'
                        : 'text-plum/70 hover:bg-plum/[0.04] hover:text-plum'
                    )}
                  >
                    {t(`nav.links.${l.id}`, l.label)}
                  </a>
                ))}
              </div>

              <div className="border-t border-plum/10 px-6 py-5">
                <Button
                  asChild
                  size="lg"
                  className="w-full shadow-none hover:shadow-none"
                  style={{ background: 'var(--track-primary)', color: 'var(--track-ink)' }}
                >
                  <a href="#enter-the-lab" onClick={closeMenu}>
                    {t('nav.cta')}
                  </a>
                </Button>
              </div>
            </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.header>
  )
}
