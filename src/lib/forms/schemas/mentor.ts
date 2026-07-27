import type { FormSchema } from '../types'

/**
 * Guide Her Growth — Expression of Interest.
 * Deliberately short: like Enterprise Flightpath, mentoring starts as a
 * lightweight expression of interest — who you are, what you can help with,
 * and how to reach you — so WISE Lab can follow up directly rather than
 * screening a long application. Uses `themeTrack: 'neutral'` since
 * mentor/partner aren't part of the founder/enterprise track-color system.
 */
export const mentorFormSchema: FormSchema = {
  track: 'mentor',
  title: 'Guide Her Growth — Expression of Interest',
  subtitle:
    'For experts, founders, investors, trainers, and professionals who want to guide women entrepreneurs through practical support. Share a few details and our team will follow up.',
  themeTrack: 'neutral',
  submitLabel: 'Submit expression of interest',
  successTitle: 'Thank you, {firstName}.',
  successBody:
    'Your expression of interest is in. Our team will review it and reach out about next steps.',
  sections: [
    {
      id: 'mentor-basics',
      title: 'About you',
      fields: [
        { name: 'fullName', label: 'Full name', type: 'text', required: true },
        { name: 'currentRole', label: 'Current role / title', type: 'text', required: true },
        { name: 'organization', label: 'Organization', type: 'text' },
        {
          name: 'expertiseAreas',
          label: 'Areas of expertise',
          type: 'select',
          required: true,
          analytics: { dimension: 'expertise', kind: 'categorical' },
          options: [
            { value: 'business-strategy', label: 'Business Strategy' },
            { value: 'finance-investment', label: 'Finance & Investment' },
            { value: 'marketing-branding', label: 'Marketing & Branding' },
            { value: 'product-tech', label: 'Product & Technology' },
            { value: 'legal', label: 'Legal' },
            { value: 'operations', label: 'Operations' },
            { value: 'sales-market-access', label: 'Sales & Market Access' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          name: 'motivation',
          label: 'How would you like to support women founders? (one or two lines)',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'Contact information',
      fields: [
        { name: 'contactNumber', label: 'Contact number', type: 'tel', required: true },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          patternMessage: 'Please enter a valid email.',
        },
        {
          name: 'linkedin',
          label: 'LinkedIn profile',
          type: 'url',
          placeholder: 'https://linkedin.com/in/…',
        },
        {
          name: 'cityProvince',
          label: 'City / Province',
          type: 'text',
          required: true,
          analytics: { dimension: 'city', kind: 'categorical' },
        },
      ],
    },
    {
      id: 'commitment',
      title: 'Commitment statement',
      fields: [
        {
          name: 'commitmentConsent',
          label:
            'I confirm my commitment to actively mentor and support women entrepreneurs through WISE Lab.',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
