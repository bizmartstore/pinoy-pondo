import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, ArrowLeft, User, Briefcase, IdCard, ClipboardCheck, Lock, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — PINOY PONDO" },
      { name: "description", content: "Simple. Fast. Secure. Create your PINOY PONDO account in 4 easy steps." },
      { property: "og:title", content: "Create Account — PINOY PONDO" },
      { property: "og:description", content: "Join thousands of Filipinos who trust PINOY PONDO." },
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

type FormData = {
  first_name: string;
  last_name: string;
  dob: string;
  mobile: string;
  email: string;
  password: string;
  address: string;
  employer: string;
  job_title: string;
  employment_type: string;
  monthly_income: string;
  years_employed: string;
  office_address: string;
  id_type: string;
  id_number: string;
  agree: boolean;
};

const REQUIRED_STEP0: (keyof FormData)[] = ["first_name", "last_name", "dob", "mobile", "email", "password", "address"];
const REQUIRED_STEP1: (keyof FormData)[] = ["employer", "job_title", "employment_type", "monthly_income", "years_employed", "office_address"];
const REQUIRED_STEP2: (keyof FormData)[] = ["id_type", "id_number"];

function RegisterPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [f, setF] = useState<FormData>({
    first_name: "", last_name: "", dob: "", mobile: "", email: "", password: "",
    address: "", employer: "", job_title: "", employment_type: "",
    monthly_income: "", years_employed: "", office_address: "",
    id_type: "", id_number: "", agree: false,
  });
  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setF((p) => ({ ...p, [k]: v }));

  const missing = (keys: (keyof FormData)[]) => keys.filter((k) => !String(f[k] ?? "").trim());

  const canContinue = () => {
    if (step === 0) {
      if (missing(REQUIRED_STEP0).length) return false;
      if (f.password.length < 6) return false;
      return true;
    }
    if (step === 1) return missing(REQUIRED_STEP1).length === 0;
    if (step === 2) return missing(REQUIRED_STEP2).length === 0 && !!idFile && !!selfieFile;
    if (step === 3) return f.agree;
    return true;
  };

  const next = async () => {
    if (!canContinue()) {
      if (step === 0 && f.password && f.password.length < 6) {
        toast.error("Password must be at least 6 characters");
      } else if (step === 2 && (!idFile || !selfieFile)) {
        toast.error("Please upload both your ID photo and selfie with ID");
      } else {
        toast.error("Please fill in all required fields");
      }
      return;
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    // Submit
    setLoading(true);
    try {
      const { data: signup, error: signErr } = await supabase.auth.signUp({
        email: f.email,
        password: f.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: f.first_name,
            last_name: f.last_name,
            full_name: `${f.first_name} ${f.last_name}`.trim(),
          },
        },
      });
      if (signErr) throw signErr;
      const uid = signup.user?.id;
      if (!uid) throw new Error("Signup failed — no user id returned");

      // Upload ID photo + selfie
      const uploadOne = async (file: File, kind: "id" | "selfie") => {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${uid}/${kind}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("ids").upload(path, file, { upsert: true, contentType: file.type });
        if (upErr) throw upErr;
        return supabase.storage.from("ids").getPublicUrl(path).data.publicUrl;
      };
      const id_photo_url = await uploadOne(idFile!, "id");
      const selfie_url = await uploadOne(selfieFile!, "selfie");

      // Create profile (pending approval)
      const { error: profErr } = await supabase.from("profiles").upsert({
        id: uid,
        first_name: f.first_name,
        last_name: f.last_name,
        full_name: `${f.first_name} ${f.last_name}`.trim(),
        dob: f.dob || null,
        mobile: f.mobile,
        email: f.email,
        address: f.address,
        employer: f.employer,
        job_title: f.job_title,
        employment_type: f.employment_type,
        monthly_income: f.monthly_income ? Number(f.monthly_income) : null,
        years_employed: f.years_employed ? Number(f.years_employed) : null,
        office_address: f.office_address,
        id_type: f.id_type,
        id_number: f.id_number,
        id_photo_url,
        selfie_url,
        approval_status: "pending",
      });
      if (profErr) throw profErr;

      // Sign out so they wait for approval before login
      await supabase.auth.signOut();

      toast.success("Application submitted! We'll notify you once approved.");
      navigate({ to: "/login" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
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
                        done ? "bg-primary text-white"
                        : active ? "bg-gradient-primary text-white shadow-glow scale-110"
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

        <div key={step} className="mt-6 rounded-3xl bg-card shadow-card p-6 md:p-8 border border-border/60 animate-fade-in-up">
          <h2 className="text-xl md:text-2xl font-black text-secondary">{steps[step].title}</h2>
          <p className="text-xs text-muted-foreground mt-1">All fields are required.</p>

          {step === 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormField required label="First Name" placeholder="Juan" value={f.first_name} onChange={(e) => set("first_name", e.target.value)} />
              <FormField required label="Last Name" placeholder="Dela Cruz" value={f.last_name} onChange={(e) => set("last_name", e.target.value)} />
              <FormField required label="Date of Birth" type="date" value={f.dob} onChange={(e) => set("dob", e.target.value)} />
              <FormField required label="Mobile Number" placeholder="+63 917 000 0000" type="tel" value={f.mobile} onChange={(e) => set("mobile", e.target.value)} />
              <FormField required label="Email Address" placeholder="juan@email.com" type="email" className="sm:col-span-2" value={f.email} onChange={(e) => set("email", e.target.value)} />
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1"><Lock className="h-3 w-3" /> Password <span className="text-destructive">*</span></Label>
                <Input required type="password" placeholder="At least 6 characters" value={f.password} onChange={(e) => set("password", e.target.value)} className="mt-1.5 h-12 rounded-xl" autoComplete="new-password" />
              </div>
              <FormField required label="Home Address" placeholder="123 Rizal St, Quezon City" className="sm:col-span-2" value={f.address} onChange={(e) => set("address", e.target.value)} />
            </div>
          )}
          {step === 1 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormField required label="Employer / Business" placeholder="ABC Corporation" className="sm:col-span-2" value={f.employer} onChange={(e) => set("employer", e.target.value)} />
              <FormField required label="Job Title" placeholder="Sales Associate" value={f.job_title} onChange={(e) => set("job_title", e.target.value)} />
              <FormField required label="Employment Type" placeholder="Regular / Contractual" value={f.employment_type} onChange={(e) => set("employment_type", e.target.value)} />
              <FormField required label="Monthly Income (₱)" placeholder="25000" type="number" value={f.monthly_income} onChange={(e) => set("monthly_income", e.target.value)} />
              <FormField required label="Years Employed" placeholder="2" type="number" value={f.years_employed} onChange={(e) => set("years_employed", e.target.value)} />
              <FormField required label="Office Address" placeholder="Makati City" className="sm:col-span-2" value={f.office_address} onChange={(e) => set("office_address", e.target.value)} />
            </div>
          )}
          {step === 2 && (
            <div className="mt-6 grid gap-4">
              <FormField required label="Valid ID Type" placeholder="e.g. UMID, Driver's License, Passport" value={f.id_type} onChange={(e) => set("id_type", e.target.value)} />
              <FormField required label="ID Number" placeholder="0000-0000-0000" value={f.id_number} onChange={(e) => set("id_number", e.target.value)} />
              <FilePicker
                label="Upload ID Photo"
                file={idFile}
                onChange={setIdFile}
                hint="Clear photo of the front of your valid ID"
              />
              <FilePicker
                label="Selfie with ID"
                file={selfieFile}
                onChange={setSelfieFile}
                hint="Take a selfie holding your ID next to your face"
              />
            </div>
          )}
          {step === 3 && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Almost done</div>
                <p className="mt-1 text-sm text-secondary">
                  Please review your information. After submission, your account will be pending admin approval before you can sign in.
                </p>
              </div>
              <ReviewRow label="Full Name" value={`${f.first_name} ${f.last_name}`.trim()} />
              <ReviewRow label="Email" value={f.email} />
              <ReviewRow label="Mobile" value={f.mobile} />
              <ReviewRow label="Date of Birth" value={f.dob} />
              <ReviewRow label="Address" value={f.address} />
              <ReviewRow label="Employer" value={f.employer} />
              <ReviewRow label="Job Title" value={f.job_title} />
              <ReviewRow label="Monthly Income" value={f.monthly_income ? `₱${Number(f.monthly_income).toLocaleString()}` : "—"} />
              <ReviewRow label="ID Type" value={f.id_type} />
              <ReviewRow label="ID Number" value={f.id_number} />
              <ReviewRow label="ID Photo" value={idFile?.name ?? "—"} />
              <ReviewRow label="Selfie" value={selfieFile?.name ?? "—"} />
              <label className="flex items-start gap-3 pt-4 text-sm text-muted-foreground">
                <input type="checkbox" className="mt-1 accent-primary" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} />
                <span>
                  I agree to PINOY PONDO's <a className="text-primary font-semibold" href="#">Terms & Conditions</a> and{" "}
                  <a className="text-primary font-semibold" href="#">Privacy Policy</a>, and confirm all information is accurate.
                </span>
              </label>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0 || loading}
              className="inline-flex items-center gap-2 rounded-xl px-5 h-11 font-semibold text-secondary bg-muted hover:bg-muted/70 disabled:opacity-40 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={next}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl px-6 h-11 font-semibold text-white bg-gradient-primary shadow-glow hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>) : step === steps.length - 1 ? "Submit Application" : "Continue"}
              {!loading && <ArrowRight className="h-4 w-4" />}
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

function FormField({ label, className = "", required, ...props }: { label: string; className?: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label className="text-xs font-semibold text-secondary uppercase tracking-wider">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input {...props} required={required} className="mt-1.5 h-12 rounded-xl" />
    </div>
  );
}

function FilePicker({ label, file, onChange, hint }: { label: string; file: File | null; onChange: (f: File | null) => void; hint?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const pick = (fl: File | null) => {
    onChange(fl);
    if (fl && fl.type.startsWith("image/")) {
      const url = URL.createObjectURL(fl);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };
  return (
    <div>
      <Label className="text-xs font-semibold text-secondary uppercase tracking-wider">{label} <span className="text-destructive">*</span></Label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`mt-1.5 w-full rounded-2xl border-2 border-dashed p-4 grid place-items-center text-sm transition ${
          file ? "border-primary bg-primary/5" : "border-border hover:border-primary text-muted-foreground"
        }`}
      >
        {preview ? (
          <img src={preview} alt={label} className="max-h-40 rounded-lg object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 py-6">
            <Upload className="h-6 w-6 text-primary" />
            <span className="font-semibold text-secondary">{file ? file.name : "Tap to upload or take a photo"}</span>
            {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/60">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-secondary text-right break-all">{value || "—"}</span>
    </div>
  );
}
