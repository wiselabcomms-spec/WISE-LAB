import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { DynamicForm } from '@/components/DynamicForm'
import { WiseMark } from '@/components/WiseLabLogo'
import { getFormSchema } from '@/lib/forms/schemas'
import { tSubtitle, tTitle } from '@/lib/forms/i18nKeys'
import { useDocumentMeta } from '@/lib/useDocumentMeta'
import { GOOGLE_FORM_URLS } from '@/lib/forms/googleFormLinks'
import type { ApplicationTrack } from '@/lib/forms/types'

/** Redirects to an external Google Form immediately on mount — no delay.
 *  window.location.replace (not href) so the interstitial never enters
 *  browser history; the manual link is only a fallback in case a popup/
 *  redirect blocker stops the automatic navigation. */
function GoogleFormRedirect({ url }: { url: string }) {
  const { t } = useTranslation()
  useEffect(() => {
    window.location.replace(url)
  }, [url])

  return (
    <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-plum/10 bg-white p-10 text-center shadow-card">
      <p className="text-plum/70">{t('apply.redirecting', 'Redirecting…')}</p>
      <a
        href={url}
        className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
        style={{ background: 'var(--track-primary)' }}
      >
        {t('apply.continueNow', 'Continue now')}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  )
}

/**
 * /apply/:track — dedicated application page for each of the four Enter
 * the Lab pillars. Renders the matching FormSchema through DynamicForm.
 * Sets data-track on <html> so the whole page (buttons, focus rings, etc.)
 * picks up the right --track-* CSS variables, same mechanism TrackProvider
 * uses on the landing page.
 */
export function ApplyPage() {
  const { t } = useTranslation()
  const { track } = useParams<{ track: string }>()
  const schema = getFormSchema(track)

  useDocumentMeta({
    title: schema ? tTitle(t, schema) : undefined,
    description: schema ? tSubtitle(t, schema) : undefined,
    path: `/apply/${track ?? ''}`,
  })

  useEffect(() => {
    if (!schema) return
    const root = document.documentElement
    root.setAttribute('data-track', schema.themeTrack)
    return () => root.removeAttribute('data-track')
  }, [schema])

  if (!schema) return <Navigate to="/" replace />

  const googleFormUrl = GOOGLE_FORM_URLS[schema.track as ApplicationTrack]

  return (
    <main className="relative min-h-screen overflow-hidden bg-beige py-16 md:py-24">
      <div className="grain" />
      <div className="container-wise relative max-w-2xl">
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-plum/60 transition-colors hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {t('apply.backToWiseLab', 'Back to WISE Lab')}
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <WiseMark className="h-10 w-auto" />
          </div>

          <p className="eyebrow mt-8">{t('nav.links.enter-the-lab', 'Enter the Lab')}</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.05] text-plum">
            {tTitle(t, schema)}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-plum/70">
            {tSubtitle(t, schema)}
          </p>
        </Reveal>

        {googleFormUrl ? (
          <GoogleFormRedirect url={googleFormUrl} />
        ) : (
          <div className="mt-12">
            <DynamicForm schema={schema} />
          </div>
        )}
      </div>
    </main>
  )
}
