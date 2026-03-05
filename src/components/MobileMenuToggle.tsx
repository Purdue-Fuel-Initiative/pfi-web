'use client'

import React, { useState } from 'react'

export function MobileMenuToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={`hamburger ${open ? 'hamburger--open' : ''}`} />
      </button>
      <ul className={`nav-menu ${open ? 'nav-menu--open' : ''}`} onClick={() => setOpen(false)}>
        {children}
      </ul>
    </>
  )
}
