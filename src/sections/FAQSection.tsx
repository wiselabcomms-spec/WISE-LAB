import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowUpRight } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'

interface FAQItem {
  question: string
  answer: string
}

const TOP_FAQS: FAQItem[] = [
  {
    question: 'What is WISE Lab?',
    answer:
      'WISE Lab supports women-led startups and MSMEs through technology, mentorship, business development, market access and funding opportunities.',
  },
  {
    question: 'Who can apply?',
    answer:
      'Women founders, co-founders, entrepreneurs and business owners from across Pakistan can apply. There is no age limit, and applicants can be at the idea stage, early-stage, or running an existing business.',
  },
  {
    question: 'Is there a participation fee or does WISE Lab take equity?',
    answer:
      'No. Participation is completely free for selected applicants, and WISE Lab does not take equity in any participating business.',
  },
  {
    question: 'What grants are available?',
    answer:
      'Up to five qualifying startups may receive up to PKR 2 million each, while up to 50 qualifying micro-entrepreneurs may receive up to PKR 500,000 each. Grants are awarded to high-performing participants based on programme criteria.',
  },
  {
    question: 'Are Cohort 1 applications open?',
    answer:
      'Yes. Cohort 1 applications are open until 10 September 2026. Complete and submit the relevant application form at wiselab.org.pk.',
  },
]

function FAQAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-plum/20 bg-plum/[0.03] shadow-sm'
          : 'border-plum/10 bg-white hover:border-plum/20'
      }`}
    >
      <button
        id={`faq-home-btn-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-home-panel-${index}`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-[17px] font-semibold leading-snug text-plum">
          {item.question}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen ? 'bg-teal text-white' : 'bg-plum/10 text-plum'
          }`}
        >
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-home-panel-${index}`}
            role="region"
            aria-labelledby={`faq-home-btn-${index}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="px-6 pb-6 text-[15px] leading-relaxed text-plum/70">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section
      id="faqs"
      className="relative overflow-hidden bg-white py-24 md:py-32 border-t border-plum/10"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-teal/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-coral/5 blur-3xl"
      />

      <div className="container-wise relative">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Have Questions?</p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-black">
                Frequently Asked{' '}
                <span className="text-teal">Questions</span>
              </h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-plum/65">
                Everything you need to know about WISE Lab — from eligibility to grants to how to apply.
              </p>
            </div>

            <Link
              to="/faqs"
              className="hidden md:inline-flex shrink-0 items-center gap-2 rounded-full border border-plum/20 px-6 py-2.5 text-sm font-semibold text-plum transition-colors hover:bg-plum/[0.04]"
            >
              View all FAQs
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {/* Accordion */}
        <RevealGroup className="mt-10 space-y-3" stagger={0.06}>
          {TOP_FAQS.map((faq, i) => (
            <RevealItem key={i}>
              <FAQAccordionItem
                item={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Mobile CTA */}
        <Reveal delay={0.15}>
          <Link
            to="/faqs"
            className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full border border-plum/20 px-6 py-3 text-sm font-semibold text-plum transition-colors hover:bg-plum/[0.04] md:hidden"
          >
            View all FAQs
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
