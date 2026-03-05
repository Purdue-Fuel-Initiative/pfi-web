import React from 'react'

type ContactData = {
  heading?: string | null
  subheading?: string | null
  description?: string | null
  instagramHandle?: string | null
}

export function Contact({ data }: { data: ContactData }) {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>{data.heading}</h2>
        <div className="contact-content">
          <div className="contact-info">
            {data.subheading && <h3>{data.subheading}</h3>}
            {data.description && <p>{data.description}</p>}
            <div className="contact-details">
              <p className="instagram-highlight">
                <strong>Instagram:</strong> {data.instagramHandle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
