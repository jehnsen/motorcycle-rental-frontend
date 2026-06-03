"use client";

import { useEffect, useState } from "react";
import { Plus, CalendarDays, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPricingRules,
  addPricingRule,
  toggleRuleActive,
  deletePricingRule,
  type PricingRule,
  type PricingRuleType,
} from "@/lib/pricingStore";

const TYPE_LABELS: Record<PricingRuleType, string> = {
  weekend: "Weekend",
  holiday: "Holiday",
  peak_season: "Peak Season",
  custom: "Custom",
};

const TYPE_COLORS: Record<PricingRuleType, string> = {
  weekend: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  holiday: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  peak_season: "bg-brand/10 text-brand border-brand/30",
  custom: "bg-surface-3 text-muted-foreground border-border",
};

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: "",
    type: "weekend" as PricingRuleType,
    multiplier: "1.2",
    start_date: "",
    end_date: "",
    active: true,
  });

  function load() { setRules(getPricingRules()); }
  useEffect(() => { load(); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const days = form.type === "weekend" ? [0, 6] : undefined;
    addPricingRule({
      bike_id: "all",
      type: form.type,
      label: form.label,
      multiplier: parseFloat(form.multiplier),
      day_of_week: days,
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
      active: true,
    });
    setForm({ label: "", type: "weekend", multiplier: "1.2", start_date: "", end_date: "", active: true });
    setShowForm(false);
    load();
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Pricing Calendar</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Set weekend, holiday, and peak season rate multipliers.
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Rule
        </Button>
      </div>

      {/* Multiplier explainer */}
      <div className="rounded-xl border border-border bg-surface-2 p-4 mb-6 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground text-sm">How multipliers work</p>
        <p>A multiplier of <strong>1.2×</strong> means the daily rate is raised by 20% on matching dates.</p>
        <p>Example: ₱3,500/day × 1.2 = <strong>₱4,200/day</strong> on weekends.</p>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-brand/30 bg-brand/5 p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-sm">New Pricing Rule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Label</label>
              <input
                required
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="e.g. Semana Santa"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Rule Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as PricingRuleType }))}
                className={inputCls}
              >
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Rate Multiplier</label>
              <input
                required
                type="number"
                min="1"
                max="5"
                step="0.05"
                value={form.multiplier}
                onChange={(e) => setForm((f) => ({ ...f, multiplier: e.target.value }))}
                className={inputCls}
              />
              <p className="text-xs text-muted-foreground">
                {parseFloat(form.multiplier || "1") > 1
                  ? `+${Math.round((parseFloat(form.multiplier) - 1) * 100)}% rate increase`
                  : "No change"}
              </p>
            </div>
            {form.type !== "weekend" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="font-bold">Create Rule</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Rules list */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {rules.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">No pricing rules yet</div>
        ) : (
          <div className="divide-y divide-border">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-9 w-9 rounded-lg bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="h-4 w-4 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{rule.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${TYPE_COLORS[rule.type]}`}>
                      {TYPE_LABELS[rule.type]}
                    </span>
                    {!rule.active && (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-surface-3 text-muted-foreground border-border">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <strong className="text-foreground">{rule.multiplier}×</strong> rate
                    {rule.day_of_week ? " · Saturdays & Sundays" : ""}
                    {rule.start_date && rule.end_date ? ` · ${rule.start_date} to ${rule.end_date}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => { toggleRuleActive(rule.id); load(); }}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {rule.active
                      ? <ToggleRight className="h-5 w-5 text-emerald-400" />
                      : <ToggleLeft className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => { deletePricingRule(rule.id); load(); }}
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
