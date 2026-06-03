export type AgencyApprovalStatus = "pending" | "approved" | "rejected";

export interface PendingAgency {
  id: string;
  name: string;
  owner_name: string;
  email: string;
  city: string;
  status: AgencyApprovalStatus;
  submitted_at: string;
  reviewed_at?: string;
  reject_reason?: string;
}

const AGENCY_KEY = "rnr_pending_agencies";

const SEED_AGENCIES: PendingAgency[] = [
  {
    id: "pending-1",
    name: "SunRide Davao",
    owner_name: "Jose Ramos",
    email: "sunride@example.com",
    city: "Davao City",
    status: "pending",
    submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "pending-2",
    name: "IloRide Iloilo",
    owner_name: "Karen Villanueva",
    email: "iloride@example.com",
    city: "Iloilo City",
    status: "pending",
    submitted_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "pending-3",
    name: "MetroMoto Manila",
    owner_name: "Diego Santos",
    email: "metromoto@example.com",
    city: "Manila",
    status: "approved",
    submitted_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    reviewed_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

function seedAgencies(): PendingAgency[] {
  if (typeof window === "undefined") return SEED_AGENCIES;
  const raw = localStorage.getItem(AGENCY_KEY);
  if (!raw) {
    localStorage.setItem(AGENCY_KEY, JSON.stringify(SEED_AGENCIES));
    return SEED_AGENCIES;
  }
  return JSON.parse(raw) as PendingAgency[];
}

export function getPendingAgencies(): PendingAgency[] {
  return seedAgencies();
}

export function approveAgency(id: string): void {
  const updated = seedAgencies().map((a) =>
    a.id === id ? { ...a, status: "approved" as const, reviewed_at: new Date().toISOString() } : a
  );
  localStorage.setItem(AGENCY_KEY, JSON.stringify(updated));
}

export function rejectAgency(id: string, reason: string): void {
  const updated = seedAgencies().map((a) =>
    a.id === id
      ? { ...a, status: "rejected" as const, reviewed_at: new Date().toISOString(), reject_reason: reason }
      : a
  );
  localStorage.setItem(AGENCY_KEY, JSON.stringify(updated));
}

export function submitAgencyForApproval(data: Omit<PendingAgency, "id" | "submitted_at" | "status">): PendingAgency {
  const agencies = seedAgencies();
  const agency: PendingAgency = {
    ...data,
    id: `pending-${Date.now()}`,
    status: "pending",
    submitted_at: new Date().toISOString(),
  };
  localStorage.setItem(AGENCY_KEY, JSON.stringify([...agencies, agency]));
  return agency;
}
