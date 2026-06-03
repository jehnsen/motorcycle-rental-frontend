"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, ToggleLeft, ToggleRight, Trash2, Percent, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getPromoCodes,
  addPromoCode,
  togglePromoActive,
  deletePromoCode,
  type PromoCode,
} from "@/lib/promoStore";
import { formatPrice } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export default function PromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percent" as "percent" | "fixed",
    discount_value: "",
    min_days: "",
    max_uses: "",
    expires_at: "",
    active: true,
  });

  function load() { setPromos(getPromoCodes()); }
  useEffect(() => { load(); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addPromoCode({
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_days: form.min_days ? parseInt(form.min_days) : undefined,
      max_uses: form.max_uses ? parseInt(form.max_uses) : undefined,
      expires_at: form.expires_at || undefined,
      active: true,
    });
    setForm({ code: "", discount_type: "percent", discount_value: "", min_days: "", max_uses: "", expires_at: "", active: true });
    setShowForm(false);
    load();
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Promo Codes</h1>
          <p className="text-muted-foreground text-sm mt-1">Discounts for repeat renters and campaigns.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> New Code
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-brand/30 bg-brand/5 p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-sm">New Promo Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Code">
              <input
                required
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="e.g. SUMMER20"
                className={inputCls}
              />
            </Field>
            <Field label="Discount Type">
              <select
                value={form.discount_type}
                onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as "percent" | "fixed" }))}
                className={inputCls}
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₱)</option>
              </select>
            </Field>
            <Field label={form.discount_type === "percent" ? "Discount %" : "Discount ₱"}>
              <input
                required
                type="number"
                min="1"
                max={form.discount_type === "percent" ? "100" : undefined}
                value={form.discount_value}
                onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
                placeholder={form.discount_type === "percent" ? "20" : "500"}
                className={inputCls}
              />
            </Field>
            <Field label="Min. Rental Days">
              <input
                type="number"
                min="1"
                value={form.min_days}
                onChange={(e) => setForm((f) => ({ ...f, min_days: e.target.value }))}
                placeholder="Optional"
                className={inputCls}
              />
            </Field>
            <Field label="Max Uses">
              <input
                type="number"
                min="1"
                value={form.max_uses}
                onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))}
                placeholder="Optional (unlimited)"
                className={inputCls}
              />
            </Field>
            <Field label="Expires At">
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="font-bold">Create Code</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Promo list */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {promos.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">No promo codes yet</div>
        ) : (
          <div className="divide-y divide-border">
            {promos.map((promo) => (
              <div key={promo.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-9 w-9 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center flex-shrink-0">
                  <Tag className="h-4 w-4 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm">{promo.code}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${promo.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-surface-3 text-muted-foreground border-border"}`}>
                      {promo.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {promo.discount_type === "percent"
                      ? `${promo.discount_value}% off`
                      : `${formatPrice(promo.discount_value)} off`}
                    {promo.min_days ? ` · min ${promo.min_days}d` : ""}
                    {promo.max_uses ? ` · ${promo.uses}/${promo.max_uses} used` : ` · ${promo.uses} used`}
                    {promo.expires_at ? ` · expires ${format(parseISO(promo.expires_at), "MMM d, yyyy")}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    title={promo.active ? "Deactivate" : "Activate"}
                    onClick={() => { togglePromoActive(promo.id); load(); }}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {promo.active
                      ? <ToggleRight className="h-5 w-5 text-emerald-400" />
                      : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <button
                    title="Delete"
                    onClick={() => { deletePromoCode(promo.id); load(); }}
                    className="p-1.5 rounded text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-surface-3 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
