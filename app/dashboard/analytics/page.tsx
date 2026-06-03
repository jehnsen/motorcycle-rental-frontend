import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Revenue trends and booking performance.</p>
      </div>
      <AnalyticsCharts />
    </div>
  );
}
