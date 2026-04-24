"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Course, StudentGrade, AssignmentType } from "@/types/course";

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSaveGrades: (grades: StudentGrade[]) => void;
}

const ASSIGNMENT_TYPES: AssignmentType[] = ["Quizzes", "Midterm", "Final", "Homework"];

export default function GradeModal({ isOpen, onClose, course, onSaveGrades }: GradeModalProps) {
  const [grades, setGrades] = useState<StudentGrade[]>(
    course?.grades || course?.students.map((s) => ({ studentId: s.id, studentName: s.name })) || []
  );

  const handleGradeChange = (studentId: string, assignmentType: AssignmentType, value: string) => {
    const numValue = value === "" ? undefined : Math.min(100, Math.max(0, Number(value)));

    setGrades((prevGrades) => {
      const updated = prevGrades.map((g) => {
        if (g.studentId === studentId) {
          const updated = { ...g, [assignmentType.toLowerCase()]: numValue };
          // Calculate average
          const grades = [
            updated.quizzes,
            updated.midterm,
            updated.final,
            updated.homework,
          ].filter((g) => g !== undefined) as number[];

          if (grades.length > 0) {
            updated.averageGrade = grades.reduce((a, b) => a + b, 0) / grades.length;
          }
          return updated;
        }
        return g;
      });
      return updated;
    });
  };

  const handleSave = () => {
    onSaveGrades(grades);
    onClose();
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {course.name} - Grade Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left px-4 py-3 font-semibold text-gray-900 bg-gray-50 rounded-tl-lg">
                  Student Name
                </th>
                {ASSIGNMENT_TYPES.map((type) => (
                  <th
                    key={type}
                    className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50"
                  >
                    {type}
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50 rounded-tr-lg">
                  Average
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.studentId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{grade.studentName}</td>
                  {ASSIGNMENT_TYPES.map((type) => {
                    const key = type.toLowerCase() as Lowercase<AssignmentType>;
                    const value = grade[key as keyof StudentGrade];
                    return (
                      <td key={type} className="text-center px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={value ?? ""}
                          onChange={(e) => handleGradeChange(grade.studentId, type, e.target.value)}
                          placeholder="0-100"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    );
                  })}
                  <td className="text-center px-4 py-3 font-semibold text-blue-600">
                    {grade.averageGrade ? grade.averageGrade.toFixed(2) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            Save Grades
          </button>
        </div>
      </div>
    </div>
  );
}
