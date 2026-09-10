import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Minus, Mail } from 'lucide-react'
import type { ReactNode } from 'react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { useDocumentMeta } from '@/lib/useDocumentMeta'
import { breadcrumbSchema } from '@/lib/structuredData'
import { InstagramIcon, FacebookIcon } from '@/components/BrandIcons'
import { SOCIAL_LINKS } from '@/lib/social'

interface FAQItem {
  q: string
  a: string | ReactNode
}


interface FAQCategory {
  id: string
  label: string
  emoji: string
  color: string
  items: FAQItem[]
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'about',
    label: 'About WISE Lab',
    emoji: '💡',
    color: 'bg-teal/10 text-teal',
    items: [
      {
        q: 'What is WISE Lab?',
        a: 'WISE Lab supports women-led startups and MSMEs through technology, mentorship, business development, market access and funding opportunities.',
      },
      {
        q: 'Who is behind WISE Lab?',
        a: 'WISE Lab is funded by Ignite – National Technology Fund under the Ministry of IT and Telecommunication, and implemented by Jazz, Mobilink Bank and Change Mechanics.',
      },
      {
        q: 'What programmes does WISE Lab offer?',
        a: 'WISE Lab offers a Women-Led Startup Incubation track and an MSME Development track for women entrepreneurs.',
      },
      {
        q: 'Is WISE Lab only for technology startups?',
        a: 'Technology is central to both tracks. The startup track supports technology-enabled ventures, while the MSME track helps women adopt e-commerce, digital tools and digital financial services to grow their businesses.',
      },
      {
        q: 'Where is WISE Lab located?',
        a: 'WISE Lab is based in Islamabad and supports participants from across Pakistan through a hybrid model.',
      },
    ],
  },
  {
    id: 'eligibility',
    label: 'Eligibility',
    emoji: '✅',
    color: 'bg-coral/10 text-coral',
    items: [
      {
        q: 'Who can apply?',
        a: 'Women founders, co-founders, entrepreneurs and business owners from across Pakistan can apply.',
      },
      {
        q: 'Can women from anywhere in Pakistan apply?',
        a: 'Yes. Applications are welcomed from all regions of Pakistan.',
      },
      {
        q: 'Do I need a registered company?',
        a: 'Registration requirements may vary by track and business stage. Applicants should accurately state their current registration status.',
      },
      {
        q: 'Can I apply at the idea stage?',
        a: 'Yes. Women with an idea, prototype, MVP, early-stage startup or growth-ready venture may apply.',
      },
      {
        q: 'Can an existing business apply?',
        a: 'Yes. Existing women-led startups and MSMEs can apply to the relevant track.',
      },
      {
        q: 'Can students apply?',
        a: 'Yes, provided they meet the eligibility criteria and can commit to the programme.',
      },
      {
        q: 'Can a startup with a male co-founder apply?',
        a: 'Yes. The woman founder must hold at least 50% equity in the startup.',
      },
      {
        q: 'Is there an age limit?',
        a: 'No. There is no age limit.',
      },
      {
        q: 'Can I apply to both tracks?',
        a: 'Apply to the track that best matches your venture and support needs. The WISE Lab team may guide you toward the more suitable track.',
      },
    ],
  },
  {
    id: 'support',
    label: 'Programme Support',
    emoji: '🚀',
    color: 'bg-plum/10 text-plum',
    items: [
      {
        q: 'What support will selected participants receive?',
        a: 'Support includes mentorship, business development, technical guidance, market access, investor readiness and ecosystem connections.',
      },
      {
        q: 'How long is the Startup Incubation programme?',
        a: 'The Startup Incubation programme runs for six months.',
      },
      {
        q: 'Is the programme online or in person?',
        a: 'WISE Lab follows a hybrid model combining virtual and in-person activities.',
      },
      {
        q: 'Do I need to relocate to Islamabad?',
        a: 'No. However, selected participants may need to attend specific in-person activities in Islamabad.',
      },
      {
        q: 'Does WISE Lab support mothers in business?',
        a: 'Yes. The programme includes hybrid coaching and daycare assistance during relevant activities.',
      },
      {
        q: 'Will WISE Lab help me connect with investors?',
        a: 'WISE Lab supports investor readiness and may facilitate introductions. Investment is not guaranteed.',
      },
      {
        q: 'Will WISE Lab help my business access markets?',
        a: 'Yes. Support may include e-commerce guidance, corporate linkages, showcases and ecosystem referrals.',
      },
    ],
  },
  {
    id: 'cost',
    label: 'Cost, Equity & Grants',
    emoji: '💰',
    color: 'bg-amber-500/10 text-amber-700',
    items: [
      {
        q: 'Is there a participation fee?',
        a: 'No. Participation is free for selected applicants.',
      },
      {
        q: 'Does WISE Lab take equity?',
        a: 'No. WISE Lab does not take equity in participating businesses.',
      },
      {
        q: 'Does every participant receive a grant?',
        a: 'No. Grants are awarded to qualifying, high-performing participants based on programme criteria.',
      },
      {
        q: 'What grants are available?',
        a: 'Up to five qualifying startups may receive up to PKR 2 million each, while up to 50 qualifying micro-entrepreneurs may receive up to PKR 500,000 each.',
      },
      {
        q: 'What can the grant be used for?',
        a: 'Grant funds must be used for approved business-growth activities and will be subject to programme guidelines.',
      },
    ],
  },
  {
    id: 'application',
    label: 'Application & Selection',
    emoji: '📋',
    color: 'bg-sky-500/10 text-sky-700',
    items: [
      {
        q: 'How do I apply?',
        a: (
          <>
            Complete and submit the relevant application form at{' '}
            <a
              href="https://www.wiselab.org.pk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal underline underline-offset-2 hover:opacity-80"
            >
              www.wiselab.org.pk
            </a>
            .
          </>
        ),
      },
      {
        q: 'Are Cohort 1 applications open?',
        a: 'Yes. Cohort 1 applications are open until 10 September 2026.',
      },
      {
        q: 'What information will I need to provide?',
        a: 'You may be asked about your team, problem, solution, business stage, market, progress and support needs.',
      },
      {
        q: 'Do I need a pitch deck?',
        a: 'Upload a pitch deck or supporting document only if requested in the application form.',
      },
      {
        q: 'How will participants be selected?',
        a: 'Selection may include application screening, evaluation, interviews and pitching.',
      },
      {
        q: 'How many participants will be selected?',
        a: 'WISE Lab will select 10 startups per cohort and train 200 women entrepreneurs annually through the MSME track.',
      },
      {
        q: 'Does applying guarantee selection?',
        a: 'No. All applications are evaluated through a competitive selection process.',
      },
      {
        q: 'How will shortlisted applicants be contacted?',
        a: 'Shortlisted applicants will be contacted through the email address or phone number provided in their application.',
      },
      {
        q: 'Can I edit my application after submitting it?',
        a: 'Contact the WISE Lab team with your application details. Changes will be subject to feasibility.',
      },
      {
        q: 'What happens if my application is incomplete?',
        a: 'Incomplete applications may not proceed to evaluation. Complete all required sections before the deadline.',
      },
    ],
  },
  {
    id: 'participation',
    label: 'Participation & Contact',
    emoji: '🤝',
    color: 'bg-rose-500/10 text-rose-700',
    items: [
      {
        q: 'What commitment is expected?',
        a: 'Selected participants must attend required sessions, engage with mentors and work toward agreed business milestones.',
      },
      {
        q: 'Can I participate while working or studying?',
        a: "Yes, provided you can meet the programme's attendance and participation requirements.",
      },
      {
        q: 'Will I receive a certificate?',
        a: "Participants who meet the programme's completion requirements may receive a certificate.",
      },
      {
        q: 'Who can I contact for assistance?',
        a: (
          <>
            Contact WISE Lab through Instagram{' '}
            <a
              href="https://www.instagram.com/wise.labpk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal underline underline-offset-2 hover:opacity-80"
            >
              @wise.labpk
            </a>
            , the official WISE Lab Facebook page, or email{' '}
            <a
              href="mailto:mahnoor.fatima@changemechanics.pk"
              className="text-plum underline transition-colors hover:text-teal"
            >
              mahnoor.fatima@changemechanics.pk
            </a>
            .
          </>
        ),
      },
    ],
  },
]

function AccordionItem({
  item,
  categoryId,
  index,
  isOpen,
  onToggle,
  accentClass,
}: {
  item: FAQItem
  categoryId: string
  index: number
  isOpen: boolean
  onToggle: () => void
  accentClass: string
}) {
  const btnId = `faq-${categoryId}-btn-${index}`
  const panelId = `faq-${categoryId}-panel-${index}`

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-plum/20 bg-plum/[0.025] shadow-sm'
          : 'border-plum/10 bg-white hover:border-plum/20'
      }`}
    >
      <button
        id={btnId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-[16px] font-semibold leading-snug text-plum">
          {item.q}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen ? `${accentClass} opacity-100` : 'bg-plum/10 text-plum'
          }`}
        >
          {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="px-6 pb-6 text-[15px] leading-relaxed text-plum/70">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CategorySection({ category }: { category: FAQCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div id={`cat-${category.id}`} className="scroll-mt-8">
      <div className="mb-6 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${category.color}`}
        >
          {category.emoji}
        </span>
        <h2 className="font-display text-2xl font-bold text-black">{category.label}</h2>
      </div>

      <RevealGroup className="space-y-3" stagger={0.04}>
        {category.items.map((item, i) => (
          <RevealItem key={i}>
            <AccordionItem
              item={item}
              categoryId={category.id}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              accentClass={category.color}
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}

export function FAQPage() {
  useDocumentMeta({
    title: 'FAQs – Frequently Asked Questions',
    description:
      'Answers to common questions about WISE Lab eligibility, programme support, grants, applications, and more.',
    path: '/faqs',
    structuredData: breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'FAQs', path: '/faqs' },
    ]),
  })

  return (
    <main className="relative min-h-screen overflow-hidden bg-white py-16 pb-32 md:py-24 md:pb-32">
      {/* Decorative gradient top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#faf7f4] to-transparent"
      />

      <div className="container-wise relative max-w-4xl">
        {/* Back link */}
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-plum/60 transition-colors hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to WISE Lab
          </Link>
        </Reveal>

        {/* Hero */}
        <Reveal delay={0.05}>
          <div className="mt-10">
            <p className="eyebrow">Knowledge Base</p>
            <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] font-bold leading-[1.03] text-black">
              Frequently Asked{' '}
              <span className="text-teal">Questions</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-plum/70">
              Concise, website-ready information for founders and women entrepreneurs. WISE Lab
              connects women with technology, mentorship, markets, finance and institutional support
              to build stronger, more sustainable enterprises.
            </p>
          </div>
        </Reveal>

        {/* Category nav pills */}
        <Reveal delay={0.1}>
          <nav
            aria-label="FAQ categories"
            className="mt-10 flex flex-wrap gap-2"
          >
            {FAQ_DATA.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full border border-plum/10 px-4 py-1.5 text-sm font-medium text-plum/70 transition-all hover:border-plum/30 hover:text-plum`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </a>
            ))}
          </nav>
        </Reveal>

        {/* FAQ categories */}
        <div className="mt-16 space-y-16">
          {FAQ_DATA.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <CategorySection category={cat} />
            </Reveal>
          ))}
        </div>

        {/* Contact CTA */}
        <Reveal delay={0.1}>
          <div className="mt-20 rounded-3xl border border-plum/10 bg-gradient-to-br from-[#faf7f4] to-white p-8 md:p-12">
            <p className="eyebrow">Still have questions?</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-black">
              We're here to help
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-plum/65">
              Can't find your answer? Reach out to the WISE Lab team directly.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="mailto:hello@wiselab.org.pk"
                id="faq-contact-email"
                className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Mail className="h-4 w-4" />
                hello@wiselab.org.pk
              </a>
              <a
                href={SOCIAL_LINKS.find(s => s.label === 'Instagram')?.href ?? 'https://www.instagram.com/wise.labpk/'}
                id="faq-contact-instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-plum/20 px-6 py-3 text-sm font-semibold text-plum transition-colors hover:bg-plum/[0.04]"
              >
                <InstagramIcon className="h-4 w-4" />
                @wise.labpk
              </a>
              <a
                href={SOCIAL_LINKS.find(s => s.label === 'Facebook')?.href ?? 'https://www.facebook.com'}
                id="faq-contact-facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-plum/20 px-6 py-3 text-sm font-semibold text-plum transition-colors hover:bg-plum/[0.04]"
              >
                <FacebookIcon className="h-4 w-4" />
                Facebook Page
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
