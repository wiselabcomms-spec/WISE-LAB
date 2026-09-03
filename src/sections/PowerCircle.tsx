import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { SectionJournal } from '@/components/SectionJournal'
import { cn } from '@/lib/utils'

function getPartners(t: TFunction) {
  return [
    {
      name: 'JazzWorld',
      role: t('powerCircle.partners.jazz', 'Consortium Lead'),
      logo: '/partners/jazz.png',
      description: "Pakistan’s leading digital connectivity company, bringing technological expertise, nationwide reach, and enterprise innovation to the WISE Lab consortium.",
      logoClass: 'h-[140px] md:h-[150px] w-auto object-contain',
      url: 'https://jazzworld.com.pk/#home',
    },
    {
      name: 'Mobilink Bank',
      role: t('powerCircle.partners.mobilink', 'Co-Lead Partner'),
      logo: '/partners/mobilink-mmbl.png',
      description: "Pakistan’s leading digital microfinance bank, advancing financial inclusion, digital banking, and growth opportunities for women entrepreneurs and MSMEs.",
      logoClass: 'h-[100px] md:h-[130px] w-auto object-contain',
      url: 'https://mobilinkbank.com',
    },
    {
      name: 'Change Mechanics',
      role: t('powerCircle.partners.changeMechanics', 'Managing Partner'),
      logo: '/partners/change-mechanics.png',
      description: "An innovation and ecosystem-development organization bringing programme design, entrepreneurship support, and implementation expertise to WISE Lab.",
      // wide horizontal lockup with heavy internal padding — needs the full
      // box height to read at the same optical size as the stacked marks
      logoClass: 'h-[80px] md:h-[100px] w-auto object-contain',
      url: 'https://changemechanics.pk/',
    },
  ]
}

function getFunders(t: TFunction) {
  return [
    {
      name: 'Ministry of IT & Telecommunication (MoITT)',
      role: t('powerCircle.funders.moitt', 'Initiated by'),
      logo: '/partners/moitt.png',
      description: "The Government of Pakistan’s lead ministry for shaping national technology policy, accelerating digital transformation, and enabling inclusive economic development.",
      // lead funder — reads larger than Ignite, whose chunky wordmark would
      // otherwise dominate the pair at equal box sizes
      logoClass: 'max-h-full max-w-[800px] scale-[1.15] md:scale-125',
      url: 'https://moitt.gov.pk/',
    },
    {
      name: 'Ignite – National Technology Fund',
      role: t('powerCircle.funders.ignite', 'Funded by'),
      logo: '/partners/ignite.png',
      description: "The government-backed funding and innovation agency supporting technology startups, entrepreneurship, research, and incubation ecosystems across Pakistan.",
      logoClass: 'max-h-[85%] max-w-[300px]',
      url: 'https://ignite.org.pk/',
    },
  ]
}

export function PowerCircle() {
  const { t } = useTranslation()
  const PARTNERS = getPartners(t)
  const FUNDERS = getFunders(t)

  return (
    <section
      id="power-circle"
      className="relative bg-white overflow-hidden py-28 text-black md:py-36"
    >
      {/* removed grain and glows for pure white bg */}

      <div className="container-wise relative">
        <div className="max-w-3xl">
          <Reveal>
            <p
              className="text-[11px] font-semibold uppercase tracking-eyebrow"
              style={{ color: '#FF8A65' }}
            >
              {t('nav.links.power-circle', 'Power Circle')}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-black">
              {t('powerCircle.title', 'The ecosystem behind her enterprise')}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-black/70">
              {t(
                'powerCircle.intro',
                "A premier alliance committed to women-led innovation, access, enterprise, and inclusive growth — because when the right rooms open, women-led businesses don't just enter them. They transform them."
              )}
            </p>
          </Reveal>
        </div>

        {/* Government / Funding Organizations */}
        <Reveal delay={0.15}>
          <h3 className="mt-14 text-[13px] font-bold uppercase tracking-[0.2em] text-black/50">
            Government / Funding Organizations
          </h3>
        </Reveal>
        <RevealGroup
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
          stagger={0.06}
        >
          {FUNDERS.map((p) => (
            <RevealItem key={p.name}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group flex h-full flex-col items-center gap-5 rounded-2xl bg-[#FAFAFA] border border-black/5 p-6 text-center shadow-card transition-shadow duration-500 hover:shadow-card-hover md:p-8"
              >
                <div className="flex h-36 w-full items-center justify-center p-2 md:h-48">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex h-full w-full items-center justify-center transition-transform hover:scale-105">
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        className={cn('object-contain', p.logoClass ?? 'max-h-full max-w-[240px]')}
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <img
                      src={p.logo}
                      alt={`${p.name} logo`}
                      className={cn('object-contain', p.logoClass ?? 'max-h-full max-w-[240px]')}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[17px] font-bold leading-tight text-plum">
                    {p.name}
                  </div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FF8A65]">
                    {p.role}
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-plum/70 text-justify">
                    {p.description}
                  </p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Consortium Partners */}
        <Reveal delay={0.15}>
          <h3 className="mt-16 text-[13px] font-bold uppercase tracking-[0.2em] text-black/50">
            Consortium Partners
          </h3>
        </Reveal>
        <RevealGroup
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6"
          stagger={0.06}
        >
          {PARTNERS.map((p) => (
            <RevealItem key={p.name}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group flex h-full flex-col items-center gap-5 rounded-2xl bg-[#FAFAFA] border border-black/5 p-6 text-center shadow-card transition-shadow duration-500 hover:shadow-card-hover md:p-8"
              >
                <div className="flex h-36 w-full items-center justify-center p-2 md:h-48">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex h-full w-full items-center justify-center transition-transform hover:scale-105">
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        className={cn('object-contain', p.logoClass ?? 'max-h-full max-w-[240px]')}
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <img
                      src={p.logo}
                      alt={`${p.name} logo`}
                      className={cn('object-contain', p.logoClass ?? 'max-h-full max-w-[240px]')}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[17px] font-bold leading-tight text-plum">
                    {p.name}
                  </div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                    {p.role}
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-plum/70 text-justify">
                    {p.description}
                  </p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Ecosystem chips removed as per instructions */}

        {/* Closing + CTA */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col items-start gap-6 border-t border-black/10 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium italic leading-snug text-black">
              {t(
                'powerCircle.closingLine',
                'Her idea was never small. The ecosystem needed to expand.'
              )}
            </p>
            <a
              href="#wise-connect"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF8A65] px-7 py-3.5 text-sm font-semibold text-plum transition-transform hover:scale-[1.03]"
            >
              {t('powerCircle.cta', 'Join the Power Circle')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        <SectionJournal section="power-circle" />
      </div>
    </section>
  )
}
