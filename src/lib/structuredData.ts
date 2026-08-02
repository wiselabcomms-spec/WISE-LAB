const SITE_URL = 'https://wiselab.org.pk'

/** BreadcrumbList — helps search results show a breadcrumb trail instead of the raw URL. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  }
}

/** Course — fits Founder/Enterprise Flightpath: they're structured, timed training programmes. */
export function courseSchema({
  name,
  description,
  path,
  provider = 'WISE Lab',
}: {
  name: string
  description: string
  path: string
  provider?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: SITE_URL,
    },
  }
}

/** Article — for blog posts. */
export function articleSchema({
  title,
  description,
  path,
  image,
  author,
  datePublished,
}: {
  title: string
  description: string
  path: string
  image?: string
  author?: string
  datePublished?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    ...(image && { image }),
    ...(author && { author: { '@type': 'Person', name: author } }),
    ...(datePublished && { datePublished }),
    publisher: {
      '@type': 'Organization',
      name: 'WISE Lab',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/wise-lab-logo.png` },
    },
  }
}
