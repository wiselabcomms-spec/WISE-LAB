import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Rocket, X, Clock, Sparkles, ArrowRight } from 'lucide-react'
import { usePrefersReducedMotion } from '@/lib/useTrackState'

/**
 * Persistent "Apply Now" launcher, fixed bottom-left on public pages.
 * When clicked, notifies visitors that applications for the current cohort
 * are currently closed and guides them to stay updated for the next cycle.
 */
export function ApplyNowButton() {
  const { t } = useTranslation()
  const reduce = usePrefersReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Close dialog on Escape key press
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Navigate or smooth scroll to the newsletter section
  const handleStayUpdated = () => {
    setIsOpen(false)
    if (location.pathname === '/') {
      const el = document.getElementById('newsletter')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    navigate('/#newsletter')
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t('applyNow.cta', 'Apply Now')}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 left-6 z-40 flex h-14 items-center gap-2.5 rounded-full px-5 text-sm font-semibold text-plum bg-[#FF8A65] shadow-[0_4px_16px_-2px_rgba(255,138,101,0.45)] hover:shadow-[0_6px_22px_-2px_rgba(255,138,101,0.6)] transition-shadow cursor-pointer"
      >
        <Rocket className="h-5 w-5" />
        {t('applyNow.cta', 'Apply Now')}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="closed-modal-title"
              aria-describedby="closed-modal-desc"
              initial={reduce ? false : { scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-plum/10 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Accent Gradient Bar */}
              <div
                className="h-1.5 w-full"
                style={{ background: 'linear-gradient(90deg, #FF8A65, #2E7D7B, #3D1152)' }}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t('applyNow.close', 'Close')}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-plum/5 text-plum/70 hover:bg-plum/10 hover:text-plum transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-6 sm:p-7">
                {/* Header with Icon & Status Pill */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-700 border border-rose-200/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                      {t('applyNow.closedBadge', 'Applications Closed')}
                    </span>
                    <h3
                      id="closed-modal-title"
                      className="text-xl font-bold tracking-tight text-gray-950 mt-1 font-display"
                    >
                      {t('applyNow.closedTitle', 'Applications are Closed')}
                    </h3>
                  </div>
                </div>

                {/* Primary Message */}
                <p
                  id="closed-modal-desc"
                  className="text-sm leading-relaxed text-gray-600 mb-5"
                >
                  {t(
                    'applyNow.closedMessage',
                    'Applications for WISE Lab Cohort 1 are currently closed. Thank you for your interest! Stay connected with us to be the first to know when admissions open for upcoming cohorts and initiatives.'
                  )}
                </p>

                {/* Info Callout Box */}
                <div className="rounded-2xl bg-[#F4F9F9] border border-[#2E7D7B]/20 p-4 mb-6">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-[#2E7D7B] mt-0.5" />
                    <p className="text-xs leading-relaxed text-[#134443]">
                      Missed this cycle? Don’t worry! Subscribe to our newsletter to receive an early notification the moment the next cohort opens.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:w-auto flex-1 rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-center"
                  >
                    {t('applyNow.close', 'Close')}
                  </button>
                  <button
                    type="button"
                    onClick={handleStayUpdated}
                    className="w-full sm:w-auto flex-[1.4] inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E7D7B] py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#256866] transition-all cursor-pointer"
                  >
                    <span>{t('applyNow.stayUpdated', 'Stay Updated')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
