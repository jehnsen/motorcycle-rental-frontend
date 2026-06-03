"use client";

import { useState, useEffect } from "react";
import { Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import type { Agency } from "@/types";

export default function SettingsPage() {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    createClient()
      .from("moto_agencies")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setAgency(data as unknown as Agency); });
  }, []);

  const handleSave = async () => {
    if (!agency) return;
    setSaving(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("moto_agencies") as any)
      .update({
        name: agency.name,
        description: agency.description ?? null,
        city: agency.city,
        address: agency.address,
        contact_number: agency.contact_number ?? null,
        email: agency.email ?? null,
        operating_hours: agency.operating_hours ?? null,
      })
      .eq("id", agency.id);
    setSaving(false);
  };

  if (!agency) {
    return (
      <div className="p-6 lg:p-8">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-surface-2 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-black">Agency Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your public agency profile and contact details</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="h-20 w-20 rounded-2xl bg-surface-3 border-2 border-border flex items-center justify-center">
            <span className="text-2xl font-black text-muted-foreground">{getInitials(agency.name)}</span>
          </div>
          <button className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-brand border-2 border-road flex items-center justify-center">
            <Camera className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
        <div>
          <p className="font-semibold">{agency.name}</p>
          <p className="text-sm text-muted-foreground">Upload a logo (PNG or JPG, max 2MB)</p>
          <button className="text-xs text-brand hover:underline mt-1">Change logo</button>
        </div>
      </div>

      <Separator />

      <div className="space-y-5">
        <h2 className="text-lg font-bold">Basic Information</h2>
        <div className="space-y-2">
          <Label>Agency Name</Label>
          <Input value={agency.name} onChange={(e) => setAgency({ ...agency, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={agency.description ?? ""}
            onChange={(e) => setAgency({ ...agency, description: e.target.value })}
            rows={4}
            placeholder="Tell renters about your fleet and services..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Select value={agency.city} onValueChange={(v) => setAgency({ ...agency, city: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Makati City","Cebu City","Baguio City","Quezon City","Taguig"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Operating Hours</Label>
            <Input
              value={agency.operating_hours ?? ""}
              onChange={(e) => setAgency({ ...agency, operating_hours: e.target.value })}
              placeholder="Mon-Sun 8:00 AM – 6:00 PM"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Full Address</Label>
          <Input value={agency.address} onChange={(e) => setAgency({ ...agency, address: e.target.value })} />
        </div>
      </div>

      <Separator />

      <div className="space-y-5">
        <h2 className="text-lg font-bold">Contact Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Contact Number</Label>
            <Input
              type="tel"
              value={agency.contact_number ?? ""}
              onChange={(e) => setAgency({ ...agency, contact_number: e.target.value })}
              placeholder="+63 9XX XXX XXXX"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={agency.email ?? ""}
              onChange={(e) => setAgency({ ...agency, email: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex gap-3">
        <Button className="gap-2" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save Changes"}
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
