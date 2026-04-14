"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/utils/api";

type RoleFilter = "all" | "student" | "teacher" | "parent";

interface ApiUser {
  id?: string | number;
  _id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  status?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  username?: string;
  address?: string;
  emergencyContact?: string;
  grade?: string;
  classSection?: string;
  parentGuardian?: string;
  specialty?: string;
  experience?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiUserResponse {
  data?: ApiUser;
  user?: ApiUser;
  result?: ApiUser;
}

const roleBadgeClass: Record<string, string> = {
  student: "bg-blue-50 text-blue-700",
  teacher: "bg-purple-50 text-purple-700",
  parent: "bg-orange-50 text-orange-700",
};

const toTitleCase = (value: string) =>
  value.length > 0 ? value[0].toUpperCase() + value.slice(1).toLowerCase() : "Unknown";

const normalizeRole = (role: string): RoleFilter => {
  if (role === "student" || role === "teacher" || role === "parent") {
    return role;
  }

  return "all";
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const extractUser = (payload: ApiUserResponse | ApiUser): ApiUser => {
  if (typeof payload === "object" && payload !== null) {
    const responsePayload = payload as ApiUserResponse;
    if (responsePayload.data || responsePayload.user || responsePayload.result) {
      return responsePayload.data ?? responsePayload.user ?? responsePayload.result ?? {};
    }
  }

  return payload as ApiUser;
};

const roleEndpointByRole: Record<Exclude<RoleFilter, "all">, string> = {
  student: "users/students",
  teacher: "users/teachers",
  parent: "users/parents",
};

export default function UserInformationPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const userId = String(params.id ?? "");
  const roleHint = normalizeRole((searchParams.get("role") ?? "all").toLowerCase());

  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!userId) {
        setError("Invalid user id.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<ApiUserResponse | ApiUser>(`users/${encodeURIComponent(userId)}`);

        if (isMounted) {
          setUser(extractUser(response.data));
        }
      } catch {
        if (roleHint !== "all") {
          try {
            const fallbackEndpoint = roleEndpointByRole[roleHint];
            const fallbackResponse = await api.get<ApiUserResponse | ApiUser>(
              `${fallbackEndpoint}/${encodeURIComponent(userId)}`,
            );

            if (isMounted) {
              setUser(extractUser(fallbackResponse.data));
            }

            return;
          } catch {
            if (isMounted) {
              setError("Failed to load user information.");
            }
          }
        } else if (isMounted) {
          setError("Failed to load user information.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [roleHint, userId]);

  const roleValue = useMemo(() => toTitleCase((user?.role ?? roleHint).toLowerCase()), [roleHint, user?.role]);
  const roleSlug = useMemo(() => normalizeRole((user?.role ?? roleHint).toLowerCase()), [roleHint, user?.role]);
  const roleClass = roleBadgeClass[roleSlug] ?? "bg-gray-100 text-gray-700";
  const isActive = user?.isActive === true || user?.status?.toLowerCase() === "active";

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">User Information</h1>
            <p className="text-sm text-gray-500 mt-1">Detailed profile and account data for the selected user.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/admin/users/${encodeURIComponent(userId)}/edit?role=${roleSlug}`}
              className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              <Pencil size={16} />
              Edit User
            </Link>

            <Link href="/admin/users?role=all" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft size={16} />
              Back to Users
            </Link>
          </div>
        </div>

        {isLoading ? <p className="text-sm text-gray-500">Loading user information...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {!isLoading && !error && user ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-gray-100 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Profile</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900 text-right">{user.fullName ?? user.name ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900 text-right">{user.email ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Role</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleClass}`}>
                    {roleValue}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
                    {isActive ? "Active" : "Offline"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900 text-right">{user.phone ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Username</span>
                  <span className="font-medium text-gray-900 text-right">{user.username ?? "-"}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Additional Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-medium text-gray-900 text-right">{user.gender ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Date of Birth</span>
                  <span className="font-medium text-gray-900 text-right">{formatDate(user.dob)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Address</span>
                  <span className="font-medium text-gray-900 text-right">{user.address ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Emergency Contact</span>
                  <span className="font-medium text-gray-900 text-right">{user.emergencyContact ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium text-gray-900 text-right">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="font-medium text-gray-900 text-right">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
