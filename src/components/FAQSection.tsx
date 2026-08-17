import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertCircle,
  ArrowRight,
  BadgePercent,
  Clock3,
  CreditCard,
  FileText,
  Mail,
  MessageCircle,
  MessagesSquare,
  PiggyBank,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const faqs = [
  {
    icon: Clock3,
    question: "How fast can I get approved?",
    answer:
      "Most applications are approved in as little as 10 minutes. Once you complete your application and upload your documents, our automated screening system reviews everything in real time — no long queues, no waiting days for a decision.",
  },
  {
    icon: BadgePercent,
    question: "How much interest will I pay?",
    answer:
      "We charge a flat, fixed rate of 4% per month — no compounding, no hidden fees. You'll see the full breakdown of principal, interest, and total repayment before you sign anything, so there are never any surprises.",
  },
  {
    icon: FileText,
    question: "What are the requirements to apply?",
    answer:
      "You need to be a Filipino citizen aged 21 or older with a valid government-issued ID, proof of income, and an active mobile number. No collateral, no co-borrower, and no paperwork runs — everything is done online.",
  },
  {
    icon: Smartphone,
    question: "How do I apply for a loan?",
    answer:
      "Create a free account, choose your loan amount, and complete the online application in just a few minutes. Apply, get approved, and receive your money — all from your phone, without ever visiting a branch.",
  },
  {
    icon: CreditCard,
    question: "How do I pay back my loan?",
    answer:
      "You can repay anytime via GCash, Maya, bank transfer, or over-the-counter channels. Your dashboard shows every due date and amount, and you'll get friendly reminders so you never miss a payment.",
  },
  {
    icon: ShieldCheck,
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We protect your data with bank-grade encryption and never share your information with third parties without your consent. Your privacy is a promise, not a footnote.",
  },
  {
    icon: PiggyBank,
    question: "Can I pay off my loan early?",
    answer:
      "Yes, anytime — and we encourage it! You only pay interest for the days you actually used the loan, with zero early-settlement penalties. Paying early means paying less.",
  },
  {
    icon: AlertCircle,
    question: "What happens if I miss a payment?",
    answer:
      "We'll remind you before your due date so you can stay on track. If you do miss a payment, reach out to us right away and we'll work with you on a repayment plan — responsible lending means we'd rather help you recover than penalize you.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 md:py-28">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
          <MessagesSquare className="h-3.5 w-3.5" />
          Support Center
        </div>
        <h2 className="mt-4 text-3xl font-black text-secondary md:text-4xl">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          Everything you need to know about applying, paying, and staying on top of your loan.
        </p>
      </div>

      <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="space-y-4 lg:col-span-2"
        >
          {faqs.map((f, i) => {
            const Icon = f.icon;
            return (
              <AccordionItem
                key={f.question}
                value={`faq-${i}`}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition-all duration-300 data-[state=open]:border-primary/30 data-[state=open]:shadow-elevated"
              >
                <AccordionTrigger className="gap-4 px-4 py-5 text-left hover:no-underline hover:bg-muted/40 sm:px-6">
                  <span className="flex flex-1 items-center gap-3.5 sm:gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow sm:h-10 sm:w-10">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                    </span>
                    <span className="text-base font-bold text-secondary">{f.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5 sm:px-6">
                  <p className="pl-0 text-sm leading-relaxed text-muted-foreground sm:pl-[3.5rem] sm:text-base">
                    {f.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Support rail */}
        <div className="lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-3xl bg-secondary p-6 text-white shadow-elevated md:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />

            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold">
                <MessagesSquare className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mt-5 text-xl font-bold">Still have questions?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Our support team is always ready to help — mabilis at maaasahan, just like our
                loans.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href="mailto:support@pinoypondo.ph"
                  className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur transition hover:bg-white/15"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent">
                    <Mail className="h-5 w-5 text-secondary" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">support@pinoypondo.ph</span>
                    <span className="block text-xs text-white/60">We reply within 24 hours</span>
                  </span>
                </a>
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-gold">
                    <MessageCircle className="h-5 w-5 text-secondary" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">Live Chat</span>
                    <span className="block text-xs text-white/60">
                      Mon–Sat, 8AM – 8PM · avg. reply under 5 min
                    </span>
                  </span>
                </div>
              </div>

              <Link
                to="/register"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-bold text-white shadow-glow transition hover:opacity-95"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
