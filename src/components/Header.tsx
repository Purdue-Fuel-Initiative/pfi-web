import React from 'react'

type NavLink = {
  label: string
  href: string
  id?: string | null
}

export function Header({ navLinks }: { navLinks?: NavLink[] | null }) {
  const links = navLinks?.length
    ? navLinks
    : [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/#about' },
        { label: 'Programs', href: '/#programs' },
        { label: 'Events', href: '/#events' },
        { label: 'Contact', href: '/#contact' },
      ]

  return (
    <header>
      <nav>
        <div className="nav-container">
          <a href="/" className="logo">
            <img src="/pfi-logo-acronym.svg" alt="PFI Logo" className="logo-img" />
          </a>
          <ul className="nav-menu">
            {links.map((link, i) => (
              <li key={i}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
