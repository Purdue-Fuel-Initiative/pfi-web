import React from 'react'

type FooterProps = {
  footerText?: string | null
  instagramUrl?: string | null
  instagramHandle?: string | null
}

export function Footer({ footerText, instagramUrl, instagramHandle }: FooterProps) {
  return (
    <footer>
      <div className="footer-content">
        <img src="/pfi-logo-full.svg" alt="PFI Logo" className="footer-logo" />
        <p>&copy; {footerText || '2024 Purdue Fuel Initiative. All rights reserved.'}</p>
        <div className="social-links">
          <a href={instagramUrl || 'https://www.instagram.com/pfi_purdue'} target="_blank" rel="noopener noreferrer">
            Instagram: {instagramHandle || '@pfi_purdue'}
          </a>
        </div>
      </div>
    </footer>
  )
}
