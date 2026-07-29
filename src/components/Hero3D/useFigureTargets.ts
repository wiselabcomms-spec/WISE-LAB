import { useEffect, useState } from 'react'
import { buildFigureTargets } from '@/lib/figures/generate'
import {
  confuse,
  loadImage,
  makeSeeds,
  sampleSilhouette,
} from '@/lib/figures/sampleImage'

export interface FigureTargets {
  count: number
  neutral: Float32Array
  founder: Float32Array
  enterprise: Float32Array
  seeds: Float32Array
  /** true once the real artwork loaded; false while on the procedural fallback */
  fromArt: boolean
}

// Drop these two PNGs in /public/figures to drive the hero from real artwork:
//   founder.png    — the laptop girl (startup / blue)
//   enterprise.png — the girl holding a shirt on a hanger (business / orange)
const FOUNDER_SRC = '/figures/founder.jpeg'
const ENTERPRISE_SRC = '/figures/enterprise.jpeg'

/**
 * Loads the two silhouettes and samples them into registered point clouds.
 * Falls back to the procedural figure if the artwork isn't present yet, so the
 * hero always renders something.
 */
export function useFigureTargets(count: number): FigureTargets | null {
  const [targets, setTargets] = useState<FigureTargets | null>(null)

  useEffect(() => {
    let alive = true

    const fallback = (): FigureTargets => {
      const t = buildFigureTargets(count)
      return {
        count,
        neutral: t.neutral,
        founder: t.founder,
        enterprise: t.enterprise,
        seeds: t.seeds,
        fromArt: false,
      }
    }

    ;(async () => {
      try {
        const [imgF, imgE] = await Promise.all([
          loadImage(FOUNDER_SRC),
          loadImage(ENTERPRISE_SRC),
        ])
        const founder = sampleSilhouette(imgF, count, { seed: 0x1001 })
        const enterprise = sampleSilhouette(imgE, count, { seed: 0x2002 })
        // Neutral = a "confused", hazy cloud of her — present but undefined —
        // that resolves into the crisp figure once a path is chosen.
        const neutral = confuse(founder)
        if (alive)
          setTargets({
            count,
            neutral,
            founder,
            enterprise,
            seeds: makeSeeds(count),
            fromArt: true,
          })
      } catch {
        if (alive) setTargets(fallback())
      }
    })()

    return () => {
      alive = false
    }
  }, [count])

  return targets
}
