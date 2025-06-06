import { CryptoLogo } from "./crypto-logo"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 backdrop-blur-sm">
      <div className="container px-4 py-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-8 justify-between mx-auto">
        <div>
          <div className="flex items-center group">
            <CryptoLogo className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-2 text-xl font-bold text-black">
              CryptoTrack
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Track and optimize your crypto investments</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <FooterColumn
            title="Product"
            links={[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/features", label: "Features" },
              { href: "/pricing", label: "Pricing" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/blog", label: "Blog" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
              { href: "/cookies", label: "Cookies" },
            ]}
          />
        </div>
      </div>
      <div className="container px-4 py-6 flex flex-col sm:flex-row justify-between items-center border-t border-border/40 mx-auto">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CryptoTrack. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <SocialLink
            href="#"
            icon={
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            }
          />
          <SocialLink
            href="#"
            icon={
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
            }
          />
          <SocialLink
            href="#"
            icon={
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
              </svg>
            }
          />
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">{title}</h3>
      <nav className="flex flex-col space-y-2">
        {links.map((link, index) => (
          <div
            key={index}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            {link.label}
          </div>
        ))}
      </nav>
    </div>
  )
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
    >
      {icon}
    </a>
  )
}
