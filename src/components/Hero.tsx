import React from 'react'

type HeroData = {
  title?: string | null
  tagline?: string | null
  highlight?: string | null
  joinButtonUrl?: string | null
  joinButtonLabel?: string | null
  instagramHandle?: string | null
  instagramUrl?: string | null
  heroLogo?: { url?: string | null; alt?: string | null } | number | null
}

export function Hero({ data }: { data: HeroData }) {
  const taglineLines = (data.tagline || '').split('\n')
  const heroLogo = typeof data.heroLogo === 'object' ? data.heroLogo : null
  const logoSrc = heroLogo?.url || '/pfi-logo-full.svg'
  const logoAlt = heroLogo?.alt || 'PFI Logo'

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <img src={logoSrc} alt={logoAlt} className="hero-logo" />
        <h1>{data.title}</h1>
        <p className="tagline">
          {taglineLines.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
        <p className="hero-highlight">{data.highlight}</p>
        <div className="hero-buttons">
          <a href={data.joinButtonUrl || '#'} target="_blank" rel="noopener noreferrer" className="cta-button">
            {data.joinButtonLabel || 'Join PFI'}
          </a>
          <a href={data.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="cta-button cta-button-secondary">
            {data.instagramHandle || '@pfi_purdue'}
          </a>
        </div>
      </div>
    </section>
  )
}
