import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePrefersReducedMotion } from '@/lib/useTrackState'

const FALLBACK_NUMBER = '+923000000000'

function toWaLink(rawNumber: string) {
  const digits = rawNumber.replace(/[^\d]/g, '')
  return `https://wa.me/${digits}`
}

/**
 * Floating WhatsApp contact button, fixed bottom-right on every page.
 *
 * No real WISE Lab WhatsApp number was provided in any of the source
 * assets or the content brief — per the never-block-default-and-flag
 * policy, this defaults to VITE_WHATSAPP_NUMBER and, if that's unset,
 * silently does not render at all (rather than showing a fake number that
 * looks real to a site visitor). See TODO_FOR_HUMAN.md item 6.
 */
export function WhatsAppButton() {
  const { t } = useTranslation()
  const reduce = usePrefersReducedMotion()
  const configured = import.meta.env.VITE_WHATSAPP_NUMBER
  const number = configured || (import.meta.env.DEV ? FALLBACK_NUMBER : '')

  if (!number) return null

  return (
    <motion.a
      href={toWaLink(number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.ariaLabel')}
      initial={reduce ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_-4px_rgba(37,211,102,0.4)]"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
    </motion.a>
  )
}
