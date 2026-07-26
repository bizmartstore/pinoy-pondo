import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, ArrowLeft, User, Briefcase, IdCard, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — PINOY PONDO" },
      { name: "description", content: "Simple. Fast. Secure. Create your PINOY PONDO account in 4 easy steps." },
      { property: "og:title", content: "Create Account — PINOY PONDO" },
      { property: "og:description", content: "Join 250,000+ Filipinos who trust PINOY PONDO." },
    ],
  }),
  component: RegisterPage,
});

const steps = [
  { title: "Personal Information", icon: User },
  { title: "Employment Information", icon: Briefcase },
  { title: "Identity Verification", icon: IdCard },
  { title: "Review & Submit", icon: ClipboardCheck },
];

function RegisterPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      toast.success("Application submitted! We'll be in touch shortly.");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="bg-gradient-hero text-white py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black">Create Your Account</h1>
          <p className="mt-2 text-white/80">Simple. Fast. Secure.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl w-full px-4 -mt-10 pb-20">
        {/* Progress */}
        <div className="rounded-3xl bg-card shadow-elevated p-4 md:p-6 border border-border/60">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const active = i === step;
              const done = i < step;
              return (
                <div key={s.title} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={`h-10 w-10 rounded-full grid place-items-center font-bold text-sm transition-all ${
                        done
                          ? "bg-primary text-white"
                          : active
                          ? "bg-gradient-primary text-white shadow-glow scale-110"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`hidden sm:block text-[10px] font-semibold text-center leading-tight ${active ? "text-secondary" : "text-muted-foreground"}`}>
                      Step {i + 1}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 rounded ${i < step ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div key={step} className="mt-6 rounded-3xl bg-card shadow-card p-6 md:p-8 border border-border/60 animate-fade-in-up">
          <h2 className="text-xl md:text-2xl font-black text-secondary">{steps[step].title}</h2>

          {step === 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormField label="First Name" placeholder="Juan" />
              <FormField label="Last Name" placeholder="Dela Cruz" />
              <FormField label="Date of Birth" type="date" />
              <FormField label="Mobile Number" placeholder="+63 917 000 0000" type="tel" />
              <FormField label="Email Address" placeholder="juan@email.com" type="email" className="sm:col-span-2" />
              <FormField label="Home Address" placeholder="123 Rizal St, Quezon City" className="sm:col-span-2" />
            </div>
          )}
          {step === 1 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormField label="Employer / Business" placeholder="ABC Corporation" className="sm:col-span-2" />
              <FormField label="Job Title" placeholder="Sales Associate" />
              <FormField label="Employment Type" placeholder="Regular / Contractual" />
              <FormField label="Monthly Income (₱)" placeholder="25,000" type="number" />
              <FormField label="Years Employed" placeholder="2" type="number" />
              <FormField label="Office Address" placeholder="Makati City" className="sm:col-span-2" />
            </div>
          )}
          {step === 2 && (
            <div className="mt-6 grid gap-4">
              <FormField label="Valid ID Type" placeholder="e.g. UMID, Driver's License, Passport" />
              <FormField label="ID Number" placeholder="0000-0000-0000" />
              <div>
                <Label className="text-xs font-semibold text-secondary uppercase tracking-wider">Upload ID Photo</Label>
                <div className="mt-1.5 h-40 rounded-2xl border-2 border-dashed border-border grid place-items-center text-sm text-muted-foreground hover:border-primary transition">
                  Drop your ID photo here, or click to upload
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold text-secondary uppercase tracking-wider">Selfie with ID</Label>
                <div className="mt-1.5 h-40 rounded-2xl border-2 border-dashed border-border grid place-items-center text-sm text-muted-foreground hover:border-primary transition">
                  Take a selfie holding your ID
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Almost done</div>
                <p className="mt-1 text-sm text-secondary">Please review your information carefully before submitting.</p>
              </div>
              <ReviewRow label="Full Name" value="Juan Dela Cruz" />
              <ReviewRow label="Mobile" value="+63 917 000 0000" />
              <ReviewRow label="Employer" value="ABC Corporation" />
              <ReviewRow label="Monthly Income" value="₱25,000.00" />
              <ReviewRow label="ID Type" value="UMID" />
              <label className="flex items-start gap-3 pt-4 text-sm text-muted-foreground">
                <input type="checkbox" className="mt-1 accent-primary" />
                <span>
                  I agree to PINOY PONDO's <a className="text-primary font-semibold" href="#">Terms & Conditions</a> and{" "}
                  <a className="text-primary font-semibold" href="#">Privacy Policy</a>, and confirm all information is accurate.
                </span>
              </label>
            </div>
          )}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-xl px-5 h-11 font-semibold text-secondary bg-muted hover:bg-muted/70 disabled:opacity-40 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl px-6 h-11 font-semibold text-white bg-gradient-primary shadow-glow hover:opacity-95 transition"
            >
              {step === steps.length - 1 ? "Submit Application" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

function FormField({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label className="text-xs font-semibold text-secondary uppercase tracking-wider">{label}</Label>
      <Input {...props} className="mt-1.5 h-12 rounded-xl" />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/60">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-secondary">{value}</span>
    </div>
  );
}
