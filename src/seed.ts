import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  const payload = await getPayload({ config })

  // Seed HomePage global
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        title: 'PURDUE FUEL INITIATIVE',
        tagline: 'Fuel & Energy\nPowered by Students',
        highlight: 'EVERYONE GETS A PROJECT!',
        joinButtonUrl: 'https://forms.gle/KkGj8oKRLJq1do9t7',
        joinButtonLabel: 'Join PFI',
        instagramHandle: '@pfi_purdue',
        instagramUrl: 'https://www.instagram.com/pfi_purdue',
      },
      events: {
        heading: 'Upcoming Events',
        calendarEmbedUrl:
          'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&mode=AGENDA&title=Purdue%20Fuel%20Initiative&showPrint=0&src=ZjBjNGU1ZjMwNmYzYzJjZDdmYmNiZDI5ZDY4YTA2NDdlMjM5ZTkyNDcyY2YxNGRmZTA1ZGM3NjJmYTNhMzZjYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23ad1457',
      },
      about: {
        heading: 'Come and Join Us!',
        question: 'Ever Wanted to Get Involved in the Fuel and Energy Sector?',
        description:
          'Take the lead on meaningful ChemE projects! The Purdue Fuel Initiative is a student-led organization where every member gets hands-on experience with real fuel and energy projects.',
        featureCards: [
          {
            title: 'Hands-On Projects',
            description: 'Every member gets to lead and participate in real ChemE projects focused on fuel and energy.',
          },
          {
            title: 'Industry Experience',
            description: 'Gain practical experience in the fuel and energy sector through student-driven initiatives.',
          },
          {
            title: 'Skill Development',
            description: 'Develop technical and leadership skills valuable for careers in chemical engineering and energy.',
          },
        ],
      },
      programs: {
        heading: 'What We Do',
        subtitle: 'Join now to be part of exciting fuel and energy projects launching soon!',
        programCards: [
          {
            title: 'Hands-On ChemE Projects',
            description: 'Every member leads their own project in fuel and energy. Get involved now to secure your project when we launch!',
          },
          {
            title: 'Industry Exploration',
            description: 'Dive deep into the fuel and energy sector through research, site visits, and professional networking opportunities.',
          },
          {
            title: 'Skills Development',
            description: 'Build technical expertise in chemical engineering, project management, and energy systems through practical application.',
          },
          {
            title: 'Collaborative Innovation',
            description: 'Work alongside fellow students to tackle real-world energy challenges and develop innovative solutions.',
          },
        ],
      },
      contact: {
        heading: 'Get In Touch',
        subheading: 'Join Our Community',
        description: 'Ready to dive into the fuel and energy sector? Join PFI today and take the lead on meaningful ChemE projects!',
        instagramHandle: '@pfi_purdue',
      },
    },
  })

  // Seed SiteSettings global
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteTitle: 'Purdue Fuel Initiative',
      metaDescription: 'Purdue Fuel Initiative - Student-led organization focused on fuel and energy sector projects',
      footerText: '2024 Purdue Fuel Initiative. All rights reserved.',
      navLinks: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/#about' },
        { label: 'Programs', href: '/#programs' },
        { label: 'Events', href: '/#events' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
  })

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
