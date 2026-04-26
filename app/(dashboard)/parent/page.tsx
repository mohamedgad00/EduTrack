"use client";

import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Baby,
  BookOpen,
  CalendarCheck,
  BarChart3,
  Mail,
  Megaphone,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  Award,
  ClipboardList,
  AlertCircle,
  Calendar,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from "chart.js";
import Image from "next/image";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

// Types 

interface Course {
  name: string;
  teacher: string;
  grade: number;
  color: string;
}

interface Event {
  month: string;
  day: number;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
}

interface Message {
  avatar: string;
  name: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
}

// Static Data 

const courses: Course[] = [
  { name: "Advanced Mathematics", teacher: "Prof. Sarah Johnson", grade: 85, color: "blue" },
  { name: "English Literature", teacher: "Ms. Emily Davis", grade: 92, color: "purple" },
  { name: "Physics Fundamentals", teacher: "Dr. Michael Chen", grade: 78, color: "indigo" },
];

const events: Event[] = [
  {
    month: "Oct",
    day: 28,
    title: "Parent-Teacher Meeting",
    description: "Discuss Alex's progress with teachers",
    badge: "In 3 days",
    badgeColor: "text-red-600 bg-red-100",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
  },
  {
    month: "Oct",
    day: 30,
    title: "Math Quiz Deadline",
    description: "Quiz 4 - Advanced Algebra",
    badge: "In 5 days",
    badgeColor: "text-orange-600 bg-orange-100",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  {
    month: "Nov",
    day: 5,
    title: "School Science Fair",
    description: "Alex's project presentation",
    badge: "In 2 weeks",
    badgeColor: "text-blue-600 bg-blue-100",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    month: "Nov",
    day: 12,
    title: "Mid-Term Exams Begin",
    description: "All subjects - 2 week period",
    badge: "In 3 weeks",
    badgeColor: "text-purple-600 bg-purple-100",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
  },
];

const messages: Message[] = [
  {
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    name: "Prof. Sarah Johnson",
    subject: "Alex's progress in Mathematics",
    preview:
      "Hello Mrs. Mitchell, I wanted to update you on Alex's excellent performance in the recent algebra test. He scored 95% and showed great understanding...",
    time: "2 hours ago",
    unread: true,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    name: "Dr. Michael Chen",
    subject: "Physics Lab Assignment",
    preview:
      "Dear Parent, Alex needs to complete the physics lab report by Friday. Please ensure he has the necessary materials...",
    time: "1 day ago",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    name: "School Administration",
    subject: "Parent-Teacher Conference Schedule",
    preview:
      "Your parent-teacher conference has been scheduled for October 28th at 3:00 PM. Please confirm your attendance...",
    time: "2 days ago",
  },
];

// Sub-components

function CourseBar({ course }: { course: Course }) {
  const colorMap: Record<string, { bg: string; bar: string; text: string; label: string; border: string }> = {
    blue: {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      bar: "bg-gradient-to-r from-blue-500 to-blue-600",
      text: "text-blue-700",
      label: "text-blue-600",
      border: "border-blue-200",
    },
    purple: {
      bg: "bg-gradient-to-r from-purple-50 to-purple-100",
      bar: "bg-gradient-to-r from-purple-500 to-purple-600",
      text: "text-purple-700",
      label: "text-purple-600",
      border: "border-purple-200",
    },
    indigo: {
      bg: "bg-gradient-to-r from-indigo-50 to-indigo-100",
      bar: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      text: "text-indigo-700",
      label: "text-indigo-600",
      border: "border-indigo-200",
    },
  };
  const c = colorMap[course.color];
  return (
    <div className={`p-4 ${c.bg} rounded-lg border ${c.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{course.name}</h4>
          <p className="text-xs text-gray-500">Teacher: {course.teacher}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${c.text}`}>{course.grade}%</p>
          <p className={`text-xs ${c.label}`}>Avg Grade</p>
        </div>
      </div>
      <div className="w-full bg-white/60 rounded-full h-2">
        <div className={`${c.bar} h-2 rounded-full`} style={{ width: `${course.grade}%` }} />
      </div>
    </div>
  );
}

function AttendanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Present", "Absent"],
        datasets: [
          {
            data: [47, 3],
            backgroundColor: ["#10b981", "#ef4444"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: { size: 12 },
              usePointStyle: true,
              padding: 15,
            },
          },
        },
        cutout: "70%",
      },
    });
    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

// Main Component 
export default function ParentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, active: true },
    { label: "My Children", icon: <Baby className="w-5 h-5" />, badge: null },
    { label: "Courses Overview", icon: <BookOpen className="w-5 h-5" />, badge: null },
    { label: "Attendance", icon: <CalendarCheck className="w-5 h-5" />, badge: null },
    { label: "Performance Reports", icon: <BarChart3 className="w-5 h-5" />, badge: null },
    { label: "Messages", icon: <Mail className="w-5 h-5" />, badge: "3" },
    { label: "Announcements", icon: <Megaphone className="w-5 h-5" />, badge: null },
  ];

  const accountItems = [
    { label: "Profile", icon: <User className="w-5 h-5" /> },
    { label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-700 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900">EduTrack</span>
          </div>
          <button
            className="lg:hidden ml-auto text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-all ${item.active
                ? "bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span className={item.active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ))}

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account
          </div>
          {accountItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg group transition-colors"
            >
              <span className="text-gray-400 group-hover:text-gray-600">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Parent"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Sarah Mitchell</p>
              <p className="text-xs text-gray-500 truncate">Parent Account</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Parent Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="/images/parent-1.png"
                alt="Parent"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
              />
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* Welcome Banner */}
          <div className="bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome, Sarah! 👋</h2>
                <p className="text-blue-100 text-lg mb-1">Track your children&apos;s progress and stay updated.</p>
                <p className="text-blue-50 text-sm italic">&quot;Your support makes success possible.&quot;</p>
              </div>
              <Image
                src="/images/parent-1.png"
                alt="Parent"
                width={96}
                height={96}
                className="hidden lg:block w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                iconBg: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600",
                label: "Total Courses",
                value: "8",
                sub: "Enrolled this semester",
                subColor: "text-gray-400",
              },
              {
                icon: <CalendarCheck className="w-6 h-6" />,
                iconBg: "bg-gradient-to-br from-green-100 to-green-200 text-green-600",
                label: "Attendance Rate",
                value: "94%",
                sub: "+2% from last month",
                subColor: "text-green-600",
                subIcon: <TrendingUp className="w-3 h-3 mr-1" />,
              },
              {
                icon: <Award className="w-6 h-6" />,
                iconBg: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600",
                label: "Avg Performance",
                value: "87%",
                sub: "Excellent progress",
                subColor: "text-purple-600",
                subIcon: <TrendingUp className="w-3 h-3 mr-1" />,
              },
              {
                icon: <ClipboardList className="w-6 h-6" />,
                iconBg: "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600",
                label: "Upcoming Tasks",
                value: "5",
                sub: "2 due this week",
                subColor: "text-orange-600",
                subIcon: <AlertCircle className="w-3 h-3 mr-1" />,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-lg ${card.iconBg}`}>{card.icon}</div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className={`text-xs mt-2 flex items-center ${card.subColor}`}>
                  {card.subIcon}
                  {card.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Attendance + Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Attendance chart */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Attendance Overview</h3>
              <div className="h-64 flex items-center justify-center">
                <AttendanceChart />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Days Present</span>
                  <span className="text-sm font-semibold text-green-600">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Absent</span>
                  <span className="text-sm font-semibold text-red-600">3</span>
                </div>
              </div>
            </div>

            {/* Course Performance */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Course Performance</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-4">
                {courses.map((course) => (
                  <CourseBar key={course.name} course={course} />
                ))}
              </div>
            </div>
          </div>

          {/* Events + Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Upcoming Events & Deadlines */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events &amp; Deadlines</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.title}
                    className={`flex items-start gap-3 p-3 rounded-lg ${event.bgColor} border ${event.borderColor}`}
                  >
                    <div className="shrink-0 w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-gray-200 text-xs font-bold text-gray-700">
                      <span className="text-[10px] text-gray-500 uppercase">{event.month}</span>
                      <span className="text-base">{event.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.description}</p>
                      <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${event.badgeColor}`}>
                        {event.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Announcements</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: <Megaphone className="w-4 h-4 text-white" />,
                    iconBg: "bg-blue-500",
                    title: "School Holiday Notice",
                    desc: "School will be closed on Nov 1st for Teacher Training Day",
                    time: "2 hours ago",
                    bg: "bg-blue-50",
                    border: "border-blue-100",
                    titleColor: "text-blue-900",
                    descColor: "text-blue-700",
                    timeColor: "text-blue-600",
                  },
                  {
                    icon: <Calendar className="w-4 h-4 text-white" />,
                    iconBg: "bg-green-500",
                    title: "Parent Workshop",
                    desc: "Join us for \"Supporting Your Child's Learning\" workshop on Nov 8th",
                    time: "1 day ago",
                    bg: "bg-green-50",
                    border: "border-green-100",
                    titleColor: "text-green-900",
                    descColor: "text-green-700",
                    timeColor: "text-green-600",
                  },
                  {
                    icon: <Award className="w-4 h-4 text-white" />,
                    iconBg: "bg-purple-500",
                    title: "Achievement Recognition",
                    desc: "Alex Mitchell received \"Student of the Month\" award for outstanding performance",
                    time: "2 days ago",
                    bg: "bg-purple-50",
                    border: "border-purple-100",
                    titleColor: "text-purple-900",
                    descColor: "text-purple-700",
                    timeColor: "text-purple-600",
                  },
                  {
                    icon: <AlertCircle className="w-4 h-4 text-white" />,
                    iconBg: "bg-orange-500",
                    title: "Fee Payment Reminder",
                    desc: "Semester fees are due by November 15th. Please complete payment to avoid late charges",
                    time: "3 days ago",
                    bg: "bg-orange-50",
                    border: "border-orange-100",
                    titleColor: "text-orange-900",
                    descColor: "text-orange-700",
                    timeColor: "text-orange-600",
                  },
                ].map((a) => (
                  <div key={a.title} className={`p-3 ${a.bg} rounded-lg border ${a.border} flex items-start gap-3`}>
                    <div className={`shrink-0 w-8 h-8 ${a.iconBg} rounded-full flex items-center justify-center`}>
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${a.titleColor}`}>{a.title}</p>
                      <p className={`text-xs mt-0.5 ${a.descColor}`}>{a.desc}</p>
                      <p className={`text-xs mt-1 ${a.timeColor}`}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Messages */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Messages</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All Messages</button>
            </div>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.name}
                  className={`flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200 ${msg.unread ? "bg-gray-50" : ""
                    }`}
                >
                  <Image
                    src={msg.avatar}
                    alt={msg.name}
                    width={48}
                    height={48}
                    className={`w-12 h-12 rounded-full object-cover border-2 ${msg.unread ? "border-blue-200" : "border-gray-200"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{msg.name}</h4>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{msg.subject}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{msg.preview}</p>
                    {msg.unread && (
                      <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          {/* <footer className="mt-12 pt-6 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center gap-6 mb-3">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Help Center</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 EduTrack. All rights reserved.{" "}
              <span className="text-gray-400">v2.1.0</span>
            </p>
          </footer> */}
        </div>
      </main>
    </div>
  );
}
