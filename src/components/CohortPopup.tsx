import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'

const SESSION_KEY = 'wise_cohort1_popup_dismissed'
// 🔗 Replace this URL with your actual Google Form / application link
const APPLY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScc2bPdx5MvD5JZCgiwjaJijk3wBlVhxz45f-KNwFAHbxv9qg/viewform'

export function CohortPopup() {
  const [visible, setVisible] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_KEY)
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 900)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    if (dontShowAgain) {
      sessionStorage.setItem(SESSION_KEY, '1')
    }
    setVisible(false)
  }

  const handleApply = () => {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
    window.open(APPLY_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              {/* Top accent line */}
              <div
                className="h-1 w-full"
                style={{ background: 'linear-gradient(90deg,#2E7D7B,#4ECDC4,#2E7D7B)' }}
              />

              {/* Close button */}
              <button
                onClick={dismiss}
                aria-label="Close popup"
                className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={14} />
              </button>

              <div className="px-6 pt-5 pb-6">
                {/* Badge */}
                <div className="mb-4 flex justify-center">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide uppercase"
                    style={{ borderColor: '#2E7D7B', color: '#2E7D7B', background: '#f0fafa' }}
                  >
                    <Zap size={11} className="fill-current" />
                    Applications Now Open
                    <Zap size={11} className="fill-current" />
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-center text-[22px] font-extrabold leading-tight text-gray-900 mb-2">
                  WISE Lab{' '}
                  <span style={{ color: '#2E7D7B' }}>Cohort 1</span>{' '}
                  is Live!
                </h2>

                {/* Subtext */}
                <p className="text-justify text-sm text-gray-500 mb-5 leading-relaxed">
                  Join Pakistan’s flagship innovation programme, designed specifically for women founders and entrepreneurs. Access the mentorship, capital, expertise, networks and facilities you need to move your venture forward with WISE Lab.
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handleApply}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg,#2E7D7B,#1a5c5a)' }}
                  >
                    Apply for Incubation
                    <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={dismiss}
                    className="rounded-xl py-3 px-4 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>

                {/* Priority note */}
                <div
                  className="flex gap-2.5 rounded-xl p-3 mb-4 text-[12px] leading-snug"
                  style={{ background: '#fff8e1', border: '1px solid #ffe082' }}
                >
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: '#f59e0b' }} />
                  <span className="text-amber-800">
                    <strong>Priority Seats:</strong> Don't wait applications for Cohort 1 are
                    reviewed on a rolling basis.
                  </span>
                </div>

                {/* Don't show again */}
                <label className="flex cursor-pointer items-center gap-2 text-[12px] text-gray-400 select-none">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="h-3.5 w-3.5 rounded accent-teal-700 cursor-pointer"
                  />
                  Don't show this popup again for this session
                </label>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
