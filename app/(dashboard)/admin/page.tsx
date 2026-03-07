
import { Announcements, RecentActivity, UpcomingQuizzes } from "@/components/admin/BottomWidgets";
import Charts from "@/components/admin/Charts";
import KpiCards from "@/components/admin/KpiCards";
import { QuickActions } from "@/components/admin/QuickActions";
import { RecentUsers } from "@/components/admin/RecentUsers";

export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      {/* KPI Cards */}
      <KpiCards />

      {/* Charts */}
      <Charts />

      {/* Quick Actions + Recent Users */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-1">
          <QuickActions />
        </div>
        <div className="xl:col-span-2">
          <RecentUsers />
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity />
        <UpcomingQuizzes />
        <Announcements />
      </div>
    </div>
  );
}
