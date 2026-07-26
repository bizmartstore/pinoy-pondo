import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Slider } from "@/components/ui/slider";
import { Calculator as CalcIcon, ArrowRight, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Loan Calculator — PINOY PONDO" },
      { name: "description", content: "Estimate your monthly payment, interest, and total repayment with the PINOY PONDO loan calculator." },
      { property: "og:title", content: "Loan Calculator — PINOY PONDO" },
      { property: "og:description", content: "Live loan estimates. Transparent rates. No hidden fees." },
    ],
  }),
  component: CalcPage,
});

const peso = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CalcPage() {
  const [amount, setAmount] = useState(20000);
  const [term, setTerm] = useState(6);
  const [rate, setRate] = useState(4);

  const { principal, interest, monthly, total } = useMemo(() => {
    const principal = amount;
    const interest = principal * (rate / 100) * term;
    const total = principal + interest;
    const monthly = total / term;
    return { principal, interest, monthly, total };
  }, [amount, term, rate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="bg-gradient-hero text-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-medium border border-white/20">
            <CalcIcon className="h-3.5 w-3.5 text-accent" /> Loan Calculator
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-black">Plan Your Loan</h1>
          <p className="mt-3 text-white/80">Borrow smart, pay easy. Adjust the sliders and see your plan instantly.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl w-full px-4 -mt-10 pb-20">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Inputs */}
          <div className="lg:col-span-3 rounded-3xl bg-card shadow-elevated p-6 md:p-8 border border-border/60">
            <SliderRow
              label="Loan Amount"
              value={amount}
              display={peso(amount)}
              min={2000}
              max={200000}
              step={1000}
              onChange={setAmount}
              hint={`Min ${peso(2000)} · Max ${peso(200000)}`}
            />

            <div className="mt-8">
              <SliderRow
                label="Loan Term"
                value={term}
                display={`${term} month${term > 1 ? "s" : ""}`}
                min={1}
                max={24}
                step={1}
                onChange={setTerm}
                hint="1 to 24 months"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {[3, 6, 9, 12, 18, 24].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition ${
                      term === t
                        ? "bg-primary text-primary-foreground border-primary shadow-glow"
                        : "bg-muted text-muted-foreground border-border hover:border-primary"
                    }`}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <SliderRow
                label="Monthly Interest"
                value={rate}
                display={`${rate.toFixed(1)}%`}
                min={2}
                max={8}
                step={0.5}
                onChange={setRate}
                hint="Default fixed monthly rate is 4%"
              />
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-primary/5 border border-primary/20 p-4">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-secondary/80 leading-relaxed">
                Estimates use a simple flat interest formula: <strong>Interest = Principal × Rate × Term</strong>.
                Actual approved terms may vary based on credit assessment.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl bg-gradient-hero text-white p-6 md:p-8 shadow-elevated overflow-hidden relative">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-accent/30 blur-2xl" />
              <div className="relative">
                <div className="text-xs uppercase tracking-widest text-white/60 font-bold">Monthly Payment</div>
                <div className="mt-2 text-4xl md:text-5xl font-black text-accent">{peso(monthly)}</div>
                <div className="mt-1 text-xs text-white/60">for {term} month{term > 1 ? "s" : ""}</div>

                <div className="mt-6 space-y-3 text-sm">
                  <SummaryRow label="Principal" value={peso(principal)} />
                  <SummaryRow label={`Interest (${rate}%/mo × ${term})`} value={peso(interest)} />
                  <div className="h-px bg-white/15 my-2" />
                  <SummaryRow label="Total Repayment" value={peso(total)} bold />
                </div>

                <Link
                  to="/register"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white text-secondary font-bold px-5 py-3 hover:bg-accent transition"
                >
                  Apply for this loan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SliderRow({
  label, value, display, min, max, step, onChange, hint,
}: {
  label: string; value: number; display: string;
  min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-secondary">{label}</label>
        <span className="text-lg font-black text-primary tabular-nums">{display}</span>
      </div>
      <div className="mt-3">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(v) => onChange(v[0])}
        />
      </div>
      {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-white/70 ${bold ? "font-semibold text-white" : ""}`}>{label}</span>
      <span className={`tabular-nums ${bold ? "text-lg font-black text-accent" : "font-semibold"}`}>{value}</span>
    </div>
  );
}
