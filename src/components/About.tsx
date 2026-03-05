import React from 'react'

type FeatureCard = {
  title: string
  description: string
  id?: string | null
}

type AboutData = {
  heading?: string | null
  question?: string | null
  description?: string | null
  featureCards?: FeatureCard[] | null
}

export function About({ data }: { data: AboutData }) {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2>{data.heading}</h2>
        {data.question && <p className="about-question">{data.question}</p>}
        {data.description && <p>{data.description}</p>}
        {data.featureCards && data.featureCards.length > 0 && (
          <div className="features">
            {data.featureCards.map((card, i) => (
              <div key={i} className="feature-card">
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
