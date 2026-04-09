import Link from "next/link";

const navigation = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Watch Demo", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#support" },
    { label: "Contact Us", href: "#" },
    { label: "Community", href: "#" },
  ],
} as const;

export function Footer() {
  return (
    <footer id="support" className="border-t border-outline-variant/10 bg-surface-container-lowest dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main footer */}
        <div className="py-14 md:py-16 grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <div className="sm:col-span-1 space-y-3">
            <Link
              href="/"
              className="text-lg font-extrabold tracking-tight text-on-surface block"
            >
              Suki<span className="text-primary">Track</span>
            </Link>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-xs">
              The intelligent companion for Philippine sari-sari store owners.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/50">
              Product
            </h4>
            <ul className="space-y-2.5">
              {navigation.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/50">
              Support
            </h4>
            <ul className="space-y-2.5">
              {navigation.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-on-surface-variant/50 font-medium">
            © 2026 SukiTrack · Built with pride for Philippine store owners.
          </p>
          <p className="text-xs text-on-surface-variant/30 font-medium tracking-wide">
            SukiTrack Ecosystem
          </p>
        </div>
      </div>
    </footer>
  );
}
