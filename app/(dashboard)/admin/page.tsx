
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Announcements, RecentActivity, UpcomingQuizzes } from "@/components/admin/BottomWidgets";
import Charts from "@/components/admin/Charts";
import KpiCards from "@/components/admin/KpiCards";
import { QuickActions } from "@/components/admin/QuickActions";
import { RecentUsers } from "@/components/admin/RecentUsers";
import AddUserModal from "@/components/modals/AddUserModal";

export default function DashboardPage() {
  const router = useRouter();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  if (isAddUserModalOpen) {
    return <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      {/* KPI Cards */}
      <KpiCards />
      {/* Charts */}
      <Charts />
      {/* Quick Actions + Recent Users */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-1">
          <QuickActions
            onAddUserClick={() => setIsAddUserModalOpen(true)}
            onAddCourseClick={() => router.push("/admin/courses")}
          />
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
