"use client";

import { useState } from "react";
import Image from "next/image";
import {
  GraduationCap,
  TrendingUp,
  Users,
  Mail,
  Lock,
  ArrowRight,
  User,
  BookOpen,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

const ROLES = [
  { key: "student", label: "Student", icon: User },
  { key: "teacher", label: "Teacher", icon: BookOpen },
  { key: "parent", label: "Parent", icon: Users },
  { key: "admin", label: "Admin", icon: Shield },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // TODO: logic here
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-500 to-teal-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="font-bold text-3xl text-white tracking-tight">EduTrack</span>
          </div>
          <p className="text-white/90 text-lg font-medium max-w-md">
            Smart Performance Tracking for Modern Education.
          </p>
        </div>

        {/* Hero image + floating cards */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Students collaborating"
              width={800}
              height={533}
              className="rounded-xl shadow-2xl w-full h-auto"
              priority
            />

            {/* Performance card */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg max-w-45 animate-bounce [animation-duration:3s]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Performance</p>
                  <p className="font-bold text-gray-900">A+ (95%)</p>
                </div>
              </div>
            </div>

            {/* Active users card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-45 animate-bounce [animation-duration:4s]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Users</p>
                  <p className="font-bold text-gray-900">1,248</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">EduTrack</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Login to your account to continue</p>
            </div>

            {/* Role selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedRole(key)}
                    className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg font-medium transition-all
                      ${selectedRole === key
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Login
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need an account?</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contact your administrator
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Accounts are created by system administrators
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
