import React from 'react'

type EventsData = {
  heading?: string | null
  calendarEmbedUrl?: string | null
}

export function Events({ data }: { data: EventsData }) {
  return (
    <section id="events" className="events">
      <div className="container">
        <h2>{data.heading}</h2>
        <div className="calendar-container">
          {data.calendarEmbedUrl && (
            <iframe
              src={data.calendarEmbedUrl}
              style={{ border: 'solid 1px #777' }}
              frameBorder="0"
              scrolling="no"
            />
          )}
        </div>
      </div>
    </section>
  )
}
