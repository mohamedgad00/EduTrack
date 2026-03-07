
import { MoreHorizontal } from "lucide-react";

interface User {
  initials: string;
  initClass: string;
  name: string;
  email: string;
  role: string;
  roleClass: string;
  status: string;
  statusClass: string;
  dotClass: string;
}

const users: User[] = [
  {
    initials: "JS",
    initClass: "bg-blue-100 text-blue-700",
    name: "John Smith",
    email: "john.s@edu.com",
    role: "Student",
    roleClass: "bg-blue-50 text-blue-700",
    status: "Active",
    statusClass: "bg-green-50 text-green-700",
    dotClass: "bg-green-500",
  },
  {
    initials: "MR",
    initClass: "bg-purple-100 text-purple-700",
    name: "Maria Rodriguez",
    email: "m.rod@edu.com",
    role: "Teacher",
    roleClass: "bg-purple-50 text-purple-700",
    status: "Active",
    statusClass: "bg-green-50 text-green-700",
    dotClass: "bg-green-500",
  },
  {
    initials: "DK",
    initClass: "bg-orange-100 text-orange-700",
    name: "David Kim",
    email: "d.kim@edu.com",
    role: "Parent",
    roleClass: "bg-orange-50 text-orange-700",
    status: "Offline",
    statusClass: "bg-gray-100 text-gray-600",
    dotClass: "bg-gray-400",
  },
];

export function RecentUsers() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-[15px]">Recent Users</h3>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {["Name", "Role", "Status", "Actions"].map((h, i) => (
                <th
                  key={h}
                  className={`py-3 px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider ${i === 3 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${user.initClass}`}>
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.roleClass}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${user.statusClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.dotClass}`} />
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}