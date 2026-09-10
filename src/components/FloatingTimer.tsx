import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/useTrackState'
import { X } from 'lucide-react'

export function FloatingTimer() {
  const reduce = usePrefersReducedMotion()
  const [isVisible, setIsVisible] = useState(true)

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0
  })

  useEffect(() => {
    // Set target date to September 10, 2026
    const targetDate = new Date('2026-09-10T23:59:59').getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        return true // Stop interval
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      })
      return false
    }

    // Call immediately so it doesn't show 0
    if (updateTimer()) return

    const interval = setInterval(() => {
      if (updateTimer()) clearInterval(interval)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const formatUnit = (unit: number) => unit.toString().padStart(2, '0')

  return (
    <AnimatePresence>
      <motion.div
        initial={reduce ? false : { x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center rounded-xl bg-[#2E8C8A] p-2 shadow-[0_4px_20px_-4px_rgba(46,140,138,0.5)]"
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#2E8C8A] shadow-md hover:scale-110 transition-transform"
          aria-label="Close timer"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="mb-1.5 text-[9px] font-bold tracking-wider text-white">
          APPLICATIONS CLOSE IN
        </div>

        <div className="flex gap-2">
          <TimeUnit value={formatUnit(timeLeft.days)} label="DAY(S)" />
          <TimeUnit value={formatUnit(timeLeft.hours)} label="HOUR(S)" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-9 w-10 items-center justify-center rounded bg-[#1C1C1E] text-xl font-bold tracking-widest text-white shadow-md">
        {value}
      </div>
      <span className="text-[8px] font-bold tracking-wide text-white/95">{label}</span>
    </div>
  )
}
