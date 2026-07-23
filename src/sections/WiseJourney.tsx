import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { SectionJournal } from '@/components/SectionJournal'

export function WiseJourney() {
  const { t } = useTranslation()
  return (
    <section id="wise-journey" className="relative overflow-hidden py-28 md:py-36">
      <div className="grain" />
      <div className="container-wise relative">
        {/* Intro */}
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">{t('wiseJourney.eyebrow', 'The WISE Journey')}</p>
              <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.02] text-plum">
                {t('wiseJourney.title1', 'From Cocoon')}
                <br />
                {t('wiseJourney.title2', 'to Flight')}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-plum/70">
                {t(
                  'wiseJourney.intro',
                  "Pakistan's premier platform, exclusively for women-led ideas — to find the room, the resources, and the recognition to become enterprises."
                )}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <motion.div
                className="mt-12 hidden lg:block"
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="/wise-lab-logo.png"
                  alt="WISE Lab — Her idea. Her enterprise."
                  className="h-72 w-auto max-w-full object-contain xl:h-80"
                />
              </motion.div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-pretty text-lg leading-relaxed text-plum/80">
                {t(
                  'wiseJourney.body1',
                  'WISE Lab — Women Innovation and Startup Empowerment Lab — is a national flagship platform supporting women-led startups, entrepreneurs, and MSMEs across Pakistan. Built around the philosophy of transformation, it supports women at the most critical stages of their journey — when ideas are still forming, businesses are still finding direction, and founders are ready to move from hidden potential to visible impact.'
                )}
              </p>
            </Reveal>

            {/* Signature line */}
            <Reveal delay={0.15}>
              <blockquote className="my-12 border-l-2 border-coral pl-6">
                <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium italic leading-snug text-plum">
                  {t('wiseJourney.quoteLine1', 'Because her idea was never small.')}
                  <br />
                  <span className="text-coral">{t('wiseJourney.quoteLine2', 'The room was.')}</span>
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-pretty text-lg leading-relaxed text-plum/80">
                {t(
                  'wiseJourney.body2',
                  'Through incubation, MSME training, mentorship, market access, investor readiness, digital enablement, and ecosystem partnerships, WISE Lab helps women transform their ideas into sustainable businesses — and their ambition into enterprise.'
                )}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Vision + Mission */}
        <div className="mt-24 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="group relative h-full overflow-hidden rounded-3xl bg-white p-8 shadow-card transition-all duration-500 hover:shadow-card-hover md:p-10">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-10 translate-x-10 rounded-full bg-teal/10 blur-2xl transition-transform duration-700 group-hover:translate-x-6" />
              <p className="eyebrow" style={{ color: '#2C7A70' }}>
                {t('wiseJourney.vision.eyebrow', 'The Flight Path')}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-plum">
                {t('wiseJourney.vision.title', 'Our Vision')}
              </h3>
              <p className="mt-4 leading-relaxed text-plum/75">
                {t(
                  'wiseJourney.vision.body',
                  "To become Pakistan's leading platform exclusively for women-led innovation and enterprise — enabling women across the country to transform ideas into sustainable businesses, access the right spaces, and contribute to inclusive digital and economic growth."
                )}
              </p>
              <p className="mt-5 font-display text-lg font-medium italic text-teal">
                {t(
                  'wiseJourney.vision.line',
                  "A future where she doesn't wait for opportunity — she enters the room & builds it."
                )}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="group relative h-full overflow-hidden rounded-3xl bg-white p-8 shadow-card transition-all duration-500 hover:shadow-card-hover md:p-10">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-10 translate-x-10 rounded-full bg-coral/10 blur-2xl transition-transform duration-700 group-hover:translate-x-6" />
              <p className="eyebrow" style={{ color: '#E38470' }}>
                {t('wiseJourney.mission.eyebrow', 'The WISE Way')}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-plum">
                {t('wiseJourney.mission.title', 'Our Mission')}
              </h3>
              <p className="mt-4 leading-relaxed text-plum/75">
                {t(
                  'wiseJourney.mission.body',
                  'To empower women entrepreneurs, startups, and MSMEs with structured incubation, practical business training, mentorship, market linkages, investor readiness, digital tools, and ecosystem access — from the cocoon stage of potential to the flight stage of enterprise.'
                )}
              </p>
              <p className="mt-5 font-display text-lg font-medium italic text-coral">
                {t(
                  'wiseJourney.mission.line',
                  'Nurture the idea. Expand the room. Launch the enterprise.'
                )}
              </p>
            </div>
          </Reveal>
        </div>

        <SectionJournal section="wise-journey" />
      </div>
    </section>
  )
}
