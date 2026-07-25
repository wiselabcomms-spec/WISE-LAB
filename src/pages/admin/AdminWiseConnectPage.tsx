import { useEffect, useState } from 'react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { listSubmissions, type StoredSubmission } from '@/lib/admin/submissions'

export function AdminWiseConnectPage() {
  const [inquiries, setInquiries] = useState<StoredSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    listSubmissions().then((s) => {
      setInquiries(s.filter((row) => row.track === 'wise-connect'))
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <Reveal>
        <h1 className="font-display text-2xl font-bold text-plum sm:text-3xl">WISE Connect</h1>
        <p className="mt-2 text-plum/60">Inquiries submitted through the homepage contact form, newest first.</p>
      </Reveal>

      {loading ? (
        <p className="mt-8 text-plum/50">Loading…</p>
      ) : inquiries.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-plum/10 bg-white p-6 text-plum/50">
          No inquiries yet.
        </p>
      ) : (
        <RevealGroup className="mt-8 space-y-3" stagger={0.04}>
          {inquiries.map((s) => (
            <RevealItem key={s.id}>
              <div className="rounded-2xl border border-plum/10 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-plum">
                      {String(s.values.name ?? 'Untitled inquiry')}
                    </p>
                    <p className="mt-1 text-sm text-plum/50">
                      {String(s.values.inquiryType ?? '')} · {new Date(s.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-teal">
                    {expanded === s.id ? 'Hide' : 'View'}
                  </span>
                </button>
                {expanded === s.id && (
                  <div className="border-t border-plum/10 p-5">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(s.values).map(([key, val]) => (
                        <div key={key}>
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-plum/40">
                            {key}
                          </dt>
                          <dd className="mt-0.5 break-words text-sm text-plum/80">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  )
}
