import { Users, GraduationCap, UserCheck, Activity, TrendingUp, Minus, LucideIcon } from "lucide-react";

interface KpiCard {
  icon: LucideIcon;
  iconClass: string;
  badge: string;
  badgeClass: string;
  badgeIcon: "up" | "neutral";
  label: string;
  value: string;
}

const cards: KpiCard[] = [
  {
    icon: Users,
    iconClass: "bg-blue-50 text-blue-600",
    badge: "+12%",
    badgeClass: "bg-green-50 text-green-600",
    badgeIcon: "up",
    label: "Total Students",
    value: "2,543",
  },
  {
    icon: GraduationCap,
    iconClass: "bg-purple-50 text-purple-600",
    badge: "+4%",
    badgeClass: "bg-green-50 text-green-600",
    badgeIcon: "up",
    label: "Total Teachers",
    value: "142",
  },
  {
    icon: UserCheck,
    iconClass: "bg-orange-50 text-orange-600",
    badge: "0%",
    badgeClass: "bg-gray-100 text-gray-500",
    badgeIcon: "neutral",
    label: "Total Parents",
    value: "1,890",
  },
  {
    icon: Activity,
    iconClass: "bg-teal-50 text-teal-600",
    badge: "+8%",
    badgeClass: "bg-green-50 text-green-600",
    badgeIcon: "up",
    label: "Daily Active Users",
    value: "892",
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
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
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
