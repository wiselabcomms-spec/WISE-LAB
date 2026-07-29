/**
 * Sample a silhouette image into a world-space point cloud.
 *
 * The two hero artworks (laptop girl / girl with a shirt on a hanger) are the
 * same figure in the same stride, so sampling both with an identical
 * normalization keeps their bodies registered — the morph reads as her
 * swapping the object, not two unrelated shapes.
 */

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`failed to load ${url}`))
    img.src = url
  })
}

// small deterministic PRNG so the cloud is stable between reloads
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

interface SampleOpts {
  maxDim?: number
  targetHeight?: number
  darkThreshold?: number
  alphaThreshold?: number
  zSpread?: number
  seed?: number
}

/**
 * Returns a Float32Array of `count` (x,y,z) points sampled uniformly from the
 * dark silhouette pixels, normalized to `targetHeight`, centered on origin,
 * feet at the bottom.
 */
export function sampleSilhouette(
  img: HTMLImageElement,
  count: number,
  opts: SampleOpts = {}
): Float32Array {
  const {
    maxDim = 280,
    targetHeight = 4.5,
    darkThreshold = 0.5,
    alphaThreshold = 40,
    zSpread = 0.2,
    seed = 0x9e3779,
  } = opts

  const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))

  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const ctx = cv.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h).data

  // collect silhouette (dark, opaque) pixels + bounding box
  const cand: number[] = []
  let minX = w,
    minY = h,
    maxX = 0,
    maxY = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (data[i + 3] < alphaThreshold) continue
      const lum =
        (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
      if (lum < darkThreshold) {
        cand.push(x, y)
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  const n = cand.length / 2
  if (n === 0) throw new Error('silhouette has no dark pixels')

  const bh = maxY - minY || 1
  const cx = (minX + maxX) / 2
  const s = targetHeight / bh

  const rnd = rng(seed)
  const out = new Float32Array(count * 3)
  for (let k = 0; k < count; k++) {
    const idx = Math.floor(rnd() * n) * 2
    const px = cand[idx] + (rnd() - 0.5)
    const py = cand[idx + 1] + (rnd() - 0.5)
    out[k * 3] = (px - cx) * s
    out[k * 3 + 1] = (maxY - py) * s - targetHeight / 2
    out[k * 3 + 2] = (rnd() * 2 - 1) * zSpread
  }
  return out
}

/**
 * Smear a figure into a hazy, "confused" cloud — she reads as present but
 * unformed/undefined, then resolves into the crisp silhouette on selection.
 */
export function confuse(src: Float32Array, seed = 0x7f3a19): Float32Array {
  const out = new Float32Array(src.length)
  const rnd = rng(seed)
  const count = src.length / 3
  const gauss = () => {
    let u = 0
    let v = 0
    while (u === 0) u = rnd()
    while (v === 0) v = rnd()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
  for (let k = 0; k < count; k++) {
    const i = k * 3
    out[i] = src[i] + gauss() * 0.34
    out[i + 1] = src[i + 1] + gauss() * 0.42
    out[i + 2] = src[i + 2] + gauss() * 0.3
  }
  return out
}

/** Disperse a point cloud into a soft nebula (the "unformed potential" neutral). */
export function disperse(src: Float32Array, seed = 0x1234abcd): Float32Array {
  const out = new Float32Array(src.length)
  const rnd = rng(seed)
  const count = src.length / 3
  for (let k = 0; k < count; k++) {
    const a = rnd() * Math.PI * 2
    const b = Math.acos(2 * rnd() - 1)
    const r = 0.22 + Math.pow(rnd(), 1.5) * 0.82
    out[k * 3] = src[k * 3] + Math.sin(b) * Math.cos(a) * r
    out[k * 3 + 1] = src[k * 3 + 1] + Math.cos(b) * r * 0.85
    out[k * 3 + 2] = src[k * 3 + 2] + Math.sin(b) * Math.sin(a) * r * 0.9
  }
  return out
}

export function makeSeeds(count: number, seed = 0x55aa): Float32Array {
  const rnd = rng(seed)
  const s = new Float32Array(count)
  for (let i = 0; i < count; i++) s[i] = rnd()
  return s
}
