"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/utils/toastUtils";
import { useUsers } from "@/hooks/useUsers";
import { UserRole, UserResponseDto } from "@/types/user";

type RoleFilter = "all" | "student" | "teacher" | "parent";

interface TableUser {
  key: string;
  userId: string | null;
  initials: string;
  initClass: string;
  name: string;
  email: string;
  role: string;
  roleClass: string;
  roleSlug: RoleFilter;
  status: string;
  statusClass: string;
  dotClass: string;
}

const roleStyles: Record<string, { initClass: string; roleClass: string }> = {
  student: {
    initClass: "bg-blue-100 text-blue-700",
    roleClass: "bg-blue-50 text-blue-700",
  },
  teacher: {
    initClass: "bg-purple-100 text-purple-700",
    roleClass: "bg-purple-50 text-purple-700",
  },
  parent: {
    initClass: "bg-orange-100 text-orange-700",
    roleClass: "bg-orange-50 text-orange-700",
  },
  admin: {
    initClass: "bg-red-100 text-red-700",
    roleClass: "bg-red-50 text-red-700",
  },
};

const fallbackRoleStyle = {
  initClass: "bg-gray-100 text-gray-700",
  roleClass: "bg-gray-100 text-gray-700",
};

const roleFilters: Array<{ label: string; value: RoleFilter }> = [
  { label: "All", value: "all" },
  { label: "Students", value: "student" },
  { label: "Teachers", value: "teacher" },
  { label: "Parents", value: "parent" },
];

const PAGE_SIZE = 10;

const getInitials = (name: string) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "NA";
};

const toTitleCase = (value: string) =>
  value.length > 0 ? value[0].toUpperCase() + value.slice(1).toLowerCase() : "Unknown";

const sanitizeRole = (role: string): RoleFilter => {
  if (role === "student" || role === "teacher" || role === "parent") {
    return role;
  }

  return "all";
};

// Maps a UserResponseDto to a TableUser, applying necessary transformations and fallbacks.
const mapApiUserToTableUser = (user: UserResponseDto, index: number): TableUser => {
  const roleRaw = (user.role ?? "unknown").toLowerCase();
  const roleSlug = sanitizeRole(roleRaw);
  const roleStyle = roleStyles[roleRaw] ?? fallbackRoleStyle;
  const name = user.fullName ?? "Unknown User";
  const email = user.email ?? "-";
  const isActive = user.isActive === true;

  return {
    key: `${user.id}-${email}`,
    userId: user.id,
    initials: getInitials(name),
    initClass: roleStyle.initClass,
    name,
    email,
    role: toTitleCase(roleRaw),
    roleClass: roleStyle.roleClass,
    roleSlug,
    status: isActive ? "Active" : "Offline",
    statusClass: isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600",
    dotClass: isActive ? "bg-green-500" : "bg-gray-400",
  };
};

export default function UsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    users,
    fetchUsersList,
    deleteUser,
    isLoadingUsers,
    isDeleting,
    deletingUserId,
    usersError,
    deleteError,
    clearDeleteError,
  } = useUsers();

  const [deletingUserKey, setDeletingUserKey] = useState<string | null>(null);

  const activeRoleFilter = sanitizeRole((searchParams.get("role") ?? "all").toLowerCase());
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const currentPageParam = Number(searchParams.get("page") ?? "1");

  // Map the Redux users to table users
  const tableUsers = useMemo(() => {
    return users.map((user, index) => mapApiUserToTableUser(user, index));
  }, [users]);

  // Load users on mount and when filters change
  useEffect(() => {
    const roleFilter =
      activeRoleFilter !== "all" ? (activeRoleFilter as UserRole) : undefined;

    fetchUsersList({
      role: roleFilter,
      search: searchQuery || undefined,
      page: currentPageParam,
      limit: PAGE_SIZE,
    });
  }, [activeRoleFilter, searchQuery, currentPageParam, fetchUsersList]);

  // Handle delete with error feedback
  useEffect(() => {
    if (deleteError) {
      showToast("error", deleteError);
      clearDeleteError();
    }
  }, [deleteError, clearDeleteError]);

  // Filtering and pagination logic is memoized to optimize performance
  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return tableUsers.filter((user) => {
      const matchesRole = activeRoleFilter === "all" || user.roleSlug === activeRoleFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.role.toLowerCase().includes(normalizedQuery);

      return matchesRole && matchesSearch;
    });
  }, [activeRoleFilter, searchQuery, tableUsers]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(currentPageParam) && currentPageParam > 0
      ? Math.min(currentPageParam, totalPages)
      : 1;

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredUsers]);

  // Update role filter in URL
  const updateRoleFilter = (role: RoleFilter) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("role", role);
    nextParams.set("page", "1");
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  // Update search query in URL
  const updateSearchQuery = (value: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }

    nextParams.set("page", "1");
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  // Update page in URL
  const updatePage = (nextPage: number) => {
    const safePage = Math.min(Math.max(1, nextPage), totalPages);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", String(safePage));
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  // Handle delete user
  const handleDeleteUser = async (user: TableUser) => {
    if (!user.userId) {
      showToast("error", "User id not found. Cannot delete this record.");
      return;
    }

    const confirmed = window.confirm(`Delete ${user.name}? This action cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setDeletingUserKey(user.key);
    deleteUser(user.userId);
  };

  // Show success toast when delete is complete
  useEffect(() => {
    if (!isDeleting && deletingUserKey && deletingUserId) {
      showToast("success", "User deleted successfully.");
      setDeletingUserKey(null);
    }
  }, [isDeleting, deletingUserKey, deletingUserId]);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-1">Manage students, teachers, and parents in one place.</p>
          </div>
          <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {roleFilters.map((filter) => {
            const isActive = filter.value === activeRoleFilter;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => updateRoleFilter(filter.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${isActive
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => updateSearchQuery(event.target.value)}
            placeholder="Search by name, email, or role"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
          />
        </div>

        {usersError ? <p className="text-sm text-red-600">{usersError}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                {["Name", "Role", "Status", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3 px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider ${i === 3 ? "text-right" : ""
                      }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={4} className="py-10 px-2 text-center text-sm text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : null}

              {!isLoadingUsers && filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 px-2 text-center text-sm text-gray-500">
                    No users found for the current filters.
                  </td>
                </tr>
              ) : null}

              {!isLoading &&
                paginatedUsers.map((user) => (
                  <tr key={user.key} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${user.initClass}`}
                        >
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
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${user.statusClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.dotClass}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        {user.userId ? (
                          <Link
                            href={`/admin/users/${encodeURIComponent(user.userId)}/edit?role=${user.roleSlug}`}
                            className="text-gray-400 hover:text-amber-600 transition-colors"
                            title="Edit user"
                          >
                            <Pencil size={16} />
                          </Link>
                        ) : (
                          <button
                            className="text-gray-300 cursor-not-allowed"
                            type="button"
                            disabled
                            title="User id not available"
                          >
                            <Pencil size={16} />
                          </button>
                        )}

                        {user.userId ? (
                          <Link
                            href={`/admin/users/${encodeURIComponent(user.userId)}?role=${user.roleSlug}`}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="View user details"
                          >
                            <Eye size={16} />
                          </Link>
                        ) : (
                          <button
                            className="text-gray-300 cursor-not-allowed"
                            type="button"
                            disabled
                            title="User id not available"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
                          type="button"
                          title="Delete user"
                          onClick={() => handleDeleteUser(user)}
                          disabled={!user.userId || deletingUserId === user.userId || isDeleting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!isLoadingUsers && filteredUsers.length > 0 ? (
          <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}
              {" - "}
              {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)}
              {" of "}
              {filteredUsers.length}
              {" users"}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updatePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-xs font-medium text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => updatePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
