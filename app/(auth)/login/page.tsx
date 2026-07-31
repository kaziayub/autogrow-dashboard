import { login, signup } from "./actions";
import { Rocket, ShieldCheck, AlertCircle } from "lucide-react";
import { Button, Input } from "@/components/ui";

const ERRORS: Record<string, string> = {
  invalid: "Invalid email or password.",
  exists: "An account with this email already exists.",
  weak: "Password should be at least 6 characters.",
  failed: "Authentication failed. Check your credentials.",
  created: "Account created — please sign in.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; msg?: string }>;
}) {
  const sp = await searchParams;
  const error = sp.error ? ERRORS[sp.error] ?? sp.error : null;
  const notice = sp.msg ? ERRORS[sp.msg] ?? sp.msg : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mb-4">
            <Rocket className="h-7 w-7 text-bg" />
          </div>
          <h1 className="text-2xl font-semibold text-gradient">AutoGrow OS</h1>
          <p className="text-sm text-text-muted mt-1">Mission Control Center</p>
        </div>

        <div className="glass-strong p-7 fade-up">
          <div className="flex items-center gap-2 text-text-muted text-xs mb-5">
            <ShieldCheck className="h-4 w-4 text-ok" />
            Restricted access — owner only
          </div>

          {error && (
            <div className="flex items-center gap-2 text-danger text-xs mb-4 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {notice && (
            <div className="flex items-center gap-2 text-ok text-xs mb-4 px-3 py-2 rounded-lg bg-ok/10 border border-ok/20">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {notice}
            </div>
          )}

          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-text-muted mb-1.5 uppercase tracking-wide"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@zynovari.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs text-text-muted mb-1.5 uppercase tracking-wide"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                formAction={login}
                variant="primary"
                className="flex-1"
              >
                Sign in
              </Button>
              <Button type="submit" formAction={signup} variant="outline">
                Create account
              </Button>
            </div>
          </form>
        </div>
        <p className="text-center text-xs text-text-muted mt-5">
          First time? Use Create account once, then sign in.
        </p>
      </div>
    </div>
  );
}
