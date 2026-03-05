import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Events } from '@/components/Events'
import { About } from '@/components/About'
import { Programs } from '@/components/Programs'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const [homePage, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'home-page' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  return (
    <>
      <Header navLinks={siteSettings?.navLinks} />
      <main>
        <Hero data={homePage.hero} />
        <Events data={homePage.events} />
        <About data={homePage.about} />
        <Programs data={homePage.programs} />
        <Contact data={homePage.contact} />
      </main>
      <Footer footerText={siteSettings?.footerText} instagramUrl={homePage.hero?.instagramUrl} instagramHandle={homePage.hero?.instagramHandle} />
    </>
  )
}
