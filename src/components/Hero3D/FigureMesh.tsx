import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { TRACK_THEME } from '@/lib/theme'
import { useTrack, usePrefersReducedMotion } from '@/lib/useTrackState'
import { useFigureTargets, type FigureTargets } from './useFigureTargets'

const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uSizeScale;
  uniform float uIdle;
  uniform float uScatter;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec3 pos = position;
    // idle drift, amplified while "confused" (neutral) for a searching feel
    float d = uIdle * (0.024 + uScatter * 0.07);
    pos.x += sin(uTime * (0.5 + uScatter * 0.5) + aSeed * 6.2831) * d;
    pos.y += cos(uTime * (0.42 + uScatter * 0.5) + aSeed * 6.2831) * d;
    pos.z += sin(uTime * 0.6 + aSeed * 3.14) * d * 0.6;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float tw = 0.9 + 0.16 * sin(uTime * 1.6 + aSeed * 40.0);
    // wispier while confused (neutral), bold once resolved into a path
    gl_PointSize = aSize * uSizeScale * tw * (2.1 / -mv.z) * (1.0 - uScatter * 0.32);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float dist = length(c);
    float a = smoothstep(0.5, 0.12, dist);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * uOpacity);
  }
`

/** Loader: waits for the sampled artwork (or fallback) before rendering points. */
export function FigureMesh({ count }: { count: number }) {
  const targets = useFigureTargets(count)
  if (!targets) return null
  return <FigurePoints targets={targets} />
}

function FigurePoints({ targets }: { targets: FigureTargets }) {
  const { track } = useTrack()
  const reduce = usePrefersReducedMotion()
  const { viewport } = useThree()
  const count = targets.count

  // ~18% of particles get the highlight tone for depth/richness
  const highlight = useMemo(() => {
    const h = new Uint8Array(count)
    for (let i = 0; i < count; i++) h[i] = targets.seeds[i] > 0.82 ? 1 : 0
    return h
  }, [count, targets])

  const current = useMemo(
    () => new Float32Array(targets.neutral),
    [targets]
  )
  const colorCurrent = useMemo(() => new Float32Array(count * 3), [count])

  const sizes = useMemo(() => {
    const s = new Float32Array(count)
    // Smaller than the old 30-46 range: at that size, dots on a small
    // feature (the enterprise shirt's collar/cuffs) overlap into a solid
    // blob and lose their edges, even though the same size reads fine on
    // a large area like the torso. Crisper dots keep small shapes legible
    // without visibly thinning out the figure's bigger regions.
    for (let i = 0; i < count; i++) s[i] = 20 + targets.seeds[i] * 11
    return s
  }, [count, targets])

  const initialColors = useMemo(() => {
    const th = TRACK_THEME.neutral
    const cBody = new THREE.Color(th.figure)
    const cHi = new THREE.Color(th.figureHi)
    for (let i = 0; i < count; i++) {
      const c = highlight[i] ? cHi : cBody
      colorCurrent[i * 3] = c.r
      colorCurrent[i * 3 + 1] = c.g
      colorCurrent[i * 3 + 2] = c.b
    }
    return colorCurrent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, targets])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSizeScale: { value: 1 },
      // start fully visible so the figure never depends on the animation loop
      // ticking to be seen (some browsers/tabs throttle rAF to zero)
      uOpacity: { value: 1 },
      uIdle: { value: reduce ? 0 : 1 },
      uScatter: { value: 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const geomRef = useRef<THREE.BufferGeometry>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const targetColor = useMemo(() => new THREE.Color(), [])
  const bodyColor = useMemo(() => new THREE.Color(), [])
  const hiColor = useMemo(() => new THREE.Color(), [])

  const fit = Math.min(1, viewport.height / 6.6)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uIdle.value = reduce ? 0 : 1
    uniforms.uScatter.value = THREE.MathUtils.damp(
      uniforms.uScatter.value,
      track === 'neutral' ? 1 : 0,
      3,
      dt
    )

    const target =
      track === 'founder'
        ? targets.founder
        : track === 'enterprise'
          ? targets.enterprise
          : targets.neutral

    const th = TRACK_THEME[track]
    bodyColor.set(th.figure)
    hiColor.set(th.figureHi)

    const posAttr = geomRef.current.getAttribute('position') as THREE.BufferAttribute
    const colAttr = geomRef.current.getAttribute('aColor') as THREE.BufferAttribute

    if (reduce) {
      current.set(target)
      for (let i = 0; i < count; i++) {
        const c = highlight[i] ? hiColor : bodyColor
        colorCurrent[i * 3] = c.r
        colorCurrent[i * 3 + 1] = c.g
        colorCurrent[i * 3 + 2] = c.b
      }
    } else {
      for (let i = 0; i < count; i++) {
        const seed = targets.seeds[i]
        const k = 2.3 + seed * 2.4
        const f = 1 - Math.exp(-k * dt)
        const i3 = i * 3
        current[i3] += (target[i3] - current[i3]) * f
        current[i3 + 1] += (target[i3 + 1] - current[i3 + 1]) * f
        current[i3 + 2] += (target[i3 + 2] - current[i3 + 2]) * f

        targetColor.copy(highlight[i] ? hiColor : bodyColor)
        const cf = 1 - Math.exp(-3 * dt)
        colorCurrent[i3] += (targetColor.r - colorCurrent[i3]) * cf
        colorCurrent[i3 + 1] += (targetColor.g - colorCurrent[i3 + 1]) * cf
        colorCurrent[i3 + 2] += (targetColor.b - colorCurrent[i3 + 2]) * cf
      }
    }

    ;(posAttr.array as Float32Array).set(current)
    posAttr.needsUpdate = true
    ;(colAttr.array as Float32Array).set(colorCurrent)
    colAttr.needsUpdate = true

    if (groupRef.current) {
      const px = reduce ? 0 : state.pointer.x
      const py = reduce ? 0 : state.pointer.y
      const targetRotY =
        px * 0.3 + (reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.15) * 0.05)
      const targetRotX = -py * 0.14
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        4,
        dt
      )
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        4,
        dt
      )
      const breathe = reduce
        ? 1
        : 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.012
      groupRef.current.scale.setScalar(fit * breathe)
    }
  })

  return (
    <group ref={groupRef} scale={fit}>
      <points>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(current), 3]}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[new Float32Array(initialColors), 3]}
          />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[targets.seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  )
}
