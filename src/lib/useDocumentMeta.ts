import { useEffect } from 'react'

const SITE_NAME = 'WISE Lab'
const DEFAULT_TITLE = 'WISE Lab — Her idea. Her enterprise.'
const DEFAULT_DESCRIPTION =
  "WISE Lab — Women Innovation & Startup Empowerment Lab. Pakistan's national flagship platform where women-led ideas move from quiet potential to visible enterprise."

function setMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const STRUCTURED_DATA_ID = 'page-structured-data'

/**
 * Page-specific JSON-LD, separate from the static site-wide Organization
 * schema already in index.html (that one stays — this is additive, keyed
 * by its own id so it never collides with or removes that one).
 */
function setStructuredData(data: object | object[] | undefined) {
  const existing = document.getElementById(STRUCTURED_DATA_ID)
  if (!data) {
    existing?.remove()
    return
  }
  let el = existing as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = STRUCTURED_DATA_ID
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Sets document.title, the meta description, OG/Twitter tags, and a
 * canonical link for the current route. This is a plain CSR SPA (no
 * react-helmet, no SSR) so every route otherwise ships the same static
 * <title>/<meta> from index.html — this hook is what actually gives each
 * page its own title/description in tab bars, share previews, and search
 * results. `path` should be the route's pathname (e.g. "/vision"), used to
 * build the canonical URL and og:url.
 */
export function useDocumentMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  noIndex = false,
  structuredData,
}: {
  title?: string
  description?: string
  path?: string
  /** admin/auth pages: kept out of robots.txt too, but a noindex meta is the
   *  part that actually stops indexing if a page ever gets linked externally. */
  noIndex?: boolean
  /** Page-specific JSON-LD (e.g. BreadcrumbList, Course, Article). Omit for
   *  pages that don't warrant it (forms, admin). */
  structuredData?: object | object[]
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
    const url = `https://wiselab.org.pk${path}`

    document.title = fullTitle
    setMetaByName('description', description)
    setMetaByName('robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setMetaByProperty('og:title', fullTitle)
    setMetaByProperty('og:description', description)
    setMetaByProperty('og:url', url)
    setMetaByName('twitter:title', fullTitle)
    setMetaByName('twitter:description', description)
    setCanonical(url)
    setStructuredData(structuredData)

    return () => {
      // Reset to the site defaults on unmount so a page that doesn't call
      // this hook (or the moment before the next page's effect runs)
      // never keeps a stale title/description/robots from the page just left.
      document.title = DEFAULT_TITLE
      setMetaByName('description', DEFAULT_DESCRIPTION)
      setMetaByName('robots', 'index, follow')
      setMetaByProperty('og:title', DEFAULT_TITLE)
      setMetaByProperty('og:description', DEFAULT_DESCRIPTION)
      setMetaByProperty('og:url', 'https://wiselab.org.pk/')
      setMetaByName('twitter:title', DEFAULT_TITLE)
      setMetaByName('twitter:description', DEFAULT_DESCRIPTION)
      setCanonical('https://wiselab.org.pk/')
      setStructuredData(undefined)
    }
  }, [title, description, path, noIndex, structuredData])
}
