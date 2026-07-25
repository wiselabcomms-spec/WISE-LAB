import type { Track } from '@/lib/useTrackState'

/**
 * Config-driven form schema architecture.
 *
 * A FormSchema describes an entire application form (Founder Flightpath,
 * Enterprise Flightpath, Become a Mentor, Partner with WISE) as data, so the
 * DynamicForm component can render, validate, and submit any of them without
 * per-track bespoke form code. Sections group related fields visually
 * (mirrors the docx structure for Founder Flightpath); fields within a
 * section render in a single card, matching the WiseConnect visual pattern.
 */

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'consent'
  | 'table'
  | 'url'

export interface SelectOption {
  value: string
  label: string
}

/** Marks a field as a dimension the analytics/admin dashboards can chart/filter by. */
export interface Chartable {
  /** stable dimension key used in aggregate queries, e.g. "vertical", "stage" */
  dimension: string
  /** 'categorical' -> bar/pie by value, 'boolean' -> yes/no split */
  kind: 'categorical' | 'boolean'
}

export interface ConditionalOn {
  /** field name this field depends on */
  field: string
  /** show this field only when the dependency equals one of these values */
  equals: string | string[] | boolean
}

/** Column definition for a `table` field type (e.g. Team Details). */
export interface TableColumn {
  key: string
  label: string
  type: 'text' | 'number' | 'select'
  options?: SelectOption[]
  required?: boolean
  placeholder?: string
}

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  helpText?: string
  options?: SelectOption[]
  /** for 'table' fields: column schema for each repeatable row */
  columns?: TableColumn[]
  /** minimum rows required for a table field (e.g. at least 1 team member) */
  minRows?: number
  /** only show/require this field when the condition is met */
  conditional?: ConditionalOn
  /** analytics dimension metadata — omitted for fields that aren't chartable */
  analytics?: Chartable
  /** validation: regex pattern for text-like fields */
  pattern?: RegExp
  patternMessage?: string
  /** max length for text/textarea */
  maxLength?: number
}

export interface FormSection {
  id: string
  title: string
  description?: string
  fields: FieldDef[]
}

export type ApplicationTrack = 'founder' | 'enterprise' | 'mentor' | 'partner'

/**
 * Everything a `submissions` row can be tagged with — the four schema-driven
 * application tracks plus 'wise-connect' (the homepage contact form, which
 * has no FormSchema/route of its own but shares the same table/RLS/admin
 * list pattern — see submitWiseConnectInquiry in submitApplication.ts).
 */
export type SubmissionTrack = ApplicationTrack | 'wise-connect'

export interface FormSchema {
  /** application track key, also used as the /apply/:track route param */
  track: ApplicationTrack
  /** page title */
  title: string
  /** page sub-headline */
  subtitle: string
  /** which TRACK_THEME token drives the accent color for this form (falls back to 'neutral') */
  themeTrack: Track
  sections: FormSection[]
  /** copy shown on the submit button */
  submitLabel: string
  /** copy shown in the success state, {firstName} is interpolated if available */
  successTitle: string
  successBody: string
}

/**
 * Stable submission payload shape. Every DynamicForm submission (regardless
 * of track) normalizes to this envelope before it's written to Supabase
 * `submissions` or POSTed anywhere else — so admin/analytics code has one
 * shape to deal with instead of one per track.
 */
export interface SubmissionPayload {
  track: SubmissionTrack
  /** raw field values keyed by FieldDef.name (tables serialize to arrays of row objects) */
  values: Record<string, unknown>
  /** flattened { dimension: value } map built from fields marked `analytics` */
  analytics: Record<string, string | boolean>
  submittedAt: string
  /** basic client metadata, non-PII, useful for spam triage */
  meta: {
    userAgent: string
    locale: string
  }
}
