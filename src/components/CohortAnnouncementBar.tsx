import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * Site-wide "Cohort 1 is open" strip, directly under the sticky nav — the
 * first thing on the page, not buried inside a section that requires
 * scrolling to reach.
 */
export function CohortAnnouncementBar() {
  const { t } = useTranslation()
  return (
    <Link
      to="/apply/founder"
      className="group flex w-full items-center justify-center gap-2 px-4 py-2.5 text-center text-[13px] font-semibold text-white transition-colors sm:text-sm"
      style={{ background: '#2E7D7B' }}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      {t('cohortBar.text', 'Cohort 1 applications are now open — apply to Founder Flightpath')}
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}
