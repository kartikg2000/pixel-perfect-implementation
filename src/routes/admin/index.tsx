import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/mhp-logo.png";

export const Route = createFileRoute("/admin/")({
  component: AdminLoginPage,
  head: () => ({
    meta: [
      { title: "Admin Portal · My Healthy Platter" },
      {
        name: "description",
        content: "Sign in to manage My Healthy Platter orders and deliveries.",
      },
      { property: "og:title", content: "Admin Portal · My Healthy Platter" },
      {
        property: "og:description",
        content: "Sign in to manage My Healthy Platter orders and deliveries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) {
        void navigate({ to: "/admin/dashboard" });
      }
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        if (!data.session) {
          toast.success("Account created. Check your email to confirm it, then sign in.");
          setMode("signin");
          return;
        }
        void navigate({ to: "/admin/dashboard" });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Welcome back!");
      void navigate({ to: "/admin/dashboard" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-deep px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-green/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-green/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
            <img
              src={logoImg}
              alt="My Healthy Platter"
              className="h-12 w-auto brightness-0 invert sm:h-14"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              Admin Portal
            </h1>
            <p className="mt-3 text-sm text-white/50">
              {mode === "signin"
                ? "Sign in to manage orders and track deliveries"
                : "Create your admin account to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="admin-email"
                className="text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/30" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/25 focus:border-brand-green/50 focus:ring-brand-green/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/30" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className="h-12 border-white/10 bg-white/5 pl-11 pr-11 text-white placeholder:text-white/25 focus:border-brand-green/50 focus:ring-brand-green/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full bg-brand-green text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-green/90 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Please wait…
                </span>
              ) : mode === "signin" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-center text-xs text-white/40 transition-colors hover:text-white/70"
          >
            {mode === "signin"
              ? "First time here? Create an admin account"
              : "Already have an account? Sign in"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          This area is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}
