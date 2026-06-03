"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bike, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("renter");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
          account_type: accountType,
          agency_name: accountType === "agency" ? agencyName : undefined,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Supabase sends a confirmation email by default.
    // If email confirmations are disabled in your project, redirect immediately.
    router.push("/dashboard");
    router.refresh();
  };

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
          <h1 className="text-3xl font-black">Create an account</h1>
          <p className="text-muted-foreground mt-2">Join thousands of riders across the Philippines</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="rounded-2xl border border-border bg-surface p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Account type */}
          <div className="space-y-2">
            <Label>I am a</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "renter", label: "Rider / Renter" },
                { value: "agency", label: "Fleet Owner / Agency" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setAccountType(type.value)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors text-left ${
                    accountType === type.value
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-surface-3 text-muted-foreground hover:border-brand/40"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Dela Cruz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {accountType === "agency" && (
            <div className="space-y-2">
              <Label htmlFor="agency-name">Agency / Business name</Label>
              <Input
                id="agency-name"
                placeholder="e.g. My Rentals Manila"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full font-bold text-base h-11" disabled={loading}>
            {loading
              ? "Creating account…"
              : accountType === "agency"
              ? "Create Agency Account"
              : "Create Account"}
          </Button>

          <Separator />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand font-medium hover:underline">Sign in</Link>
          </p>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="#" className="underline hover:text-foreground">Terms</Link>
          {" "}and{" "}
          <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
