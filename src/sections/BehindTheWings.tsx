import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { SectionJournal } from '@/components/SectionJournal'
import { LinkedinIcon } from '@/components/BrandIcons'

export function BehindTheWings() {
  const { t } = useTranslation()
  return (
    <section
      id="behind-the-wings"
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <div className="container-wise relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">{t('nav.links.behind-the-wings', 'Behind the Wings')}</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
              {t('behindTheWings.title1', 'The women helping')}
              <br />
              {t('behindTheWings.title2', 'her take flight')}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-pretty leading-relaxed text-plum/70">
              {t(
                'behindTheWings.intro',
                'WISE Lab is led by a multidisciplinary team across incubation, entrepreneurship development, partnerships, communications, training, technology, and ecosystem engagement — building the space where she can become a founder.'
              )}
            </p>
          </Reveal>
        </div>

        {/* Featured team card */}
        <Reveal delay={0.1}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="mt-14 grid overflow-hidden rounded-3xl border border-plum/10 shadow-card md:grid-cols-[minmax(0,340px)_1fr]"
          >
            {/* Image panel */}
            <div className="relative flex min-h-[240px] overflow-hidden bg-plum/5 md:min-h-full">
              <img
                src="/team/munneaza-durrani.jpeg"
                alt="Ms. Muneaza Jamil Durrani"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* details */}
            <div className="flex flex-col justify-center bg-white p-8 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-plum">
                    {t('behindTheWings.team.name', 'Ms. Muneaza Jamil Durrani')}
                  </h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-teal">
                    {t('behindTheWings.team.role', 'Programme Director')}
                  </p>
                </div>
                <a
                  href="#"
                  aria-label={t(
                    'behindTheWings.team.linkedinLabel',
                    'Muneaza Jamil Durrani on LinkedIn'
                  )}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-plum/15 text-plum transition-colors hover:border-teal hover:bg-teal hover:text-white"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              </div>
              <p className="mt-5 leading-relaxed text-plum/70">
                {t(
                  'behindTheWings.team.bio',
                  "Leads WISE Lab's programme direction — setting the vision, standards, and day-to-day execution that help women entrepreneurs access mentorship, markets, capital readiness, and the right room to grow. She is the founding member of the team building the platform."
                )}
              </p>
            </div>
          </motion.div>
        </Reveal>

        {/* Team Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: 'Kashmala Shahid',
              role: 'Communications & Partnerships Manager',
              image: '/team/kashmala-shahid.png',
            },
            {
              name: 'Fatima Shah',
              role: 'Growth & Monitoring Specialist',
              image: '/team/fatima-shah.png',
            },
            {
              name: 'Esha Mubashir',
              role: 'Graphics Designer',
              image: '/team/esha-mubashir.jpeg',
            },
            {
              name: 'Iqra Shamshad',
              role: 'Finance Manager',
              image: '/team/iqra-shamshad.jpeg',
            },
            {
              name: 'Abeeha Widad',
              role: 'Video Editor',
              image: '/team/abeeha-widad.png',
            },
          ].map((member, i) => (
            <Reveal key={member.name} delay={0.15 + i * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-plum/10 shadow-card"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-plum/5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center bg-white p-6">
                  <h3 className="font-display text-xl font-bold text-plum">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-teal">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <SectionJournal section="behind-the-wings" />
      </div>
    </section>
  )
}
