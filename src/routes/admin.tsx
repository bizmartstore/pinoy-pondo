import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, Banknote, TrendingUp, AlertCircle, Wallet, PiggyBank, ArrowDownCircle, ArrowUpCircle,
  LogOut, LayoutDashboard, FileText, CreditCard, BarChart3, Plus, Loader2, CheckCircle2, XCircle, UserCheck,
} from "lucide-react";
import { peso, pesoShort, computeEarnings, fetchAll, type Loan, type Payment, type Investment } from "@/lib/finance";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — PINOY PONDO" },
      { name: "description", content: "Administrator dashboard for PINOY PONDO." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

type Tab = "overview" | "approvals" | "loans" | "payments" | "investments" | "earnings";

type PendingProfile = {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  mobile: string | null;
  address: string | null;
  employer: string | null;
  job_title: string | null;
  monthly_income: number | null;
  id_type: string | null;
  id_number: string | null;
  id_photo_url: string | null;
  selfie_url: string | null;
  approval_status: string;
  created_at: string;
};

function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);

  const reload = async () => {
    setLoading(true);
    const [{ loans, payments, investments, errors }, profRes] = await Promise.all([
      fetchAll(),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    if (errors.length) toast.error(errors[0]!.message);
    if (profRes.error) toast.error(profRes.error.message);
    setLoans(loans); setPayments(payments); setInvestments(investments);
    setProfiles((profRes.data ?? []) as PendingProfile[]);
    setLoading(false);
  };
  useEffect(() => { reload(); }, []);

  const totalInvested = investments.reduce((s, i) => s + Number(i.amount), 0);
  const totalCollected = payments.reduce((s, p) => s + Number(p.amount), 0);
  const { totalInterest, investorShare, adminShare, lentOut } = useMemo(() => computeEarnings(loans), [loans]);
  const activeLoans = loans.filter(l => l.status === "active" || l.status === "approved").length;
  const overdue = loans.filter(l => l.status === "overdue").length;
  const availableCapital = totalInvested + totalCollected - lentOut;
  const uniqueBorrowers = new Set(loans.map(l => l.user_id)).size;
  const pendingCount = profiles.filter(p => p.approval_status === "pending").length;

  const nav: { key: Tab; icon: typeof LayoutDashboard; label: string; badge?: number }[] = [
    { key: "overview", icon: LayoutDashboard, label: "Overview" },
    { key: "approvals", icon: UserCheck, label: "Approvals", badge: pendingCount },
    { key: "loans", icon: FileText, label: "Loans" },
    { key: "payments", icon: CreditCard, label: "Payments" },
    { key: "investments", icon: PiggyBank, label: "Investments" },
    { key: "earnings", icon: BarChart3, label: "Earnings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-secondary text-white">
        <div className="h-16 px-5 flex items-center border-b border-white/10">
          <Logo size="md" variant="light" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = tab === n.key;
            return (
              <button key={n.key} onClick={() => setTab(n.key)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-medium transition ${
                  active ? "bg-gradient-primary text-white shadow-glow" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}>
                <Icon className="h-4 w-4" /> {n.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link to="/" className="w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition">
            <LogOut className="h-4 w-4" /> Exit Admin
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30">
          <div className="lg:hidden"><Logo size="sm" /></div>
          <div className="ml-auto flex items-center gap-2 overflow-x-auto lg:hidden">
            {nav.map((n) => (
              <button key={n.key} onClick={() => setTab(n.key)}
                className={`shrink-0 text-xs font-semibold rounded-full px-3 py-1.5 border transition ${
                  tab === n.key ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-transparent"
                }`}>{n.label}</button>
            ))}
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-6">
          {loading ? (
            <div className="grid place-items-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <>
              {tab === "overview" && (
                <Overview
                  uniqueBorrowers={uniqueBorrowers}
                  activeLoans={activeLoans}
                  totalCollected={totalCollected}
                  overdue={overdue}
                  availableCapital={availableCapital}
                  lentOut={lentOut}
                  totalInvested={totalInvested}
                  loans={loans}
                />
              )}
              {tab === "loans" && <LoansTab loans={loans} onChanged={reload} availableCapital={availableCapital} />}
              {tab === "payments" && <PaymentsTab payments={payments} loans={loans} onChanged={reload} />}
              {tab === "investments" && <InvestmentsTab investments={investments} onChanged={reload} />}
              {tab === "earnings" && (
                <EarningsTab
                  totalInterest={totalInterest} investorShare={investorShare} adminShare={adminShare}
                  totalInvested={totalInvested} totalCollected={totalCollected}
                  lentOut={lentOut} availableCapital={availableCapital} loans={loans}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, tone }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string;
  tone: "primary" | "gold" | "danger" | "navy";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-accent/20 text-accent-foreground",
    danger: "bg-destructive/10 text-destructive",
    navy: "bg-secondary/10 text-secondary",
  };
  return (
    <div className="rounded-3xl bg-card shadow-card border border-border/60 p-5">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${toneMap[tone]}`}><Icon className="h-5 w-5" /></div>
      <div className="mt-4 text-2xl font-black text-secondary tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground font-medium mt-1">{label}</div>
    </div>
  );
}

function Overview(props: {
  uniqueBorrowers: number; activeLoans: number; totalCollected: number; overdue: number;
  availableCapital: number; lentOut: number; totalInvested: number; loans: Loan[];
}) {
  const recent = props.loans.slice(0, 8);
  return (
    <>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Admin Console</div>
        <h1 className="mt-1 text-2xl md:text-3xl font-black text-secondary">Business Overview</h1>
        <p className="text-sm text-muted-foreground">Live metrics from your Supabase project.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={Users} label="Total Borrowers" value={String(props.uniqueBorrowers)} tone="primary" />
        <KPI icon={Banknote} label="Active Loans" value={String(props.activeLoans)} tone="gold" />
        <KPI icon={TrendingUp} label="Total Collections" value={peso(props.totalCollected)} tone="primary" />
        <KPI icon={AlertCircle} label="Overdue Accounts" value={String(props.overdue)} tone="danger" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KPI icon={Wallet} label="Available Capital" value={peso(props.availableCapital)} tone="primary" />
        <KPI icon={ArrowUpCircle} label="Lent Out" value={peso(props.lentOut)} tone="navy" />
        <KPI icon={PiggyBank} label="Total Invested" value={peso(props.totalInvested)} tone="gold" />
      </div>

      <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
        <h3 className="font-black text-secondary">Recent Loans</h3>
        {recent.length === 0 ? (
          <div className="mt-8 text-center text-sm text-muted-foreground py-8">No loans yet.</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-3 pr-4">Borrower</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Term</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent.map((l) => (
                  <tr key={l.id}>
                    <td className="py-3 pr-4 font-semibold text-secondary">{l.borrower_name ?? l.user_id.slice(0, 8)}</td>
                    <td className="py-3 px-4 tabular-nums font-semibold text-secondary">{peso(Number(l.amount))}</td>
                    <td className="py-3 px-4 text-muted-foreground">{l.term_months} mo</td>
                    <td className="py-3 px-4 text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                    <td className="py-3 pl-4 text-right"><StatusPill status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function StatusPill({ status }: { status: Loan["status"] }) {
  const map: Record<Loan["status"], string> = {
    approved: "bg-primary/10 text-primary",
    active: "bg-primary/10 text-primary",
    pending: "bg-muted text-muted-foreground",
    paid: "bg-accent/20 text-accent-foreground",
    rejected: "bg-destructive/10 text-destructive",
    overdue: "bg-destructive/10 text-destructive",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${map[status]}`}>{status}</span>;
}

function LoansTab({ loans, onChanged, availableCapital }: { loans: Loan[]; onChanged: () => void; availableCapital: number }) {
  const setStatus = async (id: string, status: Loan["status"], amount?: number) => {
    if (status === "approved" && amount && amount > availableCapital) {
      toast.error(`Insufficient capital. Available: ${peso(availableCapital)}`); return;
    }
    const patch: Partial<Loan> = { status };
    if (status === "approved") patch.approved_at = new Date().toISOString();
    const { error } = await supabase.from("loans").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Loan ${status}`); onChanged();
  };
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black text-secondary">Loans</h1>
          <p className="text-sm text-muted-foreground">Available capital: <span className="font-bold text-primary">{peso(availableCapital)}</span></p>
        </div>
      </div>
      <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
        {loans.length === 0 ? (
          <EmptyState label="No loan applications yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-3 pr-4">Borrower</th><th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Term</th><th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">Status</th><th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loans.map((l) => (
                  <tr key={l.id}>
                    <td className="py-3 pr-4 font-semibold text-secondary">{l.borrower_name ?? l.user_id.slice(0, 8)}</td>
                    <td className="py-3 px-4 tabular-nums">{peso(Number(l.amount))}</td>
                    <td className="py-3 px-4 text-muted-foreground">{l.term_months} mo</td>
                    <td className="py-3 px-4 text-muted-foreground">{l.interest_rate}%/mo</td>
                    <td className="py-3 px-4"><StatusPill status={l.status} /></td>
                    <td className="py-3 pl-4 text-right space-x-1">
                      {l.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => setStatus(l.id, "approved", Number(l.amount))}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => setStatus(l.id, "rejected")}>
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {(l.status === "approved" || l.status === "active") && (
                        <Button size="sm" variant="outline" className="h-8" onClick={() => setStatus(l.id, "paid")}>Mark Paid</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentsTab({ payments, loans, onChanged }: { payments: Payment[]; loans: Loan[]; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [loanId, setLoanId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const payableLoans = loans.filter(l => l.status === "approved" || l.status === "active" || l.status === "overdue");

  const submit = async () => {
    if (!loanId) return toast.error("Select a loan");
    const n = Number(amount);
    if (!n || n <= 0) return toast.error("Enter valid amount");
    setSaving(true);
    const { data: sess } = await supabase.auth.getUser();
    const { error } = await supabase.from("payments").insert({
      loan_id: loanId, amount: n, method, note: note || null, recorded_by: sess.user?.id ?? null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Payment recorded");
    setOpen(false); setLoanId(""); setAmount(""); setMethod("cash"); setNote("");
    onChanged();
  };

  const loanLabel = (id: string) => {
    const l = loans.find(x => x.id === id);
    return l ? `${l.borrower_name ?? l.user_id.slice(0, 8)} — ${peso(Number(l.amount))}` : id.slice(0, 8);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-secondary">Payments</h1>
          <p className="text-sm text-muted-foreground">Record manual/off-platform payments.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white shadow-glow"><Plus className="h-4 w-4 mr-1.5" />Add Manual Payment</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Record Manual Payment</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-secondary">Loan</label>
                <Select value={loanId} onValueChange={setLoanId}>
                  <SelectTrigger><SelectValue placeholder="Select loan" /></SelectTrigger>
                  <SelectContent>
                    {payableLoans.length === 0 && <div className="text-sm text-muted-foreground p-3">No active loans</div>}
                    {payableLoans.map(l => (
                      <SelectItem key={l.id} value={l.id}>{loanLabel(l.id)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-secondary">Amount (₱)</label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-semibold text-secondary">Method</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="gcash">GCash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="maya">Maya</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-secondary">Note (optional)</label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
              </div>
              <Button onClick={submit} disabled={saving} className="w-full bg-gradient-primary">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Record Payment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
        {payments.length === 0 ? (
          <EmptyState label="No payments recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-3 pr-4">Date</th><th className="py-3 px-4">Loan</th>
                  <th className="py-3 px-4">Method</th><th className="py-3 px-4">Note</th>
                  <th className="py-3 pl-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="py-3 pr-4 text-muted-foreground">{new Date(p.paid_at).toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-secondary">{loanLabel(p.loan_id)}</td>
                    <td className="py-3 px-4 text-muted-foreground uppercase text-xs">{p.method}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.note ?? "—"}</td>
                    <td className="py-3 pl-4 text-right tabular-nums font-bold text-primary">{peso(Number(p.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InvestmentsTab({ investments, onChanged }: { investments: Investment[]; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) return toast.error("Investor name required");
    const n = Number(amount);
    if (!n || n <= 0) return toast.error("Enter valid amount");
    setSaving(true);
    const { error } = await supabase.from("investments").insert({
      investor_name: name.trim(), amount: n, note: note || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Investment added");
    setOpen(false); setName(""); setAmount(""); setNote("");
    onChanged();
  };

  const total = investments.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-secondary">Investments</h1>
          <p className="text-sm text-muted-foreground">Total invested capital: <span className="font-bold text-primary">{peso(total)}</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white shadow-glow"><Plus className="h-4 w-4 mr-1.5" />Add Investment</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>New Investor Contribution</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-secondary">Investor Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan dela Cruz" />
              </div>
              <div>
                <label className="text-xs font-semibold text-secondary">Amount (₱)</label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-semibold text-secondary">Note (optional)</label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
              </div>
              <Button onClick={submit} disabled={saving} className="w-full bg-gradient-primary">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Investment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
        {investments.length === 0 ? (
          <EmptyState label="No investments recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-3 pr-4">Date</th><th className="py-3 px-4">Investor</th>
                  <th className="py-3 px-4">Note</th><th className="py-3 pl-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {investments.map(i => (
                  <tr key={i.id}>
                    <td className="py-3 pr-4 text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-semibold text-secondary">{i.investor_name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{i.note ?? "—"}</td>
                    <td className="py-3 pl-4 text-right tabular-nums font-bold text-primary">{peso(Number(i.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function EarningsTab({ totalInterest, investorShare, adminShare, totalInvested, totalCollected, lentOut, availableCapital, loans }: {
  totalInterest: number; investorShare: number; adminShare: number;
  totalInvested: number; totalCollected: number; lentOut: number; availableCapital: number; loans: Loan[];
}) {
  const activeLoans = loans.filter(l => l.status === "active" || l.status === "approved");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary">Earnings Breakdown</h1>
        <p className="text-sm text-muted-foreground">Interest is split 50/50 — 2% investor · 2% admin (of 4% monthly).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPI icon={TrendingUp} label="Projected Interest (all loans)" value={peso(totalInterest)} tone="primary" />
        <KPI icon={PiggyBank} label="Investor Share (50%)" value={peso(investorShare)} tone="gold" />
        <KPI icon={Wallet} label="Admin Share (50%)" value={peso(adminShare)} tone="navy" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={PiggyBank} label="Total Invested" value={peso(totalInvested)} tone="gold" />
        <KPI icon={ArrowDownCircle} label="Collections" value={peso(totalCollected)} tone="primary" />
        <KPI icon={ArrowUpCircle} label="Lent Out" value={peso(lentOut)} tone="navy" />
        <KPI icon={Wallet} label="Available Capital" value={peso(availableCapital)} tone="primary" />
      </div>

      <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
        <h3 className="font-black text-secondary mb-4">Per-loan interest split</h3>
        {activeLoans.length === 0 ? (
          <EmptyState label="No active loans." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-3 pr-4">Borrower</th><th className="py-3 px-4">Principal</th>
                  <th className="py-3 px-4">Term</th><th className="py-3 px-4">Interest</th>
                  <th className="py-3 px-4">Investor 2%</th><th className="py-3 pl-4 text-right">Admin 2%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeLoans.map(l => {
                  const interest = Number(l.amount) * (Number(l.interest_rate) / 100) * Number(l.term_months);
                  return (
                    <tr key={l.id}>
                      <td className="py-3 pr-4 font-semibold text-secondary">{l.borrower_name ?? l.user_id.slice(0, 8)}</td>
                      <td className="py-3 px-4 tabular-nums">{peso(Number(l.amount))}</td>
                      <td className="py-3 px-4 text-muted-foreground">{l.term_months} mo</td>
                      <td className="py-3 px-4 tabular-nums font-semibold text-primary">{peso(interest)}</td>
                      <td className="py-3 px-4 tabular-nums text-accent-foreground">{peso(interest / 2)}</td>
                      <td className="py-3 pl-4 text-right tabular-nums text-secondary font-bold">{peso(interest / 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="py-12 text-center text-sm text-muted-foreground">{label}</div>;
}
