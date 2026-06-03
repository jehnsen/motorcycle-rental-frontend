export interface PromoCode {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_days?: number;
  max_uses?: number;
  uses: number;
  expires_at?: string;
  active: boolean;
  created_at: string;
}

const KEY = "rnr_promos";

const SEED_PROMOS: PromoCode[] = [
  {
    id: "promo-1",
    code: "FIRST20",
    discount_type: "percent",
    discount_value: 20,
    min_days: 2,
    max_uses: 100,
    uses: 14,
    active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "promo-2",
    code: "RIDE500",
    discount_type: "fixed",
    discount_value: 500,
    min_days: 1,
    max_uses: 50,
    uses: 7,
    active: true,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "promo-3",
    code: "SUMMER15",
    discount_type: "percent",
    discount_value: 15,
    min_days: 3,
    active: false,
    uses: 32,
    created_at: "2024-05-01T00:00:00Z",
  },
];

function seed(): PromoCode[] {
  if (typeof window === "undefined") return SEED_PROMOS;
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED_PROMOS));
    return SEED_PROMOS;
  }
  return JSON.parse(raw) as PromoCode[];
}

export function getPromoCodes(): PromoCode[] {
  return seed();
}

export function validatePromo(
  code: string,
  days: number,
  subtotal: number
): { valid: boolean; promo?: PromoCode; error?: string } {
  const promos = seed();
  const promo = promos.find((p) => p.code.toUpperCase() === code.toUpperCase());
  if (!promo) return { valid: false, error: "Invalid promo code." };
  if (!promo.active) return { valid: false, error: "This promo code has expired." };
  if (promo.expires_at && new Date(promo.expires_at) < new Date())
    return { valid: false, error: "This promo code has expired." };
  if (promo.max_uses !== undefined && promo.uses >= promo.max_uses)
    return { valid: false, error: "This promo code has reached its usage limit." };
  if (promo.min_days !== undefined && days < promo.min_days)
    return { valid: false, error: `This code requires a minimum of ${promo.min_days} rental days.` };
  return { valid: true, promo };
}

export function applyDiscount(subtotal: number, promo: PromoCode): number {
  if (promo.discount_type === "percent") {
    return Math.round(subtotal * (promo.discount_value / 100));
  }
  return Math.min(promo.discount_value, subtotal);
}

export function addPromoCode(data: Omit<PromoCode, "id" | "created_at" | "uses">): PromoCode {
  const promos = seed();
  const newPromo: PromoCode = {
    ...data,
    id: `promo-${Date.now()}`,
    uses: 0,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([...promos, newPromo]));
  return newPromo;
}

export function togglePromoActive(id: string): void {
  const promos = seed().map((p) => (p.id === id ? { ...p, active: !p.active } : p));
  localStorage.setItem(KEY, JSON.stringify(promos));
}

export function deletePromoCode(id: string): void {
  const promos = seed().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(promos));
}
