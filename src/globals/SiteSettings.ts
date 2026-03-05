import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    { name: 'siteTitle', type: 'text', required: true, defaultValue: 'Purdue Fuel Initiative' },
    { name: 'metaDescription', type: 'textarea', defaultValue: 'Purdue Fuel Initiative - Student-led organization focused on fuel and energy sector projects' },
    { name: 'footerText', type: 'text', defaultValue: '2024 Purdue Fuel Initiative. All rights reserved.' },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
