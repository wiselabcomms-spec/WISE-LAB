import type { FormSchema } from '../types'

/**
 * Enterprise Flightpath — Expression of Interest.
 * Deliberately short: unlike Founder Flightpath (a full application),
 * Enterprise Flightpath currently only collects a lightweight expression of
 * interest — business name, a one-line description, and contact details —
 * so WISE Lab can follow up directly rather than screening a long form.
 */
export const enterpriseFormSchema: FormSchema = {
  track: 'enterprise',
  title: 'Enterprise Flightpath — Expression of Interest',
  subtitle:
    'For women-led small businesses and home-based entrepreneurs interested in business training, digital skills, visibility, and market access. Share a few details and our team will follow up.',
  themeTrack: 'enterprise',
  submitLabel: 'Submit expression of interest',
  successTitle: 'Thank you, {firstName}.',
  successBody:
    "Your expression of interest is in. Our team will review it and reach out about next steps.",
  sections: [
    {
      id: 'business-basics',
      title: 'Your business',
      fields: [
        { name: 'businessName', label: 'Business name', type: 'text', required: true },
        {
          name: 'businessDescription',
          label: 'What does your business do? (one or two lines)',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'Contact information',
      fields: [
        { name: 'primaryContactName', label: 'Contact name', type: 'text', required: true },
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
            'I confirm my commitment to actively participate and contribute to the growth of Pakistan’s women entrepreneurship ecosystem.',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
