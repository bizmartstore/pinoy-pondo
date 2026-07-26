import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Zap,
  ShieldCheck,
  Wallet,
  Smartphone,
  Calendar,
  ReceiptText,
  ArrowRight,
  Calculator,
  Sparkles,
  CheckCircle2,
  Star,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PINOY PONDO — Fast Cash Loans Made Simple" },
      {
        name: "description",
        content:
          "Apply for a loan in minutes, track your payments, and manage your finances with confidence. Mabilis. Madali. Maaasahan.",
      },
      { property: "og:title", content: "PINOY PONDO — Fast Cash Loans Made Simple" },
      {
        property: "og:description",
        content: "Apply for a loan in minutes, track your payments, and manage your finances with confidence. Mabilis. Madali. Maaasahan.",
      },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Zap, title: "Fast Approval", desc: "Get approved in as fast as 10 minutes with our automated screening system." },
  { icon: Wallet, title: "Affordable Fixed Monthly Interest", desc: "Flat 4% monthly rate. No surprises, no compounding fees." },
  { icon: ShieldCheck, title: "Secure & Confidential", desc: "Bank-grade encryption protects your personal and financial data." },
  { icon: Smartphone, title: "Manage Everything Online", desc: "Apply, pay, and track — all from your phone, anytime." },
  { icon: Calendar, title: "Transparent Payment Schedule", desc: "See every due date and amount before you sign. Always." },
  { icon: ReceiptText, title: "No Hidden Charges", desc: "What you see is what you pay. Full transparency, always." },
];

const stats = [
  { value: 250000, suffix: "+", label: "Trusted Borrowers" },
  { value: 1200000000, prefix: "₱", label: "Loans Released", format: "peso" },
  { value: 10, suffix: " min", label: "Fast Approvals" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
];

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-medium text-white/90 border border-white/20 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Mabilis. Madali. Maaasahan.
          </div>

          <div className="mt-8 flex justify-center animate-fade-in-up">
            <Logo size="xl" variant="light" enableAdminAccess showText={false} />
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight animate-fade-in-up">
            PINOY <span className="text-accent">PONDO</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-semibold text-white/90 animate-fade-in-up">
            Fast Cash Loans Made Simple
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70 leading-relaxed animate-fade-in-up">
            Apply for a loan in minutes, track your payments, and manage your finances
            with confidence.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary text-white font-semibold px-7 py-3.5 shadow-glow hover:scale-[1.02] transition w-full sm:w-auto"
            >
              <Zap className="h-4 w-4" /> Apply Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-7 py-3.5 hover:bg-white/20 transition w-full sm:w-auto"
            >
              <Calculator className="h-4 w-4" /> Loan Calculator
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-white/70 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-white/40 bg-gradient-primary" />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </div>
            <span>Trusted by 250,000+ Filipinos</span>
          </div>
        </div>

        {/* wave divider */}
        <svg className="absolute bottom-0 left-0 w-full text-background" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,32L80,32C160,32,320,32,480,26.7C640,21,800,11,960,16C1120,21,1280,43,1360,53.3L1440,64L1440,64L0,64Z" />
        </svg>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 bg-white rounded-3xl shadow-elevated p-5 md:p-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-secondary">
                {s.format === "peso" ? (
                  <PesoStat value={s.value} />
                ) : (
                  <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                )}
              </div>
              <div className="mt-1 text-xs md:text-sm text-muted-foreground font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block text-xs font-bold uppercase tracking-widest text-primary">Why PINOY PONDO</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-black text-secondary">
            Kaagapay sa Iyong Pangangailangan
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to borrow smart and pay easy — built for Filipinos.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative rounded-3xl bg-card p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 border border-border/60"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                  <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-secondary">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-14 text-white text-center shadow-elevated">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-black">Pera Kapag Kailangan Mo.</h3>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">
              Join thousands of Filipinos who trust PINOY PONDO for fast, fair, and transparent loans.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-secondary font-bold px-7 py-3.5 hover:bg-accent hover:text-secondary transition"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/30 text-white font-semibold px-7 py-3.5 hover:bg-white/20 transition"
              >
                <CheckCircle2 className="h-4 w-4" /> I have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function PesoStat({ value }: { value: number }) {
  // format 1.2B
  const b = value / 1_000_000_000;
  return (
    <>
      ₱<AnimatedCounter value={Math.round(b * 10)} />
      <span className="text-lg align-top">M</span>
    </>
  );
}
