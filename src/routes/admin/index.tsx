import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin, isAdminAuthenticated } from "@/lib/admin-store";
import logoImg from "@/assets/mhp-logo.png";

export const Route = createFileRoute("/admin/")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Small delay for UX feel
    setTimeout(() => {
      const success = loginAdmin(username, password);
      if (success) {
        toast.success("Welcome back, admin!");
        navigate({ to: "/admin/dashboard" });
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-deep px-4">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-green/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-green/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
            <img
              src={logoImg}
              alt="My Healthy Platter"
              className="h-12 w-auto brightness-0 invert sm:h-14"
            />
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              Admin Portal
            </h1>
            <p className="mt-3 text-sm text-white/50">
              Sign in to manage orders and track deliveries
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="admin-username"
                className="text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/30" />
                <Input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
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
                  autoComplete="current-password"
                  className="h-12 border-white/10 bg-white/5 pl-11 pr-11 text-white placeholder:text-white/25 focus:border-brand-green/50 focus:ring-brand-green/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
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
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          This area is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}
