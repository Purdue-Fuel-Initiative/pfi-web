import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  fields: [
    {
      type: 'group',
      name: 'hero',
      label: 'Hero Section',
      fields: [
        { name: 'title', type: 'text', required: true, defaultValue: 'PURDUE FUEL INITIATIVE' },
        { name: 'tagline', type: 'textarea', required: true, defaultValue: 'Fuel & Energy\nPowered by Students' },
        { name: 'highlight', type: 'text', required: true, defaultValue: 'EVERYONE GETS A PROJECT!' },
        { name: 'joinButtonUrl', type: 'text', label: 'Join Button URL', required: true, defaultValue: 'https://forms.gle/KkGj8oKRLJq1do9t7' },
        { name: 'joinButtonLabel', type: 'text', label: 'Join Button Label', defaultValue: 'Join PFI' },
        { name: 'instagramHandle', type: 'text', label: 'Instagram Handle', defaultValue: '@pfi_purdue' },
        { name: 'instagramUrl', type: 'text', label: 'Instagram URL', defaultValue: 'https://www.instagram.com/pfi_purdue' },
      ],
    },
    {
      type: 'group',
      name: 'events',
      label: 'Events Section',
      fields: [
        { name: 'heading', type: 'text', required: true, defaultValue: 'Upcoming Events' },
        {
          name: 'calendarEmbedUrl',
          type: 'textarea',
          label: 'Google Calendar Embed URL',
          required: true,
          defaultValue: 'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&mode=AGENDA&title=Purdue%20Fuel%20Initiative&showPrint=0&src=ZjBjNGU1ZjMwNmYzYzJjZDdmYmNiZDI5ZDY4YTA2NDdlMjM5ZTkyNDcyY2YxNGRmZTA1ZGM3NjJmYTNhMzZjYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23ad1457',
        },
      ],
    },
    {
      type: 'group',
      name: 'about',
      label: 'About Section',
      fields: [
        { name: 'heading', type: 'text', required: true, defaultValue: 'Come and Join Us!' },
        { name: 'question', type: 'text', label: 'Question/Subheading', defaultValue: 'Ever Wanted to Get Involved in the Fuel and Energy Sector?' },
        { name: 'description', type: 'textarea', defaultValue: 'Take the lead on meaningful ChemE projects! The Purdue Fuel Initiative is a student-led organization where every member gets hands-on experience with real fuel and energy projects.' },
        {
          name: 'featureCards',
          type: 'array',
          label: 'Feature Cards',
          minRows: 1,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'programs',
      label: 'Programs Section',
      fields: [
        { name: 'heading', type: 'text', required: true, defaultValue: 'What We Do' },
        { name: 'subtitle', type: 'text', defaultValue: 'Join now to be part of exciting fuel and energy projects launching soon!' },
        {
          name: 'programCards',
          type: 'array',
          label: 'Program Cards',
          minRows: 1,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'contact',
      label: 'Contact Section',
      fields: [
        { name: 'heading', type: 'text', required: true, defaultValue: 'Get In Touch' },
        { name: 'subheading', type: 'text', defaultValue: 'Join Our Community' },
        { name: 'description', type: 'textarea', defaultValue: 'Ready to dive into the fuel and energy sector? Join PFI today and take the lead on meaningful ChemE projects!' },
        { name: 'instagramHandle', type: 'text', label: 'Instagram Handle', defaultValue: '@pfi_purdue' },
      ],
    },
  ],
}
