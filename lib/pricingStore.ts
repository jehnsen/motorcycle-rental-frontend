export type PricingRuleType = "weekend" | "holiday" | "peak_season" | "custom";

export interface PricingRule {
  id: string;
  bike_id: string | "all";
  type: PricingRuleType;
  label: string;
  multiplier: number;
  dates?: string[];
  day_of_week?: number[];
  start_date?: string;
  end_date?: string;
  active: boolean;
  created_at: string;
}

const KEY = "rnr_pricing_rules";

const SEED_RULES: PricingRule[] = [
  {
    id: "rule-1",
    bike_id: "all",
    type: "weekend",
    label: "Weekend Rate",
    multiplier: 1.2,
    day_of_week: [0, 6],
    active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-2",
    bike_id: "all",
    type: "peak_season",
    label: "Holy Week / Summer Peak",
    multiplier: 1.5,
    start_date: "2025-04-14",
    end_date: "2025-04-20",
    active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-3",
    bike_id: "all",
    type: "holiday",
    label: "Christmas Holiday",
    multiplier: 1.3,
    start_date: "2025-12-22",
    end_date: "2026-01-03",
    active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
];

function seed(): PricingRule[] {
  if (typeof window === "undefined") return SEED_RULES;
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED_RULES));
    return SEED_RULES;
  }
  return JSON.parse(raw) as PricingRule[];
}

export function getPricingRules(): PricingRule[] {
  return seed();
}

export function getMultiplierForDate(date: Date, bikeId: string): number {
  const rules = seed().filter((r) => r.active && (r.bike_id === "all" || r.bike_id === bikeId));
  let multiplier = 1;
  for (const rule of rules) {
    if (rule.day_of_week?.includes(date.getDay())) {
      multiplier = Math.max(multiplier, rule.multiplier);
    }
    if (rule.start_date && rule.end_date) {
      const start = new Date(rule.start_date);
      const end = new Date(rule.end_date);
      if (date >= start && date <= end) {
        multiplier = Math.max(multiplier, rule.multiplier);
      }
    }
  }
  return multiplier;
}

export function getAdjustedDailyRate(baseRate: number, date: Date, bikeId: string): number {
  return Math.round(baseRate * getMultiplierForDate(date, bikeId));
}

export function addPricingRule(data: Omit<PricingRule, "id" | "created_at">): PricingRule {
  const rules = seed();
  const rule: PricingRule = {
    ...data,
    id: `rule-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([...rules, rule]));
  return rule;
}

export function toggleRuleActive(id: string): void {
  const rules = seed().map((r) => (r.id === id ? { ...r, active: !r.active } : r));
  localStorage.setItem(KEY, JSON.stringify(rules));
}

export function deletePricingRule(id: string): void {
  const rules = seed().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(rules));
}
