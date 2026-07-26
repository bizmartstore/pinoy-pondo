import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  Wallet, Calendar, TrendingDown, CheckCircle2, Bell, User, Calculator, History, PlusCircle, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PINOY PONDO" },
      { name: "description", content: "Track your loan, upcoming payments, and quick actions in your PINOY PONDO dashboard." },
      { property: "og:title", content: "Dashboard — PINOY PONDO" },
      { property: "og:description", content: "Your financial partner. All in one place." },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

function Dashboard() {
  const total = 50000;
  const paid = 18500;
  const remaining = total - paid;
  const pct = Math.round((paid / total) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Welcome */}
      <section className="bg-gradient-hero text-white pt-10 pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-white/70">{greeting()},</p>
              <h1 className="text-2xl md:text-3xl font-black truncate">Juan Dela Cruz 👋</h1>
              <p className="mt-1 text-sm text-white/70">
                Welcome back to <span className="text-accent font-semibold">PINOY PONDO</span> — your financial partner.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 grid place-items-center hover:bg-white/20 transition relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-gold grid place-items-center font-bold text-secondary">
                JD
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl w-full px-4 -mt-16 pb-20 space-y-6">
        {/* Loan hero card */}
        <div className="rounded-3xl bg-card shadow-elevated border border-border/60 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">Current Loan</div>
              <div className="mt-2 text-4xl md:text-5xl font-black text-secondary tabular-nums">
                ₱<AnimatedCounter value={remaining} />
                <span className="text-lg text-muted-foreground">.00</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Remaining Balance</div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold px-3 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Active · On Track
            </span>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">₱{paid.toLocaleString()} paid of ₱{total.toLocaleString()}</span>
              <span className="font-bold text-primary">{pct}%</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniStat icon={Wallet} label="Monthly Payment" value="₱8,500" tone="primary" />
            <MiniStat icon={Calendar} label="Next Due Date" value="Aug 15, 2026" tone="gold" />
            <MiniStat icon={TrendingDown} label="Term Remaining" value="4 of 6 mos" tone="navy" />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white font-semibold h-12 shadow-glow hover:opacity-95 transition">
              Pay Now <ArrowRight className="h-4 w-4" />
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-muted text-secondary font-semibold h-12 hover:bg-muted/70 transition">
              View Payment Schedule
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-black text-secondary mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <QuickAction icon={PlusCircle} label="Apply Loan" to="/register" />
            <QuickAction icon={Calculator} label="Loan Calculator" to="/calculator" />
            <QuickAction icon={History} label="Payment History" />
            <QuickAction icon={Bell} label="Notifications" />
            <QuickAction icon={User} label="My Profile" />
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-secondary">Recent Payments</h2>
            <a href="#" className="text-sm text-primary font-semibold hover:underline">View all</a>
          </div>
          <div className="mt-4 divide-y divide-border">
            {[
              { d: "Jul 15, 2026", a: 8500, s: "Paid" },
              { d: "Jun 15, 2026", a: 8500, s: "Paid" },
              { d: "May 15, 2026", a: 1500, s: "Partial" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-secondary">Monthly Payment</div>
                    <div className="text-xs text-muted-foreground">{r.d}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-secondary tabular-nums">₱{r.a.toLocaleString()}.00</div>
                  <div className={`text-xs font-semibold ${r.s === "Paid" ? "text-primary" : "text-accent"}`}>{r.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function MiniStat({
  icon: Icon, label, value, tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; tone: "primary" | "gold" | "navy";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-accent/15 text-accent-foreground",
    navy: "bg-secondary/10 text-secondary",
  };
  return (
    <div className="rounded-2xl bg-muted/50 p-4 border border-border/60">
      <div className={`h-9 w-9 rounded-xl grid place-items-center ${toneMap[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-xs text-muted-foreground font-medium">{label}</div>
      <div className="text-lg font-black text-secondary tabular-nums">{value}</div>
    </div>
  );
}

function QuickAction({
  icon: Icon, label, to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; to?: string;
}) {
  const inner = (
    <div className="rounded-2xl bg-card border border-border/60 shadow-card p-4 hover:shadow-elevated hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="h-11 w-11 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="mt-3 text-sm font-semibold text-secondary">{label}</div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}
