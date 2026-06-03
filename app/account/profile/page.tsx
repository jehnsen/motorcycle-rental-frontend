"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Upload,
  UserCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getRenterProfile,
  saveRenterProfile,
  type StoredRenterProfile,
} from "@/lib/bookingStore";

const ID_TYPES = [
  "Philippine Passport",
  "Driver's License",
  "UMID",
  "SSS ID",
  "PhilHealth ID",
  "Voter's ID",
  "Postal ID",
  "PRC ID",
];

interface FileUploadFieldProps {
  label: string;
  hint: string;
  filename: string | null;
  onSelect: (name: string) => void;
}

function FileUploadField({ label, hint, filename, onSelect }: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center gap-3 rounded-lg border border-dashed border-border bg-surface-3 px-4 py-3 text-sm text-left hover:border-brand/50 transition-colors"
      >
        <Upload className="h-4 w-4 text-brand flex-shrink-0" />
        {filename ? (
          <span className="text-foreground truncate">{filename}</span>
        ) : (
          <span className="text-muted-foreground">{hint}</span>
        )}
        {filename && <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto flex-shrink-0" />}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file.name);
        }}
      />
      <p className="text-xs text-muted-foreground">{hint} (JPG, PNG, or PDF · max 5 MB)</p>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<StoredRenterProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    license_number: "",
    license_expiry: "",
    id_type: ID_TYPES[0],
    id_number: "",
    license_filename: null as string | null,
    id_filename: null as string | null,
    selfie_filename: null as string | null,
  });

  useEffect(() => {
    const stored = getRenterProfile();
    if (stored) {
      setProfile(stored);
      setForm({
        full_name: stored.full_name,
        license_number: stored.license_number,
        license_expiry: stored.license_expiry,
        id_type: stored.id_type,
        id_number: stored.id_number,
        license_filename: stored.license_filename,
        id_filename: stored.id_filename,
        selfie_filename: stored.selfie_filename,
      });
    } else {
      setEditing(true);
    }
  }, []);

  function handleChange(field: keyof typeof form, value: string | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: StoredRenterProfile = {
      ...form,
      submitted_at: new Date().toISOString(),
      is_verified: false,
    };
    saveRenterProfile(data);
    setProfile(data);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const hasDocuments = form.license_filename && form.id_filename && form.selfie_filename;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Profile & Verification</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Submit your license and ID for rental eligibility.
          </p>
        </div>
        {profile && !editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {/* Verification status banner */}
      {profile && !editing && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 mb-6 ${
            profile.is_verified
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-yellow-500/30 bg-yellow-500/10"
          }`}
        >
          {profile.is_verified ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <Clock className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-sm font-semibold ${profile.is_verified ? "text-emerald-400" : "text-yellow-400"}`}>
              {profile.is_verified ? "Verified Renter" : "Verification Pending"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {profile.is_verified
                ? "Your documents have been verified. You can rent any available bike."
                : "Your documents are under review. Agencies may still accept your bookings."}
            </p>
          </div>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 p-3 mb-6 text-sm text-brand">
          <CheckCircle2 className="h-4 w-4" />
          Profile saved. Documents submitted for review.
        </div>
      )}

      {/* Profile form / view */}
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Personal Information
            </h2>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                required
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="As it appears on your ID"
                className="w-full rounded-lg border border-border bg-surface-3 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* License */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Driver&apos;s License
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="license_number">License Number</label>
                <input
                  id="license_number"
                  required
                  value={form.license_number}
                  onChange={(e) => handleChange("license_number", e.target.value)}
                  placeholder="e.g. N01-23-456789"
                  className="w-full rounded-lg border border-border bg-surface-3 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="license_expiry">Expiry Date</label>
                <input
                  id="license_expiry"
                  type="date"
                  required
                  value={form.license_expiry}
                  onChange={(e) => handleChange("license_expiry", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-3 px-4 py-2.5 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
            <FileUploadField
              label="License Photo"
              hint="Front of your driver's license"
              filename={form.license_filename}
              onSelect={(name) => handleChange("license_filename", name)}
            />
          </div>

          {/* Government ID */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Government-Issued ID
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="id_type">ID Type</label>
                <select
                  id="id_type"
                  value={form.id_type}
                  onChange={(e) => handleChange("id_type", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-3 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  {ID_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="id_number">ID Number</label>
                <input
                  id="id_number"
                  required
                  value={form.id_number}
                  onChange={(e) => handleChange("id_number", e.target.value)}
                  placeholder="ID number"
                  className="w-full rounded-lg border border-border bg-surface-3 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
            <FileUploadField
              label="ID Photo"
              hint="Front of your government ID"
              filename={form.id_filename}
              onSelect={(name) => handleChange("id_filename", name)}
            />
          </div>

          {/* Selfie */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Selfie with ID
            </h2>
            <div className="flex gap-3 rounded-lg border border-border bg-surface-2 p-3 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
              Hold your ID next to your face. Both must be clearly visible.
            </div>
            <FileUploadField
              label="Selfie Photo"
              hint="Photo of you holding your ID"
              filename={form.selfie_filename}
              onSelect={(name) => handleChange("selfie_filename", name)}
            />
          </div>

          {!hasDocuments && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              Upload all three documents to complete verification.
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" size="lg" className="flex-1 font-bold">
              Save & Submit for Verification
            </Button>
            {profile && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        /* Read-only view */
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center flex-shrink-0">
                <UserCircle className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="font-bold">{profile?.full_name}</p>
                <p className="text-xs text-muted-foreground">Renter account</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Driver&apos;s License
            </h3>
            <Separator />
            <Row label="License Number" value={profile?.license_number} />
            <Row label="Expiry Date" value={profile?.license_expiry} />
            <Row
              label="License Photo"
              value={profile?.license_filename ?? "Not uploaded"}
              valueClass={profile?.license_filename ? "text-emerald-400" : "text-yellow-400"}
            />
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Government ID
            </h3>
            <Separator />
            <Row label="ID Type" value={profile?.id_type} />
            <Row label="ID Number" value={profile?.id_number} />
            <Row
              label="ID Photo"
              value={profile?.id_filename ?? "Not uploaded"}
              valueClass={profile?.id_filename ? "text-emerald-400" : "text-yellow-400"}
            />
            <Row
              label="Selfie with ID"
              value={profile?.selfie_filename ?? "Not uploaded"}
              valueClass={profile?.selfie_filename ? "text-emerald-400" : "text-yellow-400"}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value?: string | null;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${valueClass ?? ""}`}>{value ?? "—"}</span>
    </div>
  );
}
