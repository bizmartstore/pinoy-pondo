import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { PiggyBank, TrendingUp, Wallet, ArrowUpCircle, LogOut, Loader2 } from "lucide-react";
import { peso, computeEarnings, fetchAll, type Loan, type Investment } from "@/lib/finance";
import { toast } from "sonner";

export const Route = createFileRoute("/investor")({
  head: () => ({
    meta: [
      { title: "Investor Portal — PINOY PONDO" },
      { name: "description", content: "Investor earnings and capital overview." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Investor,
});

function Investor() {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    (async () => {
      const { loans, investments, errors } = await fetchAll();
      if (errors.length) toast.error(errors[0]!.message);
      setLoans(loans); setInvestments(investments); setLoading(false);
    })();
  }, []);

  const totalInvested = investments.reduce((s, i) => s + Number(i.amount), 0);
  const { investorShare, lentOut, totalInterest } = computeEarnings(loans);
  const activeLoans = loans.filter(l => l.status === "active" || l.status === "approved");

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30">
        <Logo size="md" />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-foreground bg-accent/20 px-3 py-1 rounded-full">Investor</span>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-secondary">
            <LogOut className="h-4 w-4" /> Exit
          </Link>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        {loading ? (
          <div className="grid place-items-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">Investor Portal</div>
              <h1 className="mt-1 text-2xl md:text-3xl font-black text-secondary">Your Earnings</h1>
              <p className="text-sm text-muted-foreground">You earn 2% of every loan's interest — half of the 4% monthly rate.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card icon={PiggyBank} label="Total Invested" value={peso(totalInvested)} />
              <Card icon={ArrowUpCircle} label="Currently Lent Out" value={peso(lentOut)} />
              <Card icon={TrendingUp} label="Projected Interest" value={peso(totalInterest)} />
              <Card icon={Wallet} label="Your Share (2%)" value={peso(investorShare)} highlight />
            </div>

            <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
              <h3 className="font-black text-secondary">Investments Ledger</h3>
              {investments.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">No investments recorded yet.</div>
              ) : (
                <div className="mt-4 overflow-x-auto">
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

            <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
              <h3 className="font-black text-secondary">Active Loans (Your Earnings)</h3>
              {activeLoans.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">No active loans yet.</div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="py-3 pr-4">Borrower</th><th className="py-3 px-4">Principal</th>
                        <th className="py-3 px-4">Term</th><th className="py-3 pl-4 text-right">Your 2% Share</th>
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
                            <td className="py-3 pl-4 text-right tabular-nums font-bold text-primary">{peso(interest / 2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Card({ icon: Icon, label, value, highlight }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-3xl border p-5 shadow-card ${highlight ? "bg-gradient-primary text-white border-primary" : "bg-card border-border/60"}`}>
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${highlight ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className={`mt-4 text-2xl font-black tabular-nums ${highlight ? "text-white" : "text-secondary"}`}>{value}</div>
      <div className={`text-xs font-medium mt-1 ${highlight ? "text-white/80" : "text-muted-foreground"}`}>{label}</div>
    </div>
  );
}
