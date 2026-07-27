import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/useTrackState'
import { cn } from '@/lib/utils'

type Variant = 'color' | 'white' | 'black'

/* ============================================================================
   Real logo (raster). Drop the brand logo at public/wise-lab-logo.png.
   - color : shown as-is
   - white : CSS-filtered to solid white   (for dark backgrounds)
   - black : CSS-filtered to solid near-black
   A white background is auto-keyed to transparent so it composites cleanly on
   any surface. If the file is missing, everything falls back to the SVG mark.
   ========================================================================== */

const LOGO_SRC = '/wise-lab-logo.png'
// Dedicated tight crop of just the butterfly (no surrounding canvas/wordmark)
// — using this instead of cropping LOGO_SRC with CSS is what keeps the nav
// mark from showing a slab of the full lockup's empty margin above the
// wordmark (that margin was rendering as a big blank gap in the header).
const MARK_SRC = '/wise-lab-mark.png'

const FILTER: Record<Variant, string | undefined> = {
  color: undefined,
  white: 'brightness(0) saturate(100%) invert(100%)',
  black: 'brightness(0)',
}

interface KeyedImage {
  src: string
  /** natural width / height, so callers can size a box without guessing */
  aspect: number
}

// module-level cache keyed by src: load once per asset, key white -> transparent, share the result
const keyedImageCache = new Map<string, Promise<KeyedImage | null>>()
function getKeyedImage(assetSrc: string): Promise<KeyedImage | null> {
  let promise = keyedImageCache.get(assetSrc)
  if (!promise) {
    promise = new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        try {
          const c = document.createElement('canvas')
          c.width = img.naturalWidth
          c.height = img.naturalHeight
          const g = c.getContext('2d')!
          g.drawImage(img, 0, 0)
          const data = g.getImageData(0, 0, c.width, c.height)
          const a = data.data
          for (let i = 0; i < a.length; i += 4) {
            if (a[i] > 242 && a[i + 1] > 242 && a[i + 2] > 242) a[i + 3] = 0
          }
          g.putImageData(data, 0, 0)
          resolve({ src: c.toDataURL('image/png'), aspect: img.naturalWidth / img.naturalHeight })
        } catch {
          resolve(null)
        }
      }
      img.onerror = () => resolve(null)
      img.src = assetSrc
    })
    keyedImageCache.set(assetSrc, promise)
  }
  return promise
}

// undefined = loading, null = missing/failed, KeyedImage = keyed data URL + aspect
function useKeyedImage(assetSrc: string): KeyedImage | null | undefined {
  const [result, setResult] = useState<KeyedImage | null | undefined>(undefined)
  useEffect(() => {
    let alive = true
    setResult(undefined)
    getKeyedImage(assetSrc).then((r) => {
      if (alive) setResult(r)
    })
    return () => {
      alive = false
    }
  }, [assetSrc])
  return result
}

interface MarkProps {
  variant?: Variant
  animateIntro?: boolean
  className?: string
}

/** Butterfly mark (used in the nav next to an HTML wordmark). */
export function WiseMark({ variant = 'color', animateIntro = false, className }: MarkProps) {
  const mark = useKeyedImage(MARK_SRC)
  const reduce = usePrefersReducedMotion()

  if (mark === null) {
    return <WiseMarkSVG variant={variant} animateIntro={animateIntro} className={className} />
  }

  if (mark === undefined) {
    // Still loading — reserve a roughly-square box so nothing shifts, but
    // don't paint the SVG fallback here: swapping it for the raster mark a
    // beat later is what causes the visible "flash" (different artwork).
    return <div className={className} style={{ aspectRatio: '1' }} />
  }

  const intro =
    animateIntro && !reduce
      ? { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } }
      : {}

  return (
    <motion.div
      {...intro}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={{ aspectRatio: String(mark.aspect) }}
    >
      <img
        src={mark.src}
        alt="WISE Lab"
        className="h-full w-full object-contain"
        style={{ filter: FILTER[variant] }}
        draggable={false}
      />
    </motion.div>
  )
}

interface LogoProps {
  variant?: Variant
  animateIntro?: boolean
  showTagline?: boolean
  /** rendered height of the full lockup in px */
  size?: number
  className?: string
}

/** Full stacked lockup: mark + wordmark + tagline. */
export function WiseLabLogo({
  variant = 'color',
  animateIntro = false,
  showTagline = true,
  size = 108,
  className,
}: LogoProps) {
  const logo = useKeyedImage(LOGO_SRC)
  const reduce = usePrefersReducedMotion()

  if (logo === null) {
    return (
      <WiseLabLogoSVG
        variant={variant}
        animateIntro={animateIntro}
        showTagline={showTagline}
        size={size * 0.62}
        className={className}
      />
    )
  }

  if (logo === undefined) {
    // Still loading — reserve space without painting the (differently
    // proportioned) SVG fallback, which is what causes the visible flash.
    return <div className={cn('w-auto', className)} style={{ height: size }} />
  }

  const intro =
    animateIntro && !reduce
      ? { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }
      : {}

  return (
    <motion.img
      {...intro}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      src={logo.src}
      alt="WISE Lab — Her idea. Her enterprise."
      className={cn('w-auto', className)}
      style={{ height: size, filter: FILTER[variant] }}
      draggable={false}
    />
  )
}

export default WiseLabLogo

/* ============================================================================
   SVG fallback (used only if the raster logo is missing). Faithful recreation
   of the butterfly mark + wordmark.
   ========================================================================== */

interface Palette {
  wings: string
  leaves: string
  flame: string
  wise: string
  lab: string
  tagline: string
}

const PALETTES: Record<Variant, Palette> = {
  color: {
    wings: '#4A2E3D',
    leaves: '#2C7A70',
    flame: '#E38470',
    wise: '#4A2E3D',
    lab: '#E38470',
    tagline: '#4A2E3D',
  },
  white: {
    wings: '#FFFFFF',
    leaves: '#FFFFFF',
    flame: '#FFFFFF',
    wise: '#FFFFFF',
    lab: 'rgba(255,255,255,0.82)',
    tagline: 'rgba(255,255,255,0.7)',
  },
  black: {
    wings: '#1A1216',
    leaves: '#1A1216',
    flame: '#1A1216',
    wise: '#1A1216',
    lab: '#1A1216',
    tagline: 'rgba(26,18,22,0.7)',
  },
}

const WING =
  'M99,111 C84,86 57,88 41,71 C25,54 29,29 40,13 C54,35 76,45 89,65 C98,79 99,97 99,111 Z'
const LEAF = 'M97,108 C77,111 58,117 51,133 C66,121 84,115 98,111 Z'
const FLAME_MAIN =
  'M100,112 C95,94 89,82 98,60 C103,46 95,35 101,19 C103,12 101,6 100,2 C98,8 96,15 97,25 C99,41 90,51 95,72 C98,89 95,100 100,112 Z'
const FLAME_WISP = 'M104,110 C109,98 107,86 114,73 C111,89 113,100 106,110 Z'

function WiseMarkSVG({ variant = 'color', animateIntro = false, className }: MarkProps) {
  const p = PALETTES[variant]
  const reduce = usePrefersReducedMotion()
  const animate = animateIntro && !reduce

  const group: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
  }
  const wingsV: Variants = {
    hidden: { opacity: 0, scale: 0.72, y: 6 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }
  const leavesV: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }
  const flameV: Variants = {
    hidden: { opacity: 0, scaleY: 0.25, y: 12 },
    show: { opacity: 1, scaleY: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }
  const originBottom = {
    transformBox: 'fill-box' as const,
    transformOrigin: 'center bottom',
  }

  return (
    <svg viewBox="0 0 200 140" className={className} role="img" aria-label="WISE Lab" fill="none">
      <title>WISE Lab</title>
      <motion.g
        variants={animate ? group : undefined}
        initial={animate ? 'hidden' : false}
        animate={animate ? 'show' : undefined}
      >
        <motion.g variants={animate ? wingsV : undefined} style={originBottom}>
          <path d={WING} fill={p.wings} />
          <path d={WING} fill={p.wings} transform="translate(200,0) scale(-1,1)" />
        </motion.g>
        <motion.g variants={animate ? leavesV : undefined} style={originBottom}>
          <path d={LEAF} fill={p.leaves} />
          <path d={LEAF} fill={p.leaves} transform="translate(200,0) scale(-1,1)" />
        </motion.g>
        <motion.g variants={animate ? flameV : undefined} style={originBottom}>
          <path d={FLAME_MAIN} fill={p.flame} />
          <path d={FLAME_WISP} fill={p.flame} opacity={0.9} />
          <path d={FLAME_WISP} fill={p.flame} opacity={0.9} transform="translate(200,0) scale(-1,1)" />
        </motion.g>
      </motion.g>
    </svg>
  )
}

function WiseLabLogoSVG({ variant = 'color', animateIntro = false, showTagline = true, size = 92, className }: LogoProps) {
  const p = PALETTES[variant]
  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <WiseMarkSVG variant={variant} animateIntro={animateIntro} className="w-auto" />
      <div className="flex flex-col items-center leading-none" style={{ marginTop: size * 0.06 }}>
        <div className="font-sans font-bold tracking-tight" style={{ fontSize: size * 0.44, lineHeight: 1 }}>
          <span style={{ color: p.wise }}>WISE</span> <span style={{ color: p.lab }}>Lab</span>
        </div>
        {showTagline && (
          <div
            className="font-sans font-semibold uppercase"
            style={{
              color: p.tagline,
              letterSpacing: '0.3em',
              fontSize: Math.max(size * 0.11, 8),
              marginTop: size * 0.09,
              marginRight: '-0.3em',
            }}
          >
            Her Idea . Her Enterprise
          </div>
        )}
      </div>
    </div>
  )
}
