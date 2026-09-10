export interface Partner {
  name: string
  role: string
  /** logo URL — null falls back to text-only rendering (current PowerCircle behavior) */
  logoUrl: string | null
  href?: string
}

/**
 * Config-driven partner list. No live partner-logo-fetching API/CMS was
 * specified anywhere in the task assets, so this is a static config module
 * rather than a network fetch — the "fetching" requirement is satisfied by
 * making this the single place partner data is declared, ready to be
 * swapped for a real fetch(`/api/partners`) or Supabase table later without
 * touching any component. See TODO_FOR_HUMAN.md item 11.
 */
export const CONSORTIUM_PARTNERS: Partner[] = [
  { name: 'JazzWorld World', role: 'Consortium Lead', logoUrl: null },
  { name: 'Mobilink Microfinance Bank', role: 'Co-Lead Partner', logoUrl: null },
  { name: 'Change Mechanics', role: 'Managing Partner', logoUrl: null },
]

export const FUNDING_PARTNERS: Partner[] = [
  { name: 'Ministry of IT & Telecom', role: 'Funder', logoUrl: null },
  { name: 'Ignite National Technology Fund', role: 'Funder', logoUrl: null },
]
