"use client";

import { X, Plus } from "lucide-react";
import { useState } from "react";
import { Course, StudentAttendance, AttendanceStatus } from "@/types/course";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSaveAttendance: (attendance: StudentAttendance[]) => void;
}

export default function AttendanceModal({
  isOpen,
  onClose,
  course,
  onSaveAttendance,
}: AttendanceModalProps) {
  const [attendance, setAttendance] = useState<StudentAttendance[]>(
    course?.attendance ||
    course?.students.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      attendance: {},
      totalPresent: 0,
      totalAbsent: 0,
      attendancePercentage: 0,
    })) ||
    []
  );
  const [newDateInput, setNewDateInput] = useState("");

  const dates = attendance.length > 0 ? Object.keys(attendance[0]?.attendance || {}) : [];

  const handleAddDate = () => {
    if (!newDateInput) return;

    setAttendance((prev) =>
      prev.map((record) => ({
        ...record,
        attendance: {
          ...record.attendance,
          [newDateInput]: "present" as AttendanceStatus,
        },
      }))
    );

    setNewDateInput("");
  };

  const handleToggleAttendance = (studentId: string, date: string) => {
    setAttendance((prev) =>
      prev.map((record) => {
        if (record.studentId === studentId) {
          const current = record.attendance[date] || "present";
          const newStatus: AttendanceStatus = current === "present" ? "absent" : "present";

          const updated = {
            ...record,
            attendance: {
              ...record.attendance,
              [date]: newStatus,
            },
          };

          // Calculate totals
          const presentCount = Object.values(updated.attendance).filter(
            (s) => s === "present"
          ).length;
          const absentCount = Object.values(updated.attendance).filter(
            (s) => s === "absent"
          ).length;
          const total = presentCount + absentCount;

          updated.totalPresent = presentCount;
          updated.totalAbsent = absentCount;
          updated.attendancePercentage =
            total > 0 ? Math.round((presentCount / total) * 100) : 0;

          return updated;
        }
        return record;
      })
    );
  };

  const handleRemoveDate = (date: string) => {
    setAttendance((prev) =>
      prev.map((record) => {
        const { [date]: _, ...restAttendance } = record.attendance;

        const presentCount = Object.values(restAttendance).filter(
          (s) => s === "present"
        ).length;
        const absentCount = Object.values(restAttendance).filter(
          (s) => s === "absent"
        ).length;
        const total = presentCount + absentCount;

        return {
          ...record,
          attendance: restAttendance,
          totalPresent: presentCount,
          totalAbsent: absentCount,
          attendancePercentage: total > 0 ? Math.round((presentCount / total) * 100) : 0,
        };
      })
    );
  };

  const handleSave = () => {
    onSaveAttendance(attendance);
    onClose();
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {course.name} - Attendance Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add Date Section */}
          <div className="mb-6 flex gap-2">
            <input
              type="date"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddDate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={16} />
              Add Date
            </button>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 bg-gray-50">
                    Student Name
                  </th>
                  {dates.sort().map((date) => (
                    <th key={date} className="text-center px-3 py-3 bg-gray-50 relative">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold text-gray-900">{date}</span>
                        <button
                          onClick={() => handleRemoveDate(date)}
                          className="text-xs text-red-500 hover:text-red-700 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50">
                    Present
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50">
                    Absent
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50 rounded-tr-lg">
                    % Present
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.studentId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {record.studentName}
                    </td>
                    {dates.sort().map((date) => {
                      const status = record.attendance[date] || "present";
                      return (
                        <td key={date} className="text-center px-3 py-3">
                          <button
                            onClick={() => handleToggleAttendance(record.studentId, date)}
                            className={`w-full py-2 px-2 rounded font-medium transition-colors text-sm ${status === "present"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                          >
                            {status === "present" ? "✓ Present" : "✗ Absent"}
                          </button>
                        </td>
                      );
                    })}
                    <td className="text-center px-4 py-3 font-semibold text-green-600">
                      {record.totalPresent}
                    </td>
                    <td className="text-center px-4 py-3 font-semibold text-red-600">
                      {record.totalAbsent}
                    </td>
                    <td className="text-center px-4 py-3 font-semibold text-blue-600">
                      {record.attendancePercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {dates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No attendance dates added yet. Add a date to get started.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
