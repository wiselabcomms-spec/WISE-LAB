import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Globe, Mail, MapPin, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { SectionJournal } from '@/components/SectionJournal'
import { SOCIAL_LINKS } from '@/lib/social'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const INQUIRY_TYPE_KEYS = [
  { value: 'Startup/Founder', key: 'wiseConnect.inquiryTypes.startupFounder', fallback: 'Startup/Founder' },
  { value: 'MSME/Business', key: 'wiseConnect.inquiryTypes.msmeBusiness', fallback: 'MSME/Business' },
  { value: 'Mentorship', key: 'wiseConnect.inquiryTypes.mentorship', fallback: 'Mentorship' },
  { value: 'Partnership', key: 'wiseConnect.inquiryTypes.partnership', fallback: 'Partnership' },
  { value: 'Media', key: 'wiseConnect.inquiryTypes.media', fallback: 'Media' },
  { value: 'Other', key: 'wiseConnect.inquiryTypes.other', fallback: 'Other' },
]

interface Errors {
  name?: string
  email?: string
  inquiry?: string
  message?: string
}

export function WiseConnect() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [inquiry, setInquiry] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e: Errors = {}
    if (!name.trim()) e.name = t('wiseConnect.errors.name', 'Please enter your name.')
    if (!email.trim()) e.email = t('wiseConnect.errors.email', 'Please enter your email.')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = t('form.invalidEmailError', 'Please enter a valid email.')
    if (!inquiry) e.inquiry = t('wiseConnect.errors.inquiry', 'Please choose an inquiry type.')
    if (!message.trim()) e.message = t('wiseConnect.errors.message', 'Please add a short message.')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (validate()) setSent(true)
  }

  return (
    <section id="wise-connect" className="relative overflow-hidden py-28 md:py-36">
      <div className="grain" />
      <div className="container-wise relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left: heading + contact info */}
        <div>
          <Reveal>
            <p className="eyebrow">{t('nav.links.wise-connect', 'WISE Connect')}</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
              {t('wiseConnect.title', 'Start the conversation')}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-plum/70">
              {t(
                'wiseConnect.intro',
                'Have a question, idea, partnership proposal, media inquiry, or opportunity to share? Sometimes the next stage of growth begins with one conversation.'
              )}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 space-y-5">
              <ContactRow Icon={MapPin} label={t('wiseConnect.location', 'Location')}>
                AIOU, Sector H-8, Islamabad
              </ContactRow>
              <ContactRow Icon={Mail} label={t('wiseConnect.email', 'Email')}>
                <a className="link-underline" href="mailto:hello@wiselab.org.pk">
                  hello@wiselab.org.pk
                </a>
              </ContactRow>
              <ContactRow Icon={Globe} label={t('wiseConnect.web', 'Web')}>
                wiselab.org.pk
              </ContactRow>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-plum/45">
                {t('wiseConnect.follow', 'Follow')}
              </span>
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('wiseConnect.socialAriaLabel', 'WISE Lab on {{label}} (opens in a new tab)', { label })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/15 text-plum transition-colors hover:border-teal hover:bg-teal hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: form card */}
        <Reveal delay={0.1}>
          <div className="relative rounded-3xl border border-plum/10 bg-white p-7 shadow-card md:p-9">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.1 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-teal/12"
                  >
                    <CheckCircle2 className="h-10 w-10 text-teal" />
                  </motion.div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-plum">
                    {t('wiseConnect.thankYou', 'Thank you, {{name}}.', {
                      name: name.split(' ')[0] || t('form.successFallbackName', 'friend'),
                    })}
                  </h3>
                  <p className="mt-2 max-w-xs text-plum/65">
                    {t('wiseConnect.inquiryReceived', "Your inquiry is in. We'll be in touch soon.")}
                  </p>
                  <p className="mt-6 font-display text-lg font-medium italic text-teal">
                    {t('wiseConnect.closingLine', 'The right conversation can open the next door.')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false)
                      setName('')
                      setEmail('')
                      setInquiry('')
                      setMessage('')
                      setErrors({})
                    }}
                    className="mt-8 text-sm font-semibold text-plum/60 underline underline-offset-4 hover:text-plum"
                  >
                    {t('wiseConnect.sendAnother', 'Send another inquiry')}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <Field label={t('wiseConnect.fullName', 'Full name')} htmlFor="name" error={errors.name}>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('wiseConnect.fullNamePlaceholder', 'Your name')}
                      aria-invalid={!!errors.name}
                    />
                  </Field>

                  <Field label={t('wiseConnect.email', 'Email')} htmlFor="email" error={errors.email}>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      aria-invalid={!!errors.email}
                    />
                  </Field>

                  <Field
                    label={t('wiseConnect.inquiryType', 'Inquiry type')}
                    htmlFor="inquiry"
                    error={errors.inquiry}
                  >
                    <Select value={inquiry} onValueChange={setInquiry}>
                      <SelectTrigger id="inquiry" aria-invalid={!!errors.inquiry}>
                        <SelectValue placeholder={t('form.chooseOne', 'Choose one')} />
                      </SelectTrigger>
                      <SelectContent>
                        {INQUIRY_TYPE_KEYS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {t(opt.key, opt.fallback)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label={t('wiseConnect.message', 'Message')} htmlFor="message" error={errors.message}>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t(
                        'wiseConnect.messagePlaceholder',
                        'Tell us about your idea, business, or proposal…'
                      )}
                      aria-invalid={!!errors.message}
                    />
                  </Field>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    style={{ background: 'var(--track-primary)', color: 'var(--track-ink)' }}
                  >
                    {t('wiseConnect.submit', 'Send your inquiry')}
                    <Send className="h-4 w-4" />
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      <div className="container-wise relative">
        <SectionJournal section="wise-connect" />
      </div>
    </section>
  )
}

function ContactRow({
  Icon,
  label,
  children,
}: {
  Icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-plum/5 text-teal">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <div>
        <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-plum/45">
          {label}
        </dt>
        <dd className="mt-0.5 text-[15px] font-medium text-plum/85">{children}</dd>
      </div>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[13px] font-medium text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
