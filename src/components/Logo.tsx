import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  enableAdminAccess?: boolean;
  showText?: boolean;
}

const sizes = {
  sm: { box: "h-8 w-8", text: "text-base", icon: "text-sm" },
  md: { box: "h-10 w-10", text: "text-lg", icon: "text-base" },
  lg: { box: "h-14 w-14", text: "text-2xl", icon: "text-xl" },
  xl: { box: "h-20 w-20", text: "text-3xl", icon: "text-2xl" },
};

export function Logo({
  size = "md",
  variant = "dark",
  enableAdminAccess = false,
  showText = true,
}: LogoProps) {
  const [open, setOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const navigate = useNavigate();
  const s = sizes[size];

  const start = () => {
    if (!enableAdminAccess) return;
    startRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - startRef.current) / 5000) * 100);
      setProgress(p);
      if (p >= 100) {
        clear();
        setOpen(true);
      }
    }, 50);
  };
  const clear = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setProgress(0);
  };
  useEffect(() => () => clear(), []);

  const submit = () => {
    if (passcode === "ADMIN_08") {
      setOpen(false); setPasscode("");
      toast.success("Admin access granted");
      navigate({ to: "/admin" });
    } else if (passcode === "PITF_08") {
      setOpen(false); setPasscode("");
      toast.success("Investor access granted");
      navigate({ to: "/investor" });
    } else {
      toast.error("Incorrect passcode");
      setPasscode("");
    }
  };

  return (
    <>
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 select-none relative"
        onMouseDown={start}
        onMouseUp={clear}
        onMouseLeave={clear}
        onTouchStart={start}
        onTouchEnd={clear}
        onTouchCancel={clear}
        onContextMenu={(e) => enableAdminAccess && e.preventDefault()}
      >
        <div className={`${s.box} rounded-2xl bg-gradient-primary grid place-items-center shadow-glow relative overflow-hidden`}>
          <span className={`${s.icon} font-black text-white`}>₱</span>
          {progress > 0 && (
            <div
              className="absolute inset-0 bg-accent/40"
              style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
            />
          )}
        </div>
        {showText && (
          <div className="leading-none">
            <div className={`${s.text} font-black tracking-tight ${variant === "light" ? "text-white" : "text-secondary"}`}>
              PINOY <span className="text-primary">PONDO</span>
            </div>
          </div>
        )}
      </Link>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter Administrator Passcode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              type="password"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              autoFocus
            />
            <Button onClick={submit} className="w-full bg-gradient-primary">
              Unlock Admin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
