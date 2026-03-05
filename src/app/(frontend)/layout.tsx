import type { Metadata } from 'next'
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return {
    title: settings?.siteTitle || 'Purdue Fuel Initiative',
    description: settings?.metaDescription || 'Purdue Fuel Initiative - Student-led organization focused on fuel and energy sector projects',
    icons: { icon: '/pfi-logo-acronym.svg' },
  }
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
