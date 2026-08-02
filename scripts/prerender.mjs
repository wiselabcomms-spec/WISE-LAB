#!/usr/bin/env node
/**
 * Build-time prerendering.
 *
 * This is a plain CSR SPA (no SSR framework) — `dist/index.html` ships an
 * empty <div id="root">. That's invisible to anything that fetches a page
 * without executing JS: raw crawlers, and critically ChatGPT/Perplexity/
 * Claude's web-fetch tools, which don't run JS at all.
 *
 * This script boots each public route in headless Chromium against the
 * already-built `dist/`, waits for real content to render (including the
 * blog list/detail pages' async Supabase fetch), and writes the fully
 * rendered HTML to `dist/<route>/index.html`. The page's own <script> tags
 * are still in that captured HTML, so real users get the same static
 * content on first paint and then React hydrates on top of it exactly as
 * before — nothing about the live app changes, this only changes what a
 * non-JS fetch of the URL returns.
 *
 * /admin/* is deliberately never in the route list — it's an authenticated
 * portal and must never be prerendered or crawlable (also blocked in
 * robots.txt).
 */
import { chromium } from 'playwright'
import { preview } from 'vite'
import { mkdirSync, writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')

const STATIC_ROUTES = [
  '/',
  '/vision',
  '/mission',
  '/founder-flightpath',
  '/enterprise-flightpath',
  '/apply/founder',
  '/apply/enterprise',
  '/apply/mentor',
  '/apply/partner',
  '/blog',
]

async function getPublishedBlogSlugs() {
  const envPath = join(ROOT, '.env')
  let url, key
  try {
    const env = readFileSync(envPath, 'utf-8')
    url = env.match(/^VITE_SUPABASE_URL=(.*)$/m)?.[1]?.trim()
    key = env.match(/^VITE_SUPABASE_ANON_KEY=(.*)$/m)?.[1]?.trim()
  } catch {
    // .env not present (e.g. CI) — fall through to env vars below
  }
  url = url || process.env.VITE_SUPABASE_URL
  key = key || process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('[prerender] No Supabase config found — skipping blog post routes.')
    return []
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=slug&status=eq.published`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    )
    if (!res.ok) {
      console.warn(`[prerender] Blog slug fetch failed (${res.status}) — skipping blog post routes.`)
      return []
    }
    const rows = await res.json()
    return rows.map((r) => `/blog/${r.slug}`)
  } catch (err) {
    console.warn('[prerender] Blog slug fetch errored — skipping blog post routes.', err.message)
    return []
  }
}

function routeToOutputPath(route) {
  if (route === '/') return join(DIST, 'index.html')
  return join(DIST, route.replace(/^\//, ''), 'index.html')
}

async function main() {
  const blogRoutes = await getPublishedBlogSlugs()
  const routes = [...STATIC_ROUTES, ...blogRoutes]

  console.log(`[prerender] Serving dist/ and prerendering ${routes.length} route(s)...`)

  const server = await preview({ root: ROOT, preview: { port: 4173, strictPort: false } })
  const actualPort = server.config.preview.port
  const base = `http://localhost:${actualPort}`

  const browser = await chromium.launch()
  const page = await browser.newPage()

  let ok = 0
  for (const route of routes) {
    try {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 30_000 })
      // Small settle buffer for anything that updates just after networkidle
      // (e.g. a state update following the last fetch resolving).
      await page.waitForTimeout(300)
      let html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML)

      // Lazy-loaded route chunks (React.lazy/dynamic import) resolve against
      // the page's actual origin at capture time, so the captured DOM has
      // this local preview server's absolute origin baked into their script
      // tags. Strip it back to root-relative so the snapshot works on
      // whatever domain actually serves it (or on any port when testing).
      html = html.split(base).join('')

      const outPath = routeToOutputPath(route)
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, html)
      ok++
      console.log(`[prerender] ✓ ${route}`)
    } catch (err) {
      console.error(`[prerender] ✗ ${route} — ${err.message}`)
    }
  }

  await browser.close()
  await server.close()

  console.log(`[prerender] Done: ${ok}/${routes.length} routes prerendered.`)
  if (ok < routes.length) {
    // Don't fail the whole build over a prerender miss — the SPA fallback
    // still works for any route that didn't get a static snapshot.
    console.warn('[prerender] Some routes were not prerendered; they will still work as a client-rendered fallback.')
  }
}

main().catch((err) => {
  console.error('[prerender] Fatal error:', err)
  // Non-zero here would fail the whole deploy over a prerender problem —
  // prefer shipping the working CSR build over blocking the deploy.
  process.exit(0)
})
