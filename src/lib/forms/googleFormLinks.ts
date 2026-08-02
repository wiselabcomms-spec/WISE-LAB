import type { ApplicationTrack } from './types'

/**
 * Tracks that have been moved from the native DynamicForm to an external
 * Google Form (client directive: all applications should be Google Forms).
 * Only populate a track here once you actually have its Google Form URL —
 * ApplyPage falls back to the native form for any track not listed here,
 * so adding a track's real URL is the only step needed to migrate it.
 */
export const GOOGLE_FORM_URLS: Partial<Record<ApplicationTrack, string>> = {
  founder:
    'https://docs.google.com/forms/d/e/1FAIpQLScc2bPdx5MvD5JZCgiwjaJijk3wBlVhxz45f-KNwFAHbxv9qg/viewform',
  // enterprise: '<awaiting Enterprise Flightpath Google Form URL>',
  // mentor: '<awaiting Guide Her Growth Google Form URL>',
  // partner: '<awaiting Open the Ecosystem Google Form URL>',
}
