import { useState } from 'react'
import { CheckCircle2, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlreadySubscribedError, subscribeToNewsletter } from '@/lib/newsletter'

/**
 * Homepage newsletter signup, placed just above the Footer — a single email
 * field, no name/other fields, since the only thing this collects is
 * "notify me about updates."
 */
export function Newsletter() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('form.invalidEmailError', 'Please enter a valid email.'))
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await subscribeToNewsletter(email.trim())
      setSubscribed(true)
    } catch (err) {
      setError(
        err instanceof AlreadySubscribedError
          ? t('newsletter.alreadySubscribed', "You're already subscribed — thank you!")
          : t('newsletter.submitError', 'Something went wrong. Please try again.')
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="newsletter" className="relative overflow-hidden py-20 md:py-28">
      <div className="grain" />
      <div className="container-wise relative">
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-3xl border border-plum/10 bg-white p-10 text-center shadow-card md:p-14">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="mt-6 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-[1.05] text-plum">
              {t('newsletter.title', 'Stay in the loop')}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-plum/70">
              {t(
                'newsletter.subtitle',
                'Cohort openings, founder stories, and WISE Lab updates — straight to your inbox, no spam.'
              )}
            </p>

            {subscribed ? (
              <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-teal">
                <CheckCircle2 className="h-5 w-5" />
                {t('newsletter.success', "You're subscribed. Welcome to WISE Lab.")}
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-center"
              >
                <div className="w-full sm:max-w-xs">
                  <Input
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder={t('newsletter.placeholder', 'you@example.com')}
                    aria-label={t('newsletter.placeholder', 'you@example.com')}
                    disabled={submitting}
                  />
                  {error && <p className="mt-2 text-left text-sm text-red-600">{error}</p>}
                </div>
                <Button type="submit" disabled={submitting} className="shrink-0">
                  {submitting
                    ? t('newsletter.submitting', 'Subscribing…')
                    : t('newsletter.subscribe', 'Subscribe')}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
