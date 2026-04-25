"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { updateCourseSuccess, deleteCourseSuccess } from "@/redux/features/courses/coursesSlice";
import { Course, StudentAttendance } from "@/types/course";
import AddCourseModal from "@/components/modals/AddCourseModal";
import GradeModal from "@/components/modals/GradeModal";
import AttendanceModal from "@/components/modals/AttendanceModal";
import { showToast } from "@/utils/toastUtils";
import { Edit, Trash2, BookOpen, Users, BarChart3, CalendarDays, Plus } from "lucide-react";

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses } = useSelector((state: RootState) => state.courses);
  const router = useRouter();

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  // Mock data for teachers and students
  const teachers = [
    { id: "t1", name: "Mr. Ahmed Hassan" },
    { id: "t2", name: "Mrs. Fatima Ali" },
    { id: "t3", name: "Dr. Mohamed Ibrahim" },
    { id: "t4", name: "Miss Layla Mahmoud" },
  ];

  const students = [
    { id: "s1", name: "Ali Ahmed" },
    { id: "s2", name: "Fatima Hassan" },
    { id: "s3", name: "Omar Ibrahim" },
    { id: "s4", name: "Noor Mohamed" },
    { id: "s5", name: "Zainab Ali" },
    { id: "s6", name: "Karim Khalil" },
    { id: "s7", name: "Layla Youssef" },
    { id: "s8", name: "Hassan Saleh" },
    { id: "s9", name: "Mona Adel" },
    { id: "s10", name: "Youssef Farah" },
  ];

  const handleAddCourse = () => {
    setCourseToEdit(null);
    setIsAddCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setCourseToEdit(course);
    setIsAddCourseModalOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      dispatch(deleteCourseSuccess(courseId));
      showToast("success", "Course deleted successfully");
    }
  };

  const handleViewGrades = (course: Course) => {
    setSelectedCourse(course);
    setIsGradeModalOpen(true);
  };

  const handleViewAttendance = (course: Course) => {
    setSelectedCourse(course);
    setIsAttendanceModalOpen(true);
  };

  const handleSaveGrades = (updatedCourse: Course) => {
    dispatch(updateCourseSuccess(updatedCourse));
    setSelectedCourse(updatedCourse);
    showToast("success", "Assessments saved successfully");
  };

  const handleSaveAttendance = (attendance: StudentAttendance[]) => {
    if (selectedCourse) {
      const updatedCourse = { ...selectedCourse, attendance };
      dispatch(updateCourseSuccess(updatedCourse));
      setSelectedCourse(updatedCourse);
      showToast("success", "Attendance saved successfully");
    }
  };

  const getAssessmentCount = (course: Course) => {
    return (course.quizzes || []).length + (course.homeworks || []).length + (course.midtermExam ? 1 : 0) + (course.finalExam ? 1 : 0);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen size={32} className="text-blue-600" />
            Courses Management
          </h1>
          <p className="text-gray-600 mt-1">Create and manage courses, assign teachers and students</p>
        </div>
        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          <Plus size={20} />
          Create Course
        </button>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Course Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-lg font-bold text-white mb-1">{course.name}</h3>
                <p className="text-blue-100 text-sm">
                  {course.level} • {course.class}
                </p>
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                {/* Teacher Info */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    Teacher
                  </p>
                  <p className="text-gray-900 font-medium">{course.teacherName}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={16} className="text-blue-600" />
                      <p className="text-xs text-gray-600 font-medium">Students</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{course.students.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 size={16} className="text-green-600" />
                      <p className="text-xs text-gray-600 font-medium">Assessments</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {getAssessmentCount(course)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleViewGrades(course)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm border border-amber-200"
                    >
                      <BarChart3 size={16} />
                      Assessments
                    </button>
                    <button
                      onClick={() => handleViewAttendance(course)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm border border-purple-200"
                    >
                      <CalendarDays size={16} />
                      Attendance
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-200"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => router.push(`/admin/courses/${course.id}`)}
                    className="w-full px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm border border-green-200"
                  >
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first course to get started with course management
          </p>
          <button
            onClick={handleAddCourse}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Create First Course
          </button>
        </div>
      )}

      {/* Modals */}
      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => {
          setIsAddCourseModalOpen(false);
          setCourseToEdit(null);
        }}
        courseToEdit={courseToEdit}
        teachers={teachers}
        students={students}
      />

      <GradeModal
        isOpen={isGradeModalOpen}
        onClose={() => {
          setIsGradeModalOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onSaveCourse={handleSaveGrades}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => {
          setIsAttendanceModalOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onSaveAttendance={handleSaveAttendance}
      />
    </div>
  );
}
