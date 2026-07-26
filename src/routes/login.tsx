import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — PINOY PONDO" },
      { name: "description", content: "Sign in to your PINOY PONDO account to manage loans, payments, and profile." },
      { property: "og:title", content: "Sign In — PINOY PONDO" },
      { property: "og:description", content: "Welcome back to your trusted lending partner." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/dashboard";
    navigate({ to: redirect });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="flex-1 grid md:grid-cols-2">
        <div className="hidden md:flex relative overflow-hidden bg-gradient-hero text-white p-12 items-center">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-10 -left-10 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          </div>
          <div className="relative max-w-md">
            <h2 className="text-4xl font-black leading-tight">
              Kaagapay sa iyong <span className="text-accent">pangangailangan.</span>
            </h2>
            <p className="mt-4 text-white/80">
              Sign in to view your active loans, upcoming payments, and personalized offers.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/85">
              {["Track your loan in real-time", "Pay easily, anytime", "Get instant support"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-black text-secondary">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your PINOY PONDO account.</p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <Field icon={Mail} label="Email Address">
                <Input
                  type="email"
                  placeholder="juan@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  autoComplete="email"
                />
              </Field>

              <Field icon={Lock} label="Password">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <Checkbox /> Remember me
                </label>
                <a href="#" className="text-primary font-semibold hover:underline">Forgot Password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white font-semibold h-12 shadow-glow hover:opacity-95 transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : (<>Sign In <ArrowRight className="h-4 w-4" /></>)}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-secondary uppercase tracking-wider">{label}</label>
      <div className="relative mt-1.5">
        <Icon className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        {children}
      </div>
    </div>
  );
}
