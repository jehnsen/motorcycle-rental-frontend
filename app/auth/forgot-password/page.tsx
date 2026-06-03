"use client";

import { useState } from "react";
import Link from "next/link";
import { Bike, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-road asphalt-texture py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <Bike className="h-5 w-5 text-brand" />
            </div>
            <span className="text-xl font-black">RentNRide<span className="text-brand">_PH</span></span>
          </Link>
          <h1 className="text-3xl font-black">Reset password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 space-y-6">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-brand/10 border border-brand/30 mx-auto">
                <CheckCircle2 className="h-7 w-7 text-brand" />
              </div>
              <div>
                <p className="font-bold text-lg">Check your email</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We sent a password reset link to{" "}
                  <span className="text-foreground font-medium">{email}</span>.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive it?{" "}
                <button
                  className="text-brand hover:underline"
                  onClick={() => setSent(false)}
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full font-bold text-base h-11" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-brand font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
