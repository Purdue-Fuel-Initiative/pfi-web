import React from 'react'

type ProgramCard = {
  title: string
  description: string
  id?: string | null
}

type ProgramsData = {
  heading?: string | null
  subtitle?: string | null
  programCards?: ProgramCard[] | null
}

export function Programs({ data }: { data: ProgramsData }) {
  return (
    <section id="programs" className="programs">
      <div className="container">
        <h2>{data.heading}</h2>
        {data.subtitle && <p className="section-subtitle">{data.subtitle}</p>}
        {data.programCards && data.programCards.length > 0 && (
          <div className="program-grid">
            {data.programCards.map((card, i) => (
              <div key={i} className="program-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
