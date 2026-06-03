"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { CheckCircle2, XCircle, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPendingAgencies,
  approveAgency,
  rejectAgency,
  type PendingAgency,
  type AgencyApprovalStatus,
} from "@/lib/adminStore";

const STATUS_TABS: { label: string; value: AgencyApprovalStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_STYLE: Record<AgencyApprovalStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function AgencyApprovalsPage() {
  const [agencies, setAgencies] = useState<PendingAgency[]>([]);
  const [tab, setTab] = useState<AgencyApprovalStatus | "all">("pending");
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  function load() { setAgencies(getPendingAgencies()); }
  useEffect(() => { load(); }, []);

  const filtered = tab === "all" ? agencies : agencies.filter((a) => a.status === tab);

  function handleApprove(id: string) {
    approveAgency(id);
    load();
  }

  function handleReject() {
    if (!rejectModal) return;
    rejectAgency(rejectModal, rejectReason || "Does not meet platform requirements.");
    setRejectModal(null);
    setRejectReason("");
    load();
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Agency Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">
          New agency registrations must be reviewed before going live.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === t.value
                ? "bg-brand text-white"
                : "bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3"
            }`}
          >
            {t.label}
            <span className="ml-1.5 opacity-60">
              {t.value === "all"
                ? agencies.length
                : agencies.filter((a) => a.status === t.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface py-12 text-center text-sm text-muted-foreground">
          <Building2 className="h-8 w-8 mx-auto text-muted-foreground/20 mb-2" />
          No {tab === "all" ? "" : tab} agencies
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((agency) => (
            <div key={agency.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold">{agency.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_STYLE[agency.status]}`}>
                      {agency.status.charAt(0).toUpperCase() + agency.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Owner: {agency.owner_name} · {agency.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    City: {agency.city}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    Submitted {formatDistanceToNow(parseISO(agency.submitted_at), { addSuffix: true })}
                  </div>
                  {agency.reject_reason && (
                    <p className="text-xs text-red-400 mt-1">Reason: {agency.reject_reason}</p>
                  )}
                </div>

                {agency.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleApprove(agency.id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => setRejectModal(agency.id)}
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg">Reject Agency</h3>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Reason (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Does not meet platform requirements…"
                className="w-full rounded-lg border border-border bg-surface-3 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={handleReject}
              >
                Confirm Rejection
              </Button>
              <Button size="sm" variant="outline" onClick={() => setRejectModal(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
