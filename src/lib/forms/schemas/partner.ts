import type { FormSchema } from '../types'

/**
 * Open the Ecosystem — Expression of Interest.
 * Deliberately short, like Enterprise Flightpath and Guide Her Growth:
 * organization, category, and what you're proposing, so WISE Lab can follow
 * up directly. Partner categories come from the Content Brief's Power Circle
 * section (Academic, Corporate, Development, Financial, Media, Investor
 * Networks, Training, Market Access, Community).
 */
export const partnerFormSchema: FormSchema = {
  track: 'partner',
  title: 'Open the Ecosystem — Expression of Interest',
  subtitle:
    'For organizations ready to collaborate on women-led innovation, enterprise, access, and inclusive growth. Share a few details and our team will follow up.',
  themeTrack: 'neutral',
  submitLabel: 'Submit expression of interest',
  successTitle: 'Thank you, {firstName}.',
  successBody:
    'Your expression of interest is in. Our team will review it and reach out about next steps.',
  sections: [
    {
      id: 'organization-basics',
      title: 'Organization',
      fields: [
        { name: 'organizationName', label: 'Organization name', type: 'text', required: true },
        {
          name: 'partnerCategory',
          label: 'Partner category',
          type: 'select',
          required: true,
          analytics: { dimension: 'partnerCategory', kind: 'categorical' },
          options: [
            { value: 'academic', label: 'Academic Partner' },
            { value: 'corporate', label: 'Corporate Partner' },
            { value: 'development', label: 'Development Partner' },
            { value: 'financial', label: 'Financial Partner' },
            { value: 'media', label: 'Media Partner' },
            { value: 'investor-network', label: 'Investor Network' },
            { value: 'training', label: 'Training Partner' },
            { value: 'market-access', label: 'Market Access Partner' },
            { value: 'community', label: 'Community Partner' },
            { value: 'other', label: 'Other' },
          ],
        },
        { name: 'website', label: 'Website', type: 'url', placeholder: 'https://…' },
        {
          name: 'proposedCollaboration',
          label: 'What kind of collaboration are you proposing? (one or two lines)',
          type: 'textarea',
          required: true,
          helpText: 'Skills, markets, finance, mentorship, ecosystem support, etc.',
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'Contact information',
      fields: [
        { name: 'contactName', label: 'Point of contact', type: 'text', required: true },
        { name: 'contactRole', label: 'Role / title', type: 'text', required: true },
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
            'I confirm this organization is committed to collaborating in good faith on WISE Lab’s mission to advance women-led innovation and enterprise.',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
