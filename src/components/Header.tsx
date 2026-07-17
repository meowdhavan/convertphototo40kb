import type { Theme } from '../hooks/useTheme'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

const CONTACT_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/madhavan-raja',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7.5 10v6.5M7.5 7.5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M11 16.5V12.8c0-1.27 1-2.3 2.25-2.3s2.25 1.03 2.25 2.3v3.7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11 10.3v6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/meowdhavan',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M12 2.5a9.5 9.5 0 0 0-3 18.51c.48.09.65-.21.65-.46v-1.79c-2.64.57-3.2-1.16-3.2-1.16-.43-1.1-1.06-1.4-1.06-1.4-.86-.6.07-.58.07-.58.96.07 1.46.99 1.46.99.85 1.46 2.23 1.04 2.77.8.09-.62.33-1.04.6-1.28-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.43-1.22.09-2.55 0 0 .8-.26 2.62.98a9.06 9.06 0 0 1 4.77 0c1.82-1.24 2.62-.98 2.62-.98.52 1.33.19 2.31.1 2.55.6.66.97 1.51.97 2.55 0 3.65-2.22 4.45-4.34 4.69.34.3.64.87.64 1.76v2.6c0 .25.17.56.66.46A9.5 9.5 0 0 0 12 2.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Music',
    href: 'https://linktr.ee/cutefluffykitten',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path
          d="M9 18a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M18 16a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M11 18V6.8a1 1 0 0 1 .78-.98l6-1.35A1 1 0 0 1 19 5.44V13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="app-header-bar">
      <div className="app-header">
        <div className="brand">
          <div className="brand-text">
            <h1>Convert Photo to 40 KB</h1>
            <p>The file compressor approved by Biswa himself</p>
          </div>
        </div>

        <div className="header-actions">
          <nav className="contact-links" aria-label="Contact links">
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                aria-label={link.label}
                title={link.label}
              >
                {link.icon}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
