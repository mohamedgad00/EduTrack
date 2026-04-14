"use client";

import { useEffect } from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  Activity,
  TrendingUp,
  Minus,
  LucideIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/redux/features/users/usersSlice";
import type { AppDispatch, RootState } from "@/redux/store";

interface KpiCard {
  icon: LucideIcon;
  iconClass: string;
  badge: string;
  badgeClass: string;
  badgeIcon: "up" | "neutral";
  label: string;
  value: number;
}

const cards: Array<Omit<KpiCard, "value"> & { statKey: keyof RootState["users"]["dashboardStats"] }> = [
  {
    icon: Users,
    iconClass: "bg-blue-50 text-blue-600",
    badge: "Live",
    badgeClass: "bg-blue-50 text-blue-700",
    badgeIcon: "neutral",
    label: "Total Students",
    statKey: "totalStudents",
  },
  {
    icon: GraduationCap,
    iconClass: "bg-purple-50 text-purple-600",
    badge: "Live",
    badgeClass: "bg-purple-50 text-purple-700",
    badgeIcon: "neutral",
    label: "Total Teachers",
    statKey: "totalTeachers",
  },
  {
    icon: UserCheck,
    iconClass: "bg-orange-50 text-orange-600",
    badge: "Live",
    badgeClass: "bg-orange-50 text-orange-700",
    badgeIcon: "neutral",
    label: "Total Parents",
    statKey: "totalParents",
  },
  {
    icon: Activity,
    iconClass: "bg-teal-50 text-teal-600",
    badge: "Live",
    badgeClass: "bg-teal-50 text-teal-700",
    badgeIcon: "neutral",
    label: "Daily Active Users",
    statKey: "dailyActiveUsers",
  },
];

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

function KpiCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-md bg-gray-100" />
        <div className="h-6 w-14 rounded-full bg-gray-100" />
      </div>
      <div className="h-4 w-24 rounded bg-gray-100 mb-3" />
      <div className="h-8 w-20 rounded bg-gray-100" />
    </div>
  );
}

export default function KpiCards() {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardStats, isLoadingStats, statsLoaded, statsError } = useSelector(
    (state: RootState) => state.users,
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoadingStats && !statsLoaded) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <KpiCardSkeleton key={card.label} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-8">
      {statsError ? (
        <p className="text-sm text-red-600">{statsError}</p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const value = dashboardStats[card.statKey];

          return (
            <div
              key={card.label}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-md ${card.iconClass}`}>
                  <Icon size={24} />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${card.badgeClass}`}>
                  {card.badgeIcon === "up" ? <TrendingUp size={12} /> : <Minus size={12} />}
                  {card.badge}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(value)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
