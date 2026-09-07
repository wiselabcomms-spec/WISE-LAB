import { useTranslation } from 'react-i18next'

/**
 * PM government-credit masthead.
 *
 * `public/pm-banner.jpg` already contains the full designed banner (PM photo,
 * the "Under the vision..." credit text, and ministry/ignite logos), so we
 * render the whole image undistorted and use `pmBanner.text` only for the
 * image's accessibility alt text.
 */

export function PMBanner() {
  const { t } = useTranslation()
  return (
    <div className="relative w-full overflow-hidden border-b border-plum/10 bg-white">
      <img
        src="/pm-banner.webp"
        alt={t('pmBanner.text')}
        className="block w-full h-auto"
      />
    </div>
  )
}
