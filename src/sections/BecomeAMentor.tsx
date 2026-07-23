import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Compass, Handshake, Lightbulb } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { SectionJournal } from '@/components/SectionJournal'

const WAYS_TO_HELP = [
  { key: 'share', Icon: Lightbulb },
  { key: 'network', Icon: Handshake },
  { key: 'shape', Icon: Compass },
] as const

/**
 * Dedicated "Become a Mentor" promotional section on the landing page —
 * distinct from (and linking to) the "Guide Her Growth" pillar card in
 * Enter the Lab, which is the application entry point. This section makes
 * the mentor track visible as its own moment on the page rather than only
 * living inside the 4-card grid.
 */
export function BecomeAMentor() {
  const { t } = useTranslation()
  return (
    <section
      id="become-a-mentor"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background: 'radial-gradient(120% 100% at 15% 100%, #eef7f5 0%, #f1e4d6 55%)',
      }}
    >
      <div className="grain" />
      <div className="container-wise relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow" style={{ color: '#2C7A70' }}>
                {t('mentorSection.eyebrow')}
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
                {t('mentorSection.title1')}
                <br />
                {t('mentorSection.title2')}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-plum/70">
                {t('mentorSection.body')}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                to="/apply/mentor"
                className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                style={{ background: '#2C7A70' }}
              >
                {t('mentorSection.cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <RevealGroup className="space-y-4" stagger={0.08}>
              {WAYS_TO_HELP.map(({ key, Icon }) => (
                <RevealItem key={key}>
                  <div className="flex gap-4 rounded-2xl border border-plum/10 bg-white p-6 shadow-card">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <Icon className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-plum">
                        {t(`mentorSection.ways.${key}.title`)}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-plum/65">
                        {t(`mentorSection.ways.${key}.body`)}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        <SectionJournal section="become-a-mentor" />
      </div>
    </section>
  )
}
