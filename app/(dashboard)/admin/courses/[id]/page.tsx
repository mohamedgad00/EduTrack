"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArrowLeft, BarChart3, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.courses);

  const courseId = params.id as string;
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you&apos;re looking for does&apos;t exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate grade statistics
  const calculateStats = () => {
    const grades = course.grades.filter(g => g.averageGrade);
    if (grades.length === 0) return null;

    const average = grades.reduce((sum, g) => sum + (g.averageGrade || 0), 0) / grades.length;
    const highest = Math.max(...grades.map(g => g.averageGrade || 0));
    const lowest = Math.min(...grades.map(g => g.averageGrade || 0));

    return { average, highest, lowest };
  };

  const calculateAttendanceStats = () => {
    const attendance = course.attendance;
    if (attendance.length === 0) return null;

    const avgAttendance =
      attendance.reduce((sum, a) => sum + a.attendancePercentage, 0) / attendance.length;

    return { avgAttendance };
  };

  const stats = calculateStats();
  const attendanceStats = calculateAttendanceStats();

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Courses
      </button>

      {/* Course Header Card */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
        <p className="text-blue-100 mb-4">{course.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">Level</p>
            <p className="font-semibold">{course.level}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm mb-1">Class</p>
            <p className="font-semibold">{course.class}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm mb-1">Teacher</p>
            <p className="font-semibold">{course.teacherName}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm mb-1">Students</p>
            <p className="font-semibold">{course.students.length}</p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Grade Statistics */}
        {stats && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Class Average</h3>
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.average.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">out of 100</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Highest Grade</h3>
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.highest.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Maximum score</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Lowest Grade</h3>
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.lowest.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Minimum score</p>
            </div>
          </>
        )}

        {/* Attendance Statistics */}
        {attendanceStats && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Avg Attendance</h3>
              <Users size={20} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {attendanceStats.avgAttendance.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-2">across all students</p>
          </div>
        )}
      </div>

      {/* Grades Table */}
      {course.grades.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Grade Report</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Quizzes
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Midterm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Final
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Homework
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody>
                {course.grades.map((grade, idx) => (
                  <tr
                    key={grade.studentId}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {grade.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">
                      {grade.quizzes ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">
                      {grade.midterm ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">
                      {grade.final ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">
                      {grade.homework ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-blue-600">
                      {grade.averageGrade ? grade.averageGrade.toFixed(2) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {course.attendance.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Attendance Report</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Present
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Absent
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                    Attendance %
                  </th>
                </tr>
              </thead>
              <tbody>
                {course.attendance.map((record, idx) => (
                  <tr
                    key={record.studentId}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {record.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                        {record.totalPresent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                        {record.totalAbsent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-blue-600">
                      {record.attendancePercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
