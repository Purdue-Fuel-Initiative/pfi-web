import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { RichText } from '@/components/RichText'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  const [homePage, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'home-page' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  return (
    <>
      <Header navLinks={siteSettings?.navLinks} />
      <main style={{ marginTop: 82, padding: '4rem 20px' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary-dark)' }}>
            {page.title}
          </h1>
          <RichText content={page.content} />
        </div>
      </main>
      <Footer
        footerText={siteSettings?.footerText}
        instagramUrl={homePage.hero?.instagramUrl}
        instagramHandle={homePage.hero?.instagramHandle}
      />
    </>
  )
}
