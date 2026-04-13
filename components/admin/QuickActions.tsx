import { UserPlus, PlusCircle, FileText, Send, LucideIcon } from "lucide-react";

interface Action { icon: LucideIcon; label: string; iconClass: string; }

interface QuickActionsProps {
  onAddUserClick?: () => void;
}

const actions: Action[] = [
  { icon: UserPlus, label: "Add User", iconClass: "text-blue-600" },
  { icon: PlusCircle, label: "New Course", iconClass: "text-purple-600" },
  { icon: FileText, label: "Reports", iconClass: "text-teal-600" },
  { icon: Send, label: "Announce", iconClass: "text-orange-600" },
];

export function QuickActions({ onAddUserClick }: QuickActionsProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 text-[15px] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.label === "Add User" ? onAddUserClick : undefined}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <Icon size={20} className={action.iconClass} />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}