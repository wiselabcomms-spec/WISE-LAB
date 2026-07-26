import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'

export function VisionPage() {
  const { t } = useTranslation()
  return (
    <main className="relative min-h-screen overflow-hidden bg-beige py-16 pb-32 md:py-24 md:pb-32">
      <div className="grain" />
      <div className="container-wise relative max-w-3xl">
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-plum/60 transition-colors hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {t('visionPage.back', 'Back to WISE Lab')}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <article className="mt-10">
            <p className="eyebrow" style={{ color: '#2C7A70' }}>
              {t('visionPage.eyebrow', 'The Flight Path')}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.05] text-plum">
              {t('visionPage.title', 'Our Vision')}
            </h1>

            <div className="prose prose-plum mt-8 max-w-none space-y-6 text-[17px] leading-relaxed text-plum/80">
              <p>
                {t(
                  'visionPage.p1',
                  "To build Pakistan's leading platform for women-led innovation and enterprise — where ambitious ideas gain the skills, networks, capital, confidence, and market access needed to become sustainable businesses."
                )}
              </p>
              <p>
                {t(
                  'visionPage.p2',
                  "Over its five-year programme period, WISE Lab aims to create a nationally connected pipeline of women founders, technology startups, and micro-entrepreneurs who are equipped to participate meaningfully in Pakistan's digital and economic future."
                )}
              </p>
              <p>
                {t(
                  'visionPage.p3',
                  'Our vision goes beyond training women to start businesses. It is about building the right rooms, opening the right doors, and creating long-term pathways from ideas to enterprise, from local markets to national visibility, and from early traction to investment.'
                )}
              </p>
              <blockquote className="border-l-2 border-coral pl-6 font-display text-2xl font-medium italic text-plum">
                {t('visionPage.closingLine', 'Her idea was never small. The room was.')}
              </blockquote>
            </div>
          </article>
        </Reveal>
      </div>
    </main>
  )
}
