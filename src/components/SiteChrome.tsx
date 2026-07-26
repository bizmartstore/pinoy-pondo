import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader({ enableAdminAccess = true }: { enableAdminAccess?: boolean }) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Logo size="md" enableAdminAccess={enableAdminAccess} />
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition">Home</Link>
          <Link to="/calculator" className="hover:text-foreground transition">Calculator</Link>
          <Link to="/dashboard" className="hover:text-foreground transition">Dashboard</Link>
          <Link to="/login" className="hover:text-foreground transition">Sign In</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden sm:inline-flex text-sm font-semibold text-secondary hover:text-primary transition px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center rounded-full bg-gradient-primary text-white text-sm font-semibold px-4 py-2 shadow-glow hover:opacity-95 transition"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-white/80 mt-24">
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo size="md" variant="light" />
          <p className="mt-4 text-sm text-white/60 leading-relaxed">
            Mabilis. Madali. Maaasahan. Your trusted lending partner in the Philippines.
          </p>
        </div>
        <FooterCol title="Company" items={["About PINOY PONDO", "Contact Us", "Careers", "Blog"]} />
        <FooterCol title="Legal" items={["Privacy Policy", "Terms & Conditions", "Responsible Lending Notice", "Data Protection"]} />
        <FooterCol title="Support" items={["Help Center", "Loan Calculator", "Payment Guide", "FAQs"]} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/50 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} PINOY PONDO. All rights reserved.</span>
          <span>Licensed by the SEC · Registered Lending Company</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4 text-sm">{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="text-white/60 hover:text-accent transition">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
