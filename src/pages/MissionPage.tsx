import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { useDocumentMeta } from '@/lib/useDocumentMeta'

const GOALS = [
  'missionPage.goals.incubate',
  'missionPage.goals.graduate',
  'missionPage.goals.pipeline',
  'missionPage.goals.train',
  'missionPage.goals.connect',
  'missionPage.goals.pathways',
  'missionPage.goals.visibility',
] as const

const GOAL_DEFAULTS: Record<(typeof GOALS)[number], string> = {
  'missionPage.goals.incubate': 'Incubate women-led technology startups through structured six-month cohorts.',
  'missionPage.goals.graduate':
    'Support at least 20 startups to successfully graduate each year, subject to the approved cohort and programme structure.',
  'missionPage.goals.pipeline': 'Build a five-year pipeline of approximately 100 women-led startup graduates.',
  'missionPage.goals.train':
    'Train 1,000 women entrepreneurs and micro-enterprises nationwide, with a target of approximately 200 participants annually.',
  'missionPage.goals.connect':
    'Connect participants with experienced mentors, investors, corporations, financial institutions, government bodies, universities, and ecosystem partners.',
  'missionPage.goals.pathways':
    'Create direct pathways to finance, markets, digital adoption, partnerships, and business growth.',
  'missionPage.goals.visibility':
    'Increase the visibility and investment readiness of women-led enterprises through investor summits, demo days, showcases, and strategic networking platforms.',
}

export function MissionPage() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: 'Our Mission',
    description:
      "WISE Lab's mission: empowering women entrepreneurs, startups, and MSMEs with incubation, training, mentorship, and market access.",
    path: '/mission',
  })
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
            {t('missionPage.back', 'Back to WISE Lab')}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <article className="mt-10">
            <p className="eyebrow" style={{ color: '#E38470' }}>
              {t('missionPage.eyebrow', 'The WISE Way')}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.05] text-plum">
              {t('missionPage.title', 'Our Mission')}
            </h1>

            <div className="prose prose-plum mt-8 max-w-none space-y-6 text-[17px] leading-relaxed text-plum/80">
              <p>
                {t(
                  'missionPage.intro',
                  "WISE Lab's mission is to identify, incubate, train, and empower women entrepreneurs through structured business development, technology enablement, mentorship, investment readiness, and access-to-market opportunities."
                )}
              </p>
              <p className="font-semibold text-plum">
                {t('missionPage.mandateIntro', "Across its five-year mandate, WISE Lab will:")}
              </p>
              <ul className="list-disc space-y-3 pl-5 marker:text-coral">
                {GOALS.map((key) => (
                  <li key={key}>{t(key, GOAL_DEFAULTS[key])}</li>
                ))}
              </ul>
              <p>
                {t(
                  'missionPage.outcome',
                  'WISE Lab is designed to help women move beyond participation towards measurable enterprise growth, stronger revenues, sustainable employment, and long-term economic impact.'
                )}
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </main>
  )
}
