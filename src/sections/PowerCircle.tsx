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
      name: 'Jazz',
      role: t('powerCircle.partners.jazz', 'Consortium Lead'),
      logo: '/partners/jazz.png',
      description: "Pakistan’s leading digital connectivity company, bringing technological expertise, nationwide reach, and enterprise innovation to the WISE Lab consortium.",
      invert: true,
      chip: false,
    },
    {
      name: 'Mobilink Bank',
      role: t('powerCircle.partners.mobilink', 'Co-Lead Partner'),
      logo: '/partners/mobilink-mmbl.png',
      description: "Pakistan’s leading digital microfinance bank, advancing financial inclusion, digital banking, and growth opportunities for women entrepreneurs and MSMEs.",
      invert: false,
      chip: true,
    },
    {
      name: 'Change Mechanics',
      role: t('powerCircle.partners.changeMechanics', 'Managing Partner'),
      logo: '/partners/change-mechanics.png',
      description: "An innovation and ecosystem-development organization bringing programme design, entrepreneurship support, and implementation expertise to WISE Lab.",
      invert: true,
      chip: false,
    },
  ]
}

function getFunders(t: TFunction) {
  return [
    {
      name: 'Ministry of IT & Telecommunication (MoITT)',
      role: t('powerCircle.funders.moitt', 'Designed & Funded by'),
      logo: '/partners/moitt.png',
      description: "The Government of Pakistan’s lead ministry for shaping national technology policy, accelerating digital transformation, and enabling inclusive economic development.",
      invert: true,
    },
    {
      name: 'Ignite – National Technology Fund',
      role: t('powerCircle.funders.ignite', 'Designed & Funded by'),
      logo: '/partners/ignite.png',
      description: "The government-backed funding and innovation agency supporting technology startups, entrepreneurship, research, and incubation ecosystems across Pakistan.",
      invert: true,
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
      className="relative overflow-hidden py-28 text-beige md:py-36"
      style={{
        background:
          'radial-gradient(120% 100% at 80% 0%, #4a2e3d 0%, #33212b 55%, #241820 100%)',
      }}
    >
      <div className="grain opacity-[0.07]" />
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-[-10%] top-1/3 h-80 w-80 rounded-full bg-teal/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-8%] top-10 h-72 w-72 rounded-full bg-coral/15 blur-[120px]" />

      <div className="container-wise relative">
        <div className="max-w-3xl">
          <Reveal>
            <p
              className="text-[11px] font-semibold uppercase tracking-eyebrow"
              style={{ color: '#E38470' }}
            >
              {t('nav.links.power-circle', 'The Power Circle')}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-beige">
              {t('powerCircle.title', 'The ecosystem behind her enterprise')}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-beige/70">
              {t(
                'powerCircle.intro',
                "A premier alliance committed to women-led innovation, access, enterprise, and inclusive growth — because when the right rooms open, women-led businesses don't just enter them. They transform them."
              )}
            </p>
          </Reveal>
        </div>

        {/* Government / Funding Organizations */}
        <Reveal delay={0.15}>
          <h3 className="mt-14 text-[13px] font-bold uppercase tracking-[0.2em] text-beige/50">
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
                className="group flex h-full flex-col items-center gap-5 rounded-2xl bg-beige/[0.06] p-6 text-center transition-colors duration-500 hover:bg-beige/10 md:p-8"
              >
                <div className="flex h-24 w-full items-center justify-center p-2 md:h-32">
                  <img
                    src={p.logo}
                    alt={`${p.name} logo`}
                    className={cn("max-h-full max-w-[240px] object-contain", p.invert && "invert brightness-0")}
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[17px] font-bold leading-tight text-beige">
                    {p.name}
                  </div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                    {p.role}
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-beige/80 text-justify">
                    {p.description}
                  </p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Consortium Partners */}
        <Reveal delay={0.15}>
          <h3 className="mt-16 text-[13px] font-bold uppercase tracking-[0.2em] text-beige/50">
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
                className="group flex h-full flex-col items-center gap-5 rounded-2xl bg-beige/[0.06] p-6 text-center transition-colors duration-500 hover:bg-beige/10 md:p-8"
              >
                <div className="flex h-24 w-full items-center justify-center p-2 md:h-32">
                  {p.chip ? (
                    <div className="flex h-full w-full max-w-[240px] items-center justify-center rounded-xl bg-white px-5 py-3">
                      <img
                        src={p.logo}
                        alt={`${p.name} logo`}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <img
                      src={p.logo}
                      alt={`${p.name} logo`}
                      className={cn("max-h-full max-w-[240px] object-contain", p.invert && "invert brightness-0")}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[17px] font-bold leading-tight text-beige">
                    {p.name}
                  </div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                    {p.role}
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-beige/80 text-justify">
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
          <div className="mt-16 flex flex-col items-start gap-6 border-t border-beige/10 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium italic leading-snug text-beige">
              {t(
                'powerCircle.closingLine',
                'Her idea was never small. The ecosystem needed to expand.'
              )}
            </p>
            <a
              href="#wise-connect"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-plum transition-transform hover:scale-[1.03]"
            >
              {t('powerCircle.cta', 'Join the Power Circle')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        <SectionJournal section="power-circle" variant="dark" />
      </div>
    </section>
  )
}
