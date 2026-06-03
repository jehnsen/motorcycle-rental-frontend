"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getRenterBookings } from "@/lib/bookingStore";
import { mockBookings } from "@/lib/mock/bookings";
import { formatPrice } from "@/lib/utils";

const BRAND = "#E85D24";
const BRAND_DIM = "#C04820";
const MUTED = "#888";
const SURFACE3 = "#242424";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PIE_COLORS: Record<string, string> = {
  big_bike: BRAND,
  naked: "#3B82F6",
  scooter: "#10B981",
  adventure: "#F59E0B",
};

function tooltipStyle() {
  return {
    contentStyle: { background: "#1A1A1A", border: "1px solid #333", borderRadius: 8, fontSize: 12 },
    labelStyle: { color: "#fff" },
    itemStyle: { color: "#E85D24" },
  };
}

interface ChartData {
  month: string;
  revenue: number;
  bookings: number;
}

export function AnalyticsCharts() {
  const { monthly, bikeTypes, totals } = useMemo(() => {
    const all = [...mockBookings, ...getRenterBookings()];

    // Monthly revenue + bookings (last 6 months)
    const now = new Date();
    const monthly: ChartData[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = MONTHS[d.getMonth()];
      const inMonth = all.filter((b) => {
        const c = new Date(b.created_at);
        return c.getMonth() === d.getMonth() && c.getFullYear() === d.getFullYear();
      });
      monthly.push({
        month,
        revenue: inMonth.reduce((s, b) => s + b.total_amount, 0),
        bookings: inMonth.length,
      });
    }

    // Bike type distribution
    const typeCounts: Record<string, number> = {};
    all.forEach((b) => {
      if (b.bike?.type) typeCounts[b.bike.type] = (typeCounts[b.bike.type] ?? 0) + 1;
    });
    const bikeTypes = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

    const totals = {
      revenue: all.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total_amount, 0),
      bookings: all.length,
      completed: all.filter((b) => b.status === "completed").length,
    };

    return { monthly, bikeTypes, totals };
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: formatPrice(totals.revenue) },
          { label: "Total Bookings", value: totals.bookings },
          { label: "Completed Rides", value: totals.completed },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface-2 p-4 text-center">
            <p className="text-2xl font-black text-brand">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue line chart */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="font-semibold mb-4 text-sm">Monthly Revenue (last 6 months)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke={SURFACE3} />
            <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              {...tooltipStyle()}
              formatter={(v) => [formatPrice(Number(v)), "Revenue"]}
            />
            <Line type="monotone" dataKey="revenue" stroke={BRAND} strokeWidth={2.5} dot={{ fill: BRAND, r: 4 }} activeDot={{ r: 6, fill: BRAND }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bookings bar chart + bike type pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-semibold mb-4 text-sm">Bookings per Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={SURFACE3} />
              <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle()} formatter={(v) => [Number(v), "Bookings"]} />
              <Bar dataKey="bookings" fill={BRAND} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-semibold mb-4 text-sm">Bookings by Bike Type</h3>
          {bikeTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bikeTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bikeTypes.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] ?? BRAND_DIM} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle()} formatter={(v, name) => [Number(v), String(name)]} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ color: MUTED, fontSize: 11 }}>{v.replace("_", " ")}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
              No booking data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
