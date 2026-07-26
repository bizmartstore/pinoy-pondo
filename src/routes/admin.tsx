import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Logo } from "@/components/Logo";
import {
  Users, Banknote, TrendingUp, AlertCircle, ArrowUpRight, Search, Bell, Settings, LogOut,
  LayoutDashboard, FileText, CreditCard, BarChart3, ShieldAlert, MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — PINOY PONDO" },
      { name: "description", content: "Administrator dashboard for PINOY PONDO — manage borrowers, loans, collections, and analytics." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Users, label: "Borrowers" },
  { icon: FileText, label: "Loans" },
  { icon: CreditCard, label: "Collections" },
  { icon: Banknote, label: "Payments" },
  { icon: BarChart3, label: "Reports" },
  { icon: ShieldAlert, label: "Risk" },
  { icon: Settings, label: "Settings" },
];

function Admin() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-secondary text-white">
        <div className="h-16 px-5 flex items-center border-b border-white/10">
          <Logo size="md" variant="light" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.label}
                className={`w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-medium transition ${
                  n.active
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link
            to="/"
            className="w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <LogOut className="h-4 w-4" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30">
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Search borrowers, loans, transactions…" className="pl-9 h-10 rounded-xl bg-muted border-transparent" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="h-10 w-10 rounded-full grid place-items-center hover:bg-muted transition relative">
              <Bell className="h-4 w-4 text-secondary" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-gold grid place-items-center font-bold text-secondary">
              AD
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">Admin Console</div>
              <h1 className="mt-1 text-2xl md:text-3xl font-black text-secondary">Business Overview</h1>
              <p className="text-sm text-muted-foreground">Real-time metrics across your lending operations.</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-xl bg-muted px-4 h-10 text-sm font-semibold text-secondary hover:bg-muted/70 transition">
                Export
              </button>
              <button className="rounded-xl bg-gradient-primary text-white px-4 h-10 text-sm font-semibold shadow-glow hover:opacity-95 transition">
                + New Loan
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI icon={Users} label="Total Borrowers" value={2847} suffix="" trend="+12.4%" tone="primary" />
            <KPI icon={Banknote} label="Active Loans" value={1284} suffix="" trend="+8.2%" tone="gold" />
            <KPI icon={TrendingUp} label="Monthly Collections" value={4820000} prefix="₱" trend="+18.6%" tone="primary" />
            <KPI icon={AlertCircle} label="Overdue Accounts" value={62} trend="-3.1%" tone="danger" negative />
          </div>

          {/* Chart + list */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl bg-card shadow-card border border-border/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-secondary">Loan Disbursements</h3>
                  <p className="text-xs text-muted-foreground">Last 8 months</p>
                </div>
                <button className="h-8 w-8 rounded-lg grid place-items-center hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="mt-6 flex items-end gap-3 h-52">
                {[45, 62, 55, 78, 68, 92, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-xl bg-gradient-primary shadow-glow hover:opacity-90 transition"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
              <h3 className="font-black text-secondary">Portfolio Health</h3>
              <p className="text-xs text-muted-foreground">Live snapshot</p>
              <div className="mt-6 space-y-4">
                <HealthBar label="On Track" value={78} tone="bg-primary" />
                <HealthBar label="Grace Period" value={14} tone="bg-accent" />
                <HealthBar label="Overdue 30d+" value={5} tone="bg-orange-500" />
                <HealthBar label="Default" value={3} tone="bg-destructive" />
              </div>
              <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/20 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Repayment Rate</div>
                <div className="text-3xl font-black text-secondary mt-1">96.4%</div>
              </div>
            </div>
          </div>

          {/* Recent borrowers */}
          <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-secondary">Recent Applications</h3>
              <a href="#" className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="py-3 pr-4 font-semibold">Borrower</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Term</th>
                    <th className="py-3 px-4 font-semibold">Applied</th>
                    <th className="py-3 pl-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { n: "Maria Santos", a: 25000, t: "6 mo", d: "2h ago", s: "Approved", tone: "bg-primary/10 text-primary" },
                    { n: "Pedro Ramos", a: 50000, t: "12 mo", d: "4h ago", s: "Review", tone: "bg-accent/20 text-accent-foreground" },
                    { n: "Ana Reyes", a: 15000, t: "3 mo", d: "6h ago", s: "Approved", tone: "bg-primary/10 text-primary" },
                    { n: "Jose Cruz", a: 80000, t: "18 mo", d: "1d ago", s: "Pending", tone: "bg-muted text-muted-foreground" },
                    { n: "Liza Aquino", a: 10000, t: "3 mo", d: "1d ago", s: "Rejected", tone: "bg-destructive/10 text-destructive" },
                  ].map((r) => (
                    <tr key={r.n} className="hover:bg-muted/40 transition">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-white text-xs font-bold">
                            {r.n.split(" ").map((x) => x[0]).join("")}
                          </div>
                          <div className="font-semibold text-secondary">{r.n}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 tabular-nums font-semibold text-secondary">₱{r.a.toLocaleString()}</td>
                      <td className="py-3 px-4 text-muted-foreground">{r.t}</td>
                      <td className="py-3 px-4 text-muted-foreground">{r.d}</td>
                      <td className="py-3 pl-4 text-right">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${r.tone}`}>{r.s}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function KPI({
  icon: Icon, label, value, prefix = "", suffix = "", trend, tone, negative,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: number; prefix?: string; suffix?: string;
  trend: string; tone: "primary" | "gold" | "danger"; negative?: boolean;
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-accent/20 text-accent-foreground",
    danger: "bg-destructive/10 text-destructive",
  };
  return (
    <div className="rounded-3xl bg-card shadow-card border border-border/60 p-5 hover:shadow-elevated hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-xl grid place-items-center ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-xs font-bold ${negative ? "text-destructive" : "text-primary"}`}>{trend}</span>
      </div>
      <div className="mt-4 text-2xl font-black text-secondary tabular-nums">
        {prefix}
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-xs text-muted-foreground font-medium mt-1">{label}</div>
    </div>
  );
}

function HealthBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold text-secondary">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${tone} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
