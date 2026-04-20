"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Types 

interface Course {
  title: string;
  instructor: string;
  progress: number;
  color: string;
  icon: string;
}

interface Deadline {
  month: string;
  day: string | number;
  title: string;
  course: string;
  urgency: "red" | "orange" | "blue";
  label: string;
}

interface Activity {
  color: string;
  title: string;
  description: string;
  time: string;
}

interface Notification {
  color: string;
  icon: string;
  title: string;
  description: string;
  time: string;
}

// Data 

const courses: Course[] = [
  {
    title: "Advanced Mathematics",
    instructor: "Prof. Sarah Johnson",
    progress: 68,
    color: "from-blue-400 to-blue-600",
    icon: "calculator",
  },
  {
    title: "Physics Fundamentals",
    instructor: "Dr. Michael Chen",
    progress: 45,
    color: "from-purple-400 to-purple-600",
    icon: "atom",
  },
  {
    title: "Computer Science 101",
    instructor: "Prof. Emily Davis",
    progress: 92,
    color: "from-teal-400 to-teal-600",
    icon: "code",
  },
];

const deadlines: Deadline[] = [
  {
    month: "Today",
    day: 25,
    title: "Quiz 3",
    course: "Advanced Mathematics",
    urgency: "red",
    label: "Due Today",
  },
  {
    month: "Oct",
    day: 26,
    title: "Assignment 2",
    course: "Physics Fundamentals",
    urgency: "orange",
    label: "Tomorrow",
  },
  {
    month: "Oct",
    day: 30,
    title: "Quiz 5",
    course: "English Literature",
    urgency: "blue",
    label: "Next Week",
  },
];

const activities: Activity[] = [
  {
    color: "bg-green-600",
    title: "Completed Quiz",
    description: 'Finished "Calculus Quiz 2" with 95% score',
    time: "2 hours ago",
  },
  {
    color: "bg-blue-600",
    title: "Opened Course",
    description: 'Started learning "Physics Fundamentals - Chapter 5"',
    time: "5 hours ago",
  },
  {
    color: "bg-purple-600",
    title: "New Announcement",
    description: 'Prof. Johnson posted "Exam schedule updated"',
    time: "1 day ago",
  },
  {
    color: "bg-orange-600",
    title: "Enrolled in Course",
    description: 'Successfully enrolled in "Data Structures"',
    time: "2 days ago",
  },
];

const notifications: Notification[] = [
  {
    color: "bg-blue-500",
    icon: "file-question",
    title: "New Quiz Assigned",
    description: 'Prof. Johnson assigned "Algebra Quiz 4" - Due in 3 days',
    time: "10 mins ago",
  },
  {
    color: "bg-purple-500",
    icon: "book-open",
    title: "Course Updated",
    description: 'New materials added to "Computer Science 101"',
    time: "1 hour ago",
  },
  {
    color: "bg-green-500",
    icon: "message-circle",
    title: "Teacher Feedback",
    description: "Dr. Chen commented on your assignment submission",
    time: "3 hours ago",
  },
  {
    color: "bg-orange-500",
    icon: "alert-circle",
    title: "Deadline Reminder",
    description: "Physics Assignment 2 is due tomorrow at 11:59 PM",
    time: "5 hours ago",
  },
];

// Helpers 

const urgencyStyles: Record<
  Deadline["urgency"],
  { bg: string; border: string; dateBorder: string; dateText: string; badge: string }
> = {
  red: {
    bg: "bg-red-50",
    border: "border-red-100",
    dateBorder: "border-red-200",
    dateText: "text-red-700",
    badge: "text-red-600 bg-red-100",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    dateBorder: "border-orange-200",
    dateText: "text-orange-700",
    badge: "text-orange-600 bg-orange-100",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    dateBorder: "border-blue-200",
    dateText: "text-blue-700",
    badge: "text-blue-600 bg-blue-100",
  },
};

const courseProgressColor: Record<string, string> = {
  "from-blue-400 to-blue-600": "from-blue-500 to-blue-600",
  "from-purple-400 to-purple-600": "from-purple-500 to-purple-600",
  "from-teal-400 to-teal-600": "from-teal-500 to-teal-600",
};

const courseButtonColor: Record<string, string> = {
  "from-blue-400 to-blue-600":
    "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  "from-purple-400 to-purple-600":
    "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
  "from-teal-400 to-teal-600":
    "from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
};

const courseProgressText: Record<string, string> = {
  "from-blue-400 to-blue-600": "text-blue-600",
  "from-purple-400 to-purple-600": "text-purple-600",
  "from-teal-400 to-teal-600": "text-teal-600",
};

// Component 

export default function StudentDashboard() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<unknown>(null);

  // Dynamically load Chart.js and Lucide
  useEffect(() => {
    // Load Lucide icons
    const lucideScript = document.createElement("script");
    lucideScript.src = "https://unpkg.com/lucide@latest";
    lucideScript.onload = () => {
      // @ts-expect-error lucide is loaded globally
      if (window.lucide) window.lucide.createIcons();
    };
    document.body.appendChild(lucideScript);

    return () => {
      document.body.removeChild(lucideScript);
    };
  }, []);

  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef.current) return;

      // Dynamically import Chart.js
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      // Destroy previous instance if it exists
      if (chartInstance.current) {
        (chartInstance.current as InstanceType<typeof Chart>).destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Quizzes Completed",
              data: [2, 3, 1, 4, 2, 3, 5],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: "#3b82f6",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
            },
            {
              label: "Study Hours",
              data: [3, 4, 2, 5, 4, 6, 7],
              borderColor: "#a855f7",
              backgroundColor: "rgba(168, 85, 247, 0.1)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: "#a855f7",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: { size: 12 },
                usePointStyle: true,
                padding: 15,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "#f1f5f9" },
              ticks: { font: { size: 11 } },
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 11 } },
            },
          },
        },
      });
    };

    loadChart();

    return () => {
      if (chartInstance.current) {
        (chartInstance.current as { destroy: () => void }).destroy();
      }
    };
  }, []);

  // Re-run Lucide icon creation after every render
  useEffect(() => {
    // @ts-expect-error lucide is loaded globally
    if (window.lucide) window.lucide.createIcons();
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-700">

      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-md">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <i data-lucide="graduation-cap" className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900">EduTrack</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-linear-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg">
            <i data-lucide="layout-dashboard" className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          {[
            { icon: "book-open", label: "My Courses" },
            { icon: "file-question", label: "My Quizzes" },
            { icon: "trending-up", label: "Progress Tracking" },
          ].map(({ icon, label }) => (
            <a key={label} href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <i data-lucide={icon} className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-sm">{label}</span>
            </a>
          ))}
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            <i data-lucide="bell" className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-sm">Notifications</span>
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">5</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            <i data-lucide="mail" className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-sm">Messages</span>
            <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
          </a>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</div>
          {[
            { icon: "user", label: "Profile" },
            { icon: "settings", label: "Settings" },
          ].map(({ icon, label }) => (
            <a key={label} href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <i data-lucide={icon} className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-sm">{label}</span>
            </a>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Student Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Alex Johnson</p>
              <p className="text-xs text-gray-500 truncate">Student ID: 2024-1234</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <i data-lucide="log-out" className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <i data-lucide="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, resources..."
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <i data-lucide="bell" className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <i data-lucide="settings" className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Student"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
              />
              <i data-lucide="chevron-down" className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* Welcome Banner */}
          <div className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h2>
                <p className="text-blue-100 text-lg">
                  Keep learning... you&apos;re doing great! You&apos;ve completed 3 courses this month.
                </p>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Student"
                width={96}
                height={96}
                className="hidden lg:block w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: "book-open", bg: "from-blue-100 to-blue-200", text: "text-blue-600", label: "Enrolled Courses", value: "8", badge: "text-green-600 bg-green-50", badgeIcon: "trending-up", badgeText: "+2" },
              { icon: "check-circle", bg: "from-purple-100 to-purple-200", text: "text-purple-600", label: "Completed Quizzes", value: "24", badge: "text-green-600 bg-green-50", badgeIcon: "trending-up", badgeText: "+5" },
              { icon: "clock", bg: "from-orange-100 to-orange-200", text: "text-orange-600", label: "Upcoming Deadlines", value: "3", badge: "text-orange-600 bg-orange-50", badgeIcon: "alert-circle", badgeText: "Soon" },
              { icon: "award", bg: "from-green-100 to-green-200", text: "text-green-600", label: "Performance Score", value: "87%", badge: "text-green-600 bg-green-50", badgeIcon: "trending-up", badgeText: "+3%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-linear-to-br ${stat.bg} rounded-lg ${stat.text}`}>
                    <i data-lucide={stat.icon} className="w-6 h-6" />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${stat.badge} px-2 py-1 rounded-full`}>
                    <i data-lucide={stat.badgeIcon} className="w-3 h-3 mr-1" />
                    {stat.badgeText}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* My Courses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.title} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                  <div className={`h-40 bg-linear-to-br ${course.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i data-lucide={course.icon} className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">By {course.instructor}</p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span className={`font-medium ${courseProgressText[course.color]}`}>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-linear-to-r ${courseProgressColor[course.color]} h-2 rounded-full`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <button className={`w-full px-4 py-2.5 text-sm font-medium text-white bg-linear-to-r ${courseButtonColor[course.color]} rounded-lg transition-all shadow-md`}>
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Chart + Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Learning Progress</h3>
                <select className="text-xs border-gray-200 rounded-lg text-gray-500 focus:ring-0 focus:outline-none px-2 py-1 border">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Semester</option>
                </select>
              </div>
              <div className="h-80 w-full">
                <canvas ref={chartRef} />
              </div>
            </div>

            {/* Deadlines */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {deadlines.map((d) => {
                  const s = urgencyStyles[d.urgency];
                  return (
                    <div key={d.title} className={`flex items-start gap-3 p-3 rounded-lg ${s.bg} border ${s.border}`}>
                      <div className={`shrink-0 w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border ${s.dateBorder} text-xs font-bold ${s.dateText}`}>
                        <span className="text-[10px] uppercase opacity-70">{d.month}</span>
                        <span className="text-base">{d.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{d.title}</p>
                        <p className="text-xs text-gray-500">{d.course}</p>
                        <span className={`inline-block mt-1 text-xs font-medium ${s.badge} px-2 py-0.5 rounded-full`}>
                          {d.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activity + Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:h-full before:w-px before:bg-gray-200">
                {activities.map((a) => (
                  <div key={a.title + a.time} className="relative pl-8">
                    <div className={`absolute left-0 top-1 w-5 h-5 ${a.color.replace("600", "100")} rounded-full border-2 border-white flex items-center justify-center`}>
                      <div className={`w-2 h-2 ${a.color} rounded-full`} />
                    </div>
                    <p className="text-sm text-gray-800 font-medium">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark all as read</button>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => {
                  const colorKey = n.color.replace("bg-", "").replace("-500", "");
                  return (
                    <div key={n.title} className={`p-3 bg-${colorKey}-50 rounded-lg border border-${colorKey}-100 flex items-start gap-3`}>
                      <div className={`shrink-0 w-8 h-8 ${n.color} rounded-full flex items-center justify-center`}>
                        <i data-lucide={n.icon} className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium text-${colorKey}-900`}>{n.title}</p>
                        <p className={`text-xs text-${colorKey}-700 mt-0.5`}>{n.description}</p>
                        <p className={`text-xs text-${colorKey}-600 mt-1`}>{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
