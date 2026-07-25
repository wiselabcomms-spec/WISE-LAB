import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'

export function WiseReports() {
  const { t } = useTranslation()
  return (
    <section id="wise-reports" className="relative overflow-hidden bg-white py-28 md:py-36">
      <div className="container-wise relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{t('nav.links.wise-reports', 'WISE Reports')}</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
            {t('wiseReports.title', 'Transparency in every stage of growth')}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-plum/70">
            {t(
              'wiseReports.subtitle',
              'Annual audit reports and programme impact summaries will be published here as they become available, so our partners and community can track progress alongside us.'
            )}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-plum/15 bg-beige/40 p-10 text-center md:p-14">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-plum/5 text-plum/50">
              <FileText className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <p className="max-w-md text-plum/60">
              {t('wiseReports.empty', 'Reports are being prepared and will appear here soon.')}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
