import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { FileText, LayoutDashboard, LogOut, Menu, MessageCircle, Newspaper, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { WiseMark } from '@/components/WiseLabLogo'
import { useAdminAuth } from '@/lib/auth/useAdminAuth'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const { t } = useTranslation()
  const { session, loading, isAdmin, isDemo, signOut } = useAdminAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = [
    { to: '/admin', label: t('admin.nav.dashboard'), Icon: LayoutDashboard, end: true },
    { to: '/admin/submissions', label: t('admin.nav.submissions'), Icon: FileText },
    { to: '/admin/wise-connect', label: t('admin.nav.wiseConnect', 'WISE Connect'), Icon: MessageCircle },
    { to: '/admin/blog', label: t('admin.nav.blog'), Icon: Newspaper },
  ]

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-beige text-plum/50">
        {t('admin.common.loading')}
      </div>
    )
  }
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />

  const navLinks = (
    <>
      {nav.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors',
              isActive ? 'bg-teal/10 text-teal' : 'text-plum/70 hover:bg-plum/5 hover:text-plum'
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </>
  )

  return (
    <div className={cn('flex min-h-screen flex-col bg-beige lg:flex-row', isDemo && 'pt-9')}>
      {isDemo && (
        <div className="fixed inset-x-0 top-0 z-[70] bg-amber-400 py-2 text-center text-[12px] font-bold uppercase tracking-wide text-amber-950">
          Demo mode — showing sample data, not real submissions
        </div>
      )}
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-plum/10 bg-white p-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <WiseMark className="h-7 w-auto" />
          <span className="font-display text-base font-bold text-plum">{t('admin.nav.title')}</span>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open admin menu"
          className="flex h-11 w-11 items-center justify-center rounded-full text-plum transition-colors hover:bg-plum/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-plum/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute left-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <WiseMark className="h-8 w-auto" />
                <span className="font-display text-lg font-bold text-plum">{t('admin.nav.title')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close admin menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-plum hover:bg-plum/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-1 flex-col gap-1">{navLinks}</nav>
              <button
                type="button"
                onClick={() => signOut()}
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-plum/60 transition-colors hover:bg-plum/5 hover:text-plum"
              >
                <LogOut className="h-4 w-4" />
                {t('admin.common.signOut')}
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-plum/10 bg-white p-6 lg:flex">
        <div className="flex items-center gap-2.5">
          <WiseMark className="h-8 w-auto" />
          <span className="font-display text-lg font-bold text-plum">{t('admin.nav.title')}</span>
        </div>
        <nav className="mt-10 flex flex-1 flex-col gap-1">{navLinks}</nav>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-plum/60 transition-colors hover:bg-plum/5 hover:text-plum"
        >
          <LogOut className="h-4 w-4" />
          {t('admin.common.signOut')}
        </button>
      </aside>
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8 md:p-12">
        <Outlet />
      </main>
    </div>
  )
}
