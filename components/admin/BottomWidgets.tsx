import { Plus } from "lucide-react";

const activities = [
  { dotBg: "bg-blue-100", dot: "bg-blue-600", title: "New Student Enrolled", desc: 'Sarah Jenkins joined "Advanced Math"', time: "2 mins ago" },
  { dotBg: "bg-purple-100", dot: "bg-purple-600", title: "New Quiz Created", desc: 'Mr. Thompson added "History Midterm"', time: "1 hour ago" },
  { dotBg: "bg-green-100", dot: "bg-green-600", title: "Teacher Added", desc: "Welcome Emily Chen to Science Dept.", time: "3 hours ago" },
];

export function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 text-[15px] mb-4">Recent Activity</h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-2 bottom-0 w-px bg-gray-200" />

        <div className="space-y-6">
          {activities.map((a, i) => (
            <div key={i} className="relative pl-8">
              <div className={`absolute left-0 top-1 w-5 h-5 ${a.dotBg} rounded-full border-2 border-white flex items-center justify-center`}>
                <div className={`w-2 h-2 ${a.dot} rounded-full`} />
              </div>
              <p className="text-sm font-medium text-gray-800">{a.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
              <p className="text-xs text-gray-400 mt-1">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const quizzes = [
  { day: "24", label: "Physics Final Exam", sub: "Grade 12 • 09:00 AM" },
  { day: "26", label: "English Literature Quiz", sub: "Grade 10 • 02:00 PM" },
  { day: "28", label: "Biology Lab Report", sub: "Grade 11 • Deadline" },
];

export function UpcomingQuizzes() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-[15px]">Upcoming Quizzes</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-0">
          View Calendar
        </button>
      </div>

      <div className="space-y-3">
        {quizzes.map((q) => (
          <div key={q.day} className="flex items-start gap-3 p-3 rounded-md bg-gray-50 border border-gray-100">
            <div className="shrink-0 w-10 h-10 bg-white rounded-md flex flex-col items-center justify-center border border-gray-200">
              <span className="text-[10px] text-red-500 uppercase font-semibold leading-none">Oct</span>
              <span className="text-sm font-bold text-gray-700">{q.day}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{q.label}</p>
              <p className="text-xs text-gray-500">{q.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Announcements() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-[15px]">Announcements</h3>
        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-0">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 space-y-4">
        <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">System Update</p>
          </div>
          <p className="text-sm text-blue-900 font-medium">Platform maintenance scheduled for Sunday at 2 AM.</p>
        </div>

        <div className="p-3 bg-orange-50 rounded-md border border-orange-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <p className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">Holiday</p>
          </div>
          <p className="text-sm text-orange-900 font-medium">School closed for Thanksgiving break next Thursday.</p>
        </div>
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors cursor-pointer bg-transparent">
        View All Announcements
      </button>
    </div>
  );
}
