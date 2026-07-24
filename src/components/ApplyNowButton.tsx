import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Rocket } from 'lucide-react'
import { usePrefersReducedMotion } from '@/lib/useTrackState'

const MotionLink = motion(Link)

/**
 * Persistent "Apply Now" launcher, fixed bottom-left on every page (mirrors
 * WhatsAppButton, fixed bottom-right). Links straight to the Founder
 * Flightpath application — the flagship "her idea, her enterprise" intake
 * form for women founders (WISE Incubation Application Form) — rather than
 * a track picker, since Enter the Lab already offers the other three
 * tracks (Enterprise/Mentor/Partner) as their own cards.
 */
export function ApplyNowButton() {
  const { t } = useTranslation()
  const reduce = usePrefersReducedMotion()

  return (
    <MotionLink
      to="/apply/founder"
      aria-label={t('applyNow.cta')}
      initial={reduce ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-6 left-6 z-40 flex h-14 items-center gap-2.5 rounded-full px-5 text-sm font-semibold text-plum bg-coral shadow-[0_4px_12px_-4px_rgba(227,132,112,0.35)]"
    >
      <Rocket className="h-5 w-5" />
      {t('applyNow.cta')}
    </MotionLink>
  )
}
