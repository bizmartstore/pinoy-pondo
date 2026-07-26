import { supabase } from "@/integrations/supabase/client";

export type Loan = {
  id: string;
  user_id: string;
  amount: number;
  term_months: number;
  interest_rate: number;
  status: "pending" | "approved" | "active" | "paid" | "rejected" | "overdue";
  created_at: string;
  approved_at: string | null;
  borrower_name: string | null;
};

export type Payment = {
  id: string;
  loan_id: string;
  amount: number;
  method: string;
  note: string | null;
  paid_at: string;
  recorded_by: string | null;
};

export type Investment = {
  id: string;
  investor_name: string;
  amount: number;
  note: string | null;
  created_at: string;
};

export const peso = (n: number) =>
  "₱" + (n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const pesoShort = (n: number) =>
  "₱" + (n || 0).toLocaleString("en-PH", { maximumFractionDigits: 0 });

// Interest split: total monthly rate (e.g. 4%) → 2% investor share + 2% admin share
export function computeEarnings(loans: Loan[]) {
  let totalInterest = 0;
  let lentOut = 0;
  for (const l of loans) {
    if (l.status === "rejected" || l.status === "pending") continue;
    lentOut += Number(l.amount);
    totalInterest += Number(l.amount) * (Number(l.interest_rate) / 100) * Number(l.term_months);
  }
  const investorShare = totalInterest / 2;
  const adminShare = totalInterest / 2;
  return { totalInterest, investorShare, adminShare, lentOut };
}

export async function fetchAll() {
  const [loansRes, paymentsRes, investmentsRes] = await Promise.all([
    supabase.from("loans").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("*").order("paid_at", { ascending: false }),
    supabase.from("investments").select("*").order("created_at", { ascending: false }),
  ]);
  return {
    loans: (loansRes.data ?? []) as Loan[],
    payments: (paymentsRes.data ?? []) as Payment[],
    investments: (investmentsRes.data ?? []) as Investment[],
    errors: [loansRes.error, paymentsRes.error, investmentsRes.error].filter(Boolean),
  };
}
