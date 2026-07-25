import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Rocket, Store, Compass, Network } from 'lucide-react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { SectionJournal } from '@/components/SectionJournal'

const MotionLink = motion(Link)

interface Pillar {
  title: string
  body: string
  cta: string
  color: string
  href: string
  Icon: typeof Rocket
}

function getPillars(t: TFunction): Pillar[] {
  return [
    {
      title: t('enterTheLab.founder.title', 'Founder Flightpath'),
      body: t(
        'enterTheLab.founder.body',
        'For women founders ready to move from an early idea to an investment-ready enterprise, through incubation, mentorship, and investor readiness.'
      ),
      cta: t('buildTracks.founder.cta', 'Take Flight'),
      color: '#2E7D7B',
      href: '/apply/founder',
      Icon: Rocket,
    },
    {
      title: t('enterTheLab.enterprise.title', 'Enterprise Flightpath'),
      body: t(
        'enterTheLab.enterprise.body',
        'For women running micro, small, or home-based businesses ready to grow through practical training, digital tools, and market access.'
      ),
      cta: t('buildTracks.enterprise.cta', 'Grow Your Enterprise'),
      color: '#E8823C',
      href: '/apply/enterprise',
      Icon: Store,
    },
    {
      title: t('enterTheLab.mentor.title', 'Guide Her Growth'),
      body: t(
        'enterTheLab.mentor.body',
        'For experts, founders, investors, trainers, and professionals who want to guide women entrepreneurs through practical support.'
      ),
      cta: t('mentorSection.cta', 'Become a Mentor'),
      color: '#2C7A70',
      href: '/apply/mentor',
      Icon: Compass,
    },
    {
      title: t('enterTheLab.partner.title', 'Open the Ecosystem'),
      body: t(
        'enterTheLab.partner.body',
        'For organizations ready to collaborate on women-led innovation, enterprise, access, and inclusive growth.'
      ),
      cta: t('enterTheLab.partner.cta', 'Partner with WISE'),
      color: '#E38470',
      href: '/apply/partner',
      Icon: Network,
    },
  ]
}

export function EnterTheLab() {
  const { t } = useTranslation()
  const PILLARS = getPillars(t)

  return (
    <section id="enter-the-lab" className="relative overflow-hidden py-28 md:py-36">
      <div className="grain" />
      <div className="container-wise relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">{t('nav.links.enter-the-lab', 'Enter the Lab')}</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
              {t('enterTheLab.title1', 'Your idea deserves')}
              <br />
              {t('enterTheLab.title2', 'the right room')}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-pretty leading-relaxed text-plum/70">
              {t(
                'enterTheLab.intro',
                'Building a startup, growing a small business, mentoring founders, or partnering for impact — your WISE journey starts here. If your idea has felt too early, too quiet, too small, or too unseen, this is your invitation to bring it into the room.'
              )}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <RevealItem key={p.title}>
              <MotionLink
                to={p.href}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-plum/10 bg-white p-8 shadow-card transition-shadow duration-500 hover:shadow-card-hover md:p-9"
              >
                {/* top accent rail */}
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: p.color }}
                />
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-105"
                    style={{ background: `${p.color}14`, color: p.color }}
                  >
                    <p.Icon className="h-7 w-7" strokeWidth={1.4} />
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-plum">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-plum/65">
                  {p.body}
                </p>
                <span
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ background: p.color, boxShadow: `0 14px 32px -14px ${p.color}` }}
                >
                  {p.cta}
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </MotionLink>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-12 text-center font-display text-xl font-medium uppercase italic text-plum/70">
            {t('enterTheLab.closingLine', 'YOUR NEXT CHAPTER STARTS INSIDE THE LAB.')}
          </p>
        </Reveal>

        <SectionJournal section="enter-the-lab" />
      </div>
    </section>
  )
}
