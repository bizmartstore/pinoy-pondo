import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useAuth } from "@/hooks/useAuth";
import {
  Wallet, Calendar, TrendingDown, CheckCircle2, Bell, User, Calculator, History, PlusCircle, ArrowRight, Loader2,
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/dashboard" } as never });
    } else {
      setReady(true);
    }
  }, [user, loading, navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <div className="flex-1 grid place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const meta = (user!.user_metadata ?? {}) as Record<string, string>;
  const fullName = meta.full_name || [meta.first_name, meta.last_name].filter(Boolean).join(" ") || user!.email!.split("@")[0];
  const initials = fullName.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "PP";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="bg-gradient-hero text-white pt-10 pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-white/70">{greeting()},</p>
              <h1 className="text-2xl md:text-3xl font-black truncate">{fullName} 👋</h1>
              <p className="mt-1 text-sm text-white/70">
                Welcome to <span className="text-accent font-semibold">PINOY PONDO</span> — your financial partner.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 grid place-items-center hover:bg-white/20 transition">
                <Bell className="h-4 w-4" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-gold grid place-items-center font-bold text-secondary text-sm">
                {initials}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl w-full px-4 -mt-16 pb-20 space-y-6">
        {/* No active loan state */}
        <div className="rounded-3xl bg-card shadow-elevated border border-border/60 p-6 md:p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Wallet className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-5 text-2xl md:text-3xl font-black text-secondary">No Active Loan</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            You don't have any active loan yet. Apply now and get funded fast — with transparent rates and flexible terms.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/calculator" className="inline-flex items-center justify-center gap-2 rounded-xl bg-muted text-secondary font-semibold h-12 px-6 hover:bg-muted/70 transition">
              Calculate Loan
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white font-semibold h-12 px-6 shadow-glow hover:opacity-95 transition">
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 text-left">
            <MiniStat icon={Wallet} label="Total Borrowed" value="₱0.00" tone="primary" />
            <MiniStat icon={Calendar} label="Next Due Date" value="—" tone="gold" />
            <MiniStat icon={TrendingDown} label="Active Loans" value="0" tone="navy" />
          </div>
        </div>

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

        <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-secondary">Recent Payments</h2>
          </div>
          <div className="mt-6 py-10 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="mt-3">No payment history yet.</p>
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
