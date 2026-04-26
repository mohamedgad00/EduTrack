"use client";

import { useEffect, useRef } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Users,
  FileQuestion,
  CalendarCheck,
  BarChart2,
  Megaphone,
  Mail,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
  Minus,
  AlertCircle,
  Calculator,
  FlaskConical,
  Atom,
  Plus,
  Menu,
} from "lucide-react";
import { Chart, registerables } from "chart.js";
import Image from "next/image";

Chart.register(...registerables);

export default function TeacherDashboard() {
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const attendanceChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartInstance = useRef<Chart | null>(null);
  const attendanceChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (performanceChartRef.current) {
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }
      const ctx = performanceChartRef.current.getContext("2d");
      if (ctx) {
        performanceChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
              "Advanced Math",
              "Chemistry",
              "Physics Lab",
              "Biology",
              "Statistics",
              "Algebra",
            ],
            datasets: [
              {
                label: "Average Score",
                data: [88, 76, 92, 81, 85, 79],
                backgroundColor: [
                  "#3b82f6",
                  "#a855f7",
                  "#14b8a6",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                ],
                borderRadius: 6,
                barThickness: 30,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
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
      }
    }

    if (attendanceChartRef.current) {
      if (attendanceChartInstance.current) {
        attendanceChartInstance.current.destroy();
      }
      const ctx = attendanceChartRef.current.getContext("2d");
      if (ctx) {
        attendanceChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Present", "Absent"],
            datasets: [
              {
                data: [94, 6],
                backgroundColor: ["#10b981", "#ef4444"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            cutout: "70%",
          },
        });
      }
    }

    return () => {
      performanceChartInstance.current?.destroy();
      attendanceChartInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 text-gray-700 font-sans">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 lg:static relative z-20">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900">EduTrack</span>
          </div>
          <button className="lg:hidden ml-auto text-gray-500">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-md group transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </a>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Teaching
          </div>

          {[
            { icon: BookOpen, label: "My Courses" },
            { icon: Users, label: "Students" },
            { icon: FileQuestion, label: "Quizzes" },
            { icon: CalendarCheck, label: "Attendance" },
            { icon: BarChart2, label: "Grades & Performance" },
          ].map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md group transition-colors"
            >
              <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span className="font-medium text-sm">{label}</span>
            </a>
          ))}

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Communication
          </div>

          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md group transition-colors"
          >
            <Megaphone className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            <span className="font-medium text-sm">Announcements</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md group transition-colors"
          >
            <Mail className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            <span className="font-medium text-sm">Messages</span>
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              3
            </span>
          </a>

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            System
          </div>

          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md group transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            <span className="font-medium text-sm">Settings</span>
          </a>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Teacher Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Sarah Johnson
              </p>
              <p className="text-xs text-gray-500 truncate">Math Teacher</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Teacher Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students, courses..."
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Mail className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="/images/teacher-1.png"
                alt="Teacher"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Welcome Banner */}
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, Sarah! 👋
                </h2>
                {/* <p className="text-blue-100">
                  You have 3 classes today and 2 quizzes to review.
                </p> */}
              </div>
              {/* <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-md font-medium hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" />
                Create Quiz
              </button> */}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              {
                icon: Users,
                color: "blue",
                label: "Total Students",
                value: "156",
                badge: "+8%",
                badgeColor: "green",
                BadgeIcon: TrendingUp,
              },
              {
                icon: BookOpen,
                color: "purple",
                label: "Total Courses",
                value: "8",
                badge: "0%",
                badgeColor: "gray",
                BadgeIcon: Minus,
              },
              {
                icon: FileQuestion,
                color: "teal",
                label: "Quizzes Created",
                value: "24",
                badge: "+12%",
                badgeColor: "green",
                BadgeIcon: TrendingUp,
              },
              {
                icon: CalendarCheck,
                color: "green",
                label: "Attendance Rate",
                value: "94%",
                badge: "+3%",
                badgeColor: "green",
                BadgeIcon: TrendingUp,
              },
              {
                icon: CalendarCheck,
                color: "orange",
                label: "Upcoming Deadlines",
                value: "5",
                badge: "Soon",
                badgeColor: "orange",
                BadgeIcon: AlertCircle,
              },
            ].map(
              ({ icon: Icon, color, label, value, badge, badgeColor, BadgeIcon }) => (
                <div
                  key={label}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-2 bg-${color}-50 rounded-md text-${color}-600`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`flex items-center text-xs font-medium text-${badgeColor}-600 bg-${badgeColor}-50 px-2 py-1 rounded-full`}
                    >
                      <BadgeIcon className="w-3 h-3 mr-1" />
                      {badge}
                    </span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {value}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Active Courses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Active Courses
              </h2>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Courses
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Calculator,
                  gradient: "from-blue-500 to-blue-600",
                  title: "Advanced Mathematics",
                  students: 42,
                  progress: 68,
                  progressColor: "bg-blue-600",
                  btnColor: "text-blue-600 bg-blue-50 hover:bg-blue-100",
                },
                {
                  icon: FlaskConical,
                  gradient: "from-purple-500 to-purple-600",
                  title: "Chemistry Fundamentals",
                  students: 38,
                  progress: 52,
                  progressColor: "bg-purple-600",
                  btnColor: "text-purple-600 bg-purple-50 hover:bg-purple-100",
                },
                {
                  icon: Atom,
                  gradient: "from-teal-500 to-teal-600",
                  title: "Physics Lab",
                  students: 35,
                  progress: 85,
                  progressColor: "bg-teal-600",
                  btnColor: "text-teal-600 bg-teal-50 hover:bg-teal-100",
                },
              ].map(
                ({
                  icon: Icon,
                  gradient,
                  title,
                  students,
                  progress,
                  progressColor,
                  btnColor,
                }) => (
                  <div
                    key={title}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div
                      className={`h-32 bg-linear-to-br ${gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Users className="w-4 h-4" />
                        <span>{students} Students</span>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Course Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${progressColor} h-2 rounded-full`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className={`flex-1 px-3 py-2 text-xs font-medium ${btnColor} rounded-md transition-colors`}
                        >
                          View
                        </button>
                        <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                          Manage
                        </button>
                        <button className="px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Performance Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">
                  Student Performance by Course
                </h3>
                <select className="text-xs border-gray-200 rounded-md text-gray-500 focus:ring-0 p-1 border">
                  <option>This Semester</option>
                  <option>Last Semester</option>
                </select>
              </div>
              <div className="h-80 w-full">
                <canvas ref={performanceChartRef} />
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-6">
                Attendance Summary
              </h3>
              <div className="h-64 w-full flex items-center justify-center mb-4">
                <canvas ref={attendanceChartRef} />
              </div>
              <div className="space-y-3">
                {[
                  { color: "bg-green-500", label: "Present", value: "94%" },
                  { color: "bg-red-500", label: "Absent", value: "6%" },
                ].map(({ color, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${color} rounded-full`} />
                      <span className="text-sm text-gray-600">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Upcoming Quizzes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Upcoming Quizzes
                </h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Create New
                </button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    month: "Oct",
                    day: "25",
                    monthColor: "text-blue-500",
                    title: "Calculus Midterm",
                    course: "Advanced Math",
                    students: 42,
                    submitted: 28,
                    subColor: "text-blue-600",
                  },
                  {
                    month: "Oct",
                    day: "27",
                    monthColor: "text-purple-500",
                    title: "Chemical Reactions",
                    course: "Chemistry",
                    students: 38,
                    submitted: 12,
                    subColor: "text-purple-600",
                  },
                  {
                    month: "Oct",
                    day: "30",
                    monthColor: "text-teal-500",
                    title: "Motion & Forces",
                    course: "Physics Lab",
                    students: 35,
                    submitted: 0,
                    subColor: "text-teal-600",
                  },
                ].map(
                  ({
                    month,
                    day,
                    monthColor,
                    title,
                    course,
                    students,
                    submitted,
                    subColor,
                  }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 p-3 rounded-md bg-gray-50 border border-gray-100"
                    >
                      <div className="shrink-0 w-10 h-10 bg-white rounded-md flex flex-col items-center justify-center border border-gray-200 text-xs font-bold text-gray-700">
                        <span className={`text-[10px] ${monthColor} uppercase`}>
                          {month}
                        </span>
                        <span>{day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course} • {students} students
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            Submissions:
                          </span>
                          <span className={`text-xs font-semibold ${subColor}`}>
                            {submitted}/{students}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">
                Recent Activities
              </h3>
              <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:h-full before:w-px before:bg-gray-200">
                {[
                  {
                    bg: "bg-green-100",
                    dot: "bg-green-600",
                    title: "Quiz Completed",
                    desc: 'John Smith submitted "Algebra Quiz"',
                    time: "5 mins ago",
                  },
                  {
                    bg: "bg-blue-100",
                    dot: "bg-blue-600",
                    title: "New Student Added",
                    desc: 'Emma Davis joined "Chemistry Fundamentals"',
                    time: "1 hour ago",
                  },
                  {
                    bg: "bg-purple-100",
                    dot: "bg-purple-600",
                    title: "Course Updated",
                    desc: 'Added new materials to "Physics Lab"',
                    time: "3 hours ago",
                  },
                  {
                    bg: "bg-orange-100",
                    dot: "bg-orange-600",
                    title: "Announcement Posted",
                    desc: "Sent reminder about upcoming exam",
                    time: "5 hours ago",
                  },
                ].map(({ bg, dot, title, desc, time }) => (
                  <div key={title} className="relative pl-8">
                    <div
                      className={`absolute left-0 top-1 w-5 h-5 ${bg} rounded-full border-2 border-white flex items-center justify-center`}
                    >
                      <div className={`w-2 h-2 ${dot} rounded-full`} />
                    </div>
                    <p className="text-sm text-gray-800 font-medium">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Announcements */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Class Announcements
                </h3>
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    <p className="text-xs font-bold text-blue-800 uppercase">
                      Exam Reminder
                    </p>
                  </div>
                  <p className="text-sm text-blue-900 font-medium">
                    Calculus midterm exam scheduled for Friday at 9 AM. Review
                    chapters 5-8.
                  </p>
                  <p className="text-xs text-blue-700 mt-2">Posted 2 days ago</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-md border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full" />
                    <p className="text-xs font-bold text-purple-800 uppercase">
                      Lab Session
                    </p>
                  </div>
                  <p className="text-sm text-purple-900 font-medium">
                    Chemistry lab moved to Room 204. Bring safety goggles and
                    lab coats.
                  </p>
                  <p className="text-xs text-purple-700 mt-2">
                    Posted 1 week ago
                  </p>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors">
                Create Announcement
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
