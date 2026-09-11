import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import App from './App'
import { ApplyNowButton } from '@/components/ApplyNowButton'

/**
 * Everything except the landing page ("/") is lazy-loaded: most visits land
 * on "/" and never touch the application forms, blog, vision/mission pages,
 * or the admin portal, so none of that code (or its dependencies, e.g. the
 * Supabase client, admin editor) should be in the initial bundle a phone on
 * a slow connection has to download before the homepage is interactive.
 */
const ApplyPage = lazy(() => import('@/pages/ApplyPage').then((m) => ({ default: m.ApplyPage })))
const HappeningsListPage = lazy(() =>
  import('@/pages/HappeningsListPage').then((m) => ({ default: m.HappeningsListPage }))
)
const HappeningsPostPage = lazy(() =>
  import('@/pages/HappeningsPostPage').then((m) => ({ default: m.HappeningsPostPage }))
)
const VisionPage = lazy(() =>
  import('@/pages/VisionPage').then((m) => ({ default: m.VisionPage }))
)
const MissionPage = lazy(() =>
  import('@/pages/MissionPage').then((m) => ({ default: m.MissionPage }))
)
const FounderFlightpathPage = lazy(() =>
  import('@/pages/FounderFlightpathPage').then((m) => ({ default: m.FounderFlightpathPage }))
)
const EnterpriseFlightpathPage = lazy(() =>
  import('@/pages/EnterpriseFlightpathPage').then((m) => ({
    default: m.EnterpriseFlightpathPage,
  }))
)
const FAQPage = lazy(() =>
  import('@/pages/FAQPage').then((m) => ({ default: m.FAQPage }))
)
/** Whole /admin/* subtree — auth provider, layout, and every admin page —
 *  as one chunk; see AdminApp.tsx for why AdminAuthProvider lives there. */
const AdminApp = lazy(() =>
  import('@/pages/admin/AdminApp').then((m) => ({ default: m.AdminApp }))
)

/** Minimal, theme-agnostic placeholder while a lazy route chunk downloads. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum/20 border-t-plum/70" />
    </div>
  )
}

/**
 * Floating WhatsApp + Apply Now buttons on every public-facing route; hidden
 * on /admin. Apply Now links straight to /apply/founder, so it's also
 * hidden on any /apply/* page — no point showing a CTA to a page the
 * visitor is already on (or already mid-application on a different track).
 */
function GlobalChrome() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin') || pathname.startsWith('/apply')) return null
  return <ApplyNowButton />
}

/**
 * Top-level route tree. The landing page ("/") is exactly the pre-existing
 * <App /> — untouched, still the single-page scroll experience with hash
 * nav, and the only route loaded eagerly. Everything else (application
 * forms, blog, admin portal) is lazy-loaded per the note above.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/apply" element={<Navigate to="/" replace />} />
          <Route path="/apply/:track" element={<ApplyPage />} />
          <Route path="/happenings" element={<HappeningsListPage />} />
          <Route path="/happenings/:slug" element={<HappeningsPostPage />} />
          <Route path="/vision" element={<VisionPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/founder-flightpath" element={<FounderFlightpathPage />} />
          <Route path="/enterprise-flightpath" element={<EnterpriseFlightpathPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
      <GlobalChrome />
    </BrowserRouter>
  )
}
