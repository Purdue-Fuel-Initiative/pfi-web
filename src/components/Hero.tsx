import React from 'react'

type HeroData = {
  title?: string | null
  tagline?: string | null
  highlight?: string | null
  joinButtonUrl?: string | null
  joinButtonLabel?: string | null
  instagramHandle?: string | null
  instagramUrl?: string | null
}

export function Hero({ data }: { data: HeroData }) {
  const taglineLines = (data.tagline || '').split('\n')

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <img src="/pfi-logo-full.svg" alt="PFI Logo" className="hero-logo" />
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
