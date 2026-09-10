import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { LinkedinIcon } from '@/components/BrandIcons'
import { listVisibleTeamMembers } from '@/lib/team/api'
import type { TeamMember } from '@/lib/team/types'

// Hardcoded fallback — used during dev (no Supabase) or while loading.
const FALLBACK_MEMBERS: TeamMember[] = [
  {
    id: 'featured',
    name: 'Muneaza Durrani',
    role: 'Project Director',
    tagline:
      'A venture builder and ecosystem strategist focused on turning early-stage potential into growth-ready enterprises.',
    bio: "Leads WISE Lab's programme direction setting the vision, standards, and day-to-day execution that help women entrepreneurs access mentorship, markets, capital readiness, and the right room to grow. She is the founding member of the team building the platform.",
    imageUrl: '/team/munneaza-durrani-resized.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/muneaza-durrani-35a85810',
    isFeatured: true,
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: '1',
    name: 'Kashmala Shahid',
    role: 'Communications & Partnerships Manager',
    tagline:
      'A strategic communications and partnerships professional who turns messages into momentum and relationships into opportunity.',
    bio: '',
    imageUrl: '/team/kashmala-shahid.png',
    linkedinUrl: 'https://www.linkedin.com/in/kashmalaskhattak',
    isFeatured: false,
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: '2',
    name: 'Fatima Shah',
    role: 'Growth & Monitoring Specialist',
    tagline:
      'A public-policy and social-impact professional advancing inclusion through evidence, partnerships and purpose-led action.',
    bio: '',
    imageUrl: '/team/fatima-shah.png',
    linkedinUrl: 'https://www.linkedin.com/in/fatima-shah-56540687',
    isFeatured: false,
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: '3',
    name: 'Iqra Shamshad',
    role: 'Finance Manager',
    tagline:
      'A people-and-process professional building the organisational discipline that turns ambitious programmes into sustainable impact.',
    bio: '',
    imageUrl: '/team/iqra-shamshad-resized.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/iqra-shamshad-110645165',
    isFeatured: false,
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: '4',
    name: 'Esha Mubashir',
    role: 'Graphics Designer',
    tagline:
      'A visual designer building memorable brand experiences through clarity, composition and creative systems.',
    bio: '',
    imageUrl: '/team/esha-mubashir-resized.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/esha-mubashir-444023318',
    isFeatured: false,
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: '5',
    name: 'Abeeha Widad',
    role: 'Video Editor',
    tagline:
      'A young creative translating ideas into visual stories, digital conversations and audience engagement.',
    bio: '',
    imageUrl: '/team/abeeha-widad.png',
    linkedinUrl: 'https://www.linkedin.com/in/abeeha-widad-793020374',
    isFeatured: false,
    sortOrder: 5,
    isVisible: true,
  },
]

export function BehindTheWings() {
  const { t } = useTranslation()
  const [members, setMembers] = useState<TeamMember[]>(FALLBACK_MEMBERS)

  useEffect(() => {
    listVisibleTeamMembers().then((data) => {
      if (data.length > 0) setMembers(data)
    })
  }, [])

  const featured = members.find((m) => m.isFeatured) ?? members[0]
  const grid = members.filter((m) => !m.isFeatured)

  return (
    <section
      id="behind-the-wings"
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <div className="container-wise relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">{t('nav.links.behind-the-wings', 'Behind the Wings')}</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-black">
              {t('behindTheWings.title1', 'The team helping')}
              <br />
              {t('behindTheWings.title2', 'her take flight')}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-pretty leading-relaxed text-plum/70">
              {t(
                'behindTheWings.intro',
                'WISE Lab is led by a multidisciplinary team across incubation, entrepreneurship development, partnerships, communications, training, technology, and ecosystem engagement building the space where she can become a founder.'
              )}
            </p>
          </Reveal>
        </div>

        {/* Featured team card */}
        {featured && (
          <Reveal delay={0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="mt-14 grid overflow-hidden rounded-3xl border border-plum/10 shadow-card md:grid-cols-[minmax(0,340px)_1fr]"
            >
              {/* Image panel */}
              <div className="relative flex min-h-[240px] overflow-hidden bg-plum/5 md:min-h-full">
                <img
                  src={featured.imageUrl}
                  alt={featured.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center bg-white p-8 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-plum">{featured.name}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-teal">
                      {featured.role}
                    </p>
                  </div>
                  {featured.linkedinUrl && (
                    <a
                      href={featured.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${featured.name} on LinkedIn`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-plum/15 text-plum transition-colors hover:border-teal hover:bg-teal hover:text-white"
                    >
                      <LinkedinIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
                {featured.tagline && (
                  <p className="mt-4 font-display italic leading-snug text-plum/80">
                    {featured.tagline}
                  </p>
                )}
                {featured.bio && (
                  <p className="mt-4 leading-relaxed text-plum/70">{featured.bio}</p>
                )}
              </div>
            </motion.div>
          </Reveal>
        )}

        {/* Team Grid */}
        {grid.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {grid.map((member, i) => (
              <Reveal key={member.id} delay={0.15 + i * 0.05} className="h-full">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-plum/10 shadow-card"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-plum/5">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col bg-white p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xl font-bold text-plum">{member.name}</h3>
                        <p className="mt-1 min-h-[2.25rem] text-[11px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-teal">
                          {member.role}
                        </p>
                      </div>
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on LinkedIn`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-plum/15 text-plum transition-colors hover:border-teal hover:bg-teal hover:text-white"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {member.tagline && (
                      <p className="mt-3 text-[13px] leading-relaxed text-plum/65">
                        {member.tagline}
                      </p>
                    )}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
