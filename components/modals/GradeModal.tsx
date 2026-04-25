"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Course, StudentGrade } from "@/types/course";

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSaveGrades: (grades: StudentGrade[]) => void;
}

const getCourseQuizCount = (course: Course | null) => {
  return Math.max(1, course?.quizCount || 1);
};

const getCourseHomeworkCount = (course: Course | null) => {
  return Math.max(1, course?.homeworkCount || 1);
};

const toScoreArray = (
  value: StudentGrade["quizzes"] | StudentGrade["homework"] | number | undefined,
  count: number
) => {
  if (Array.isArray(value)) {
    return Array.from({ length: count }, (_, idx) => value[idx]);
  }

  if (typeof value === "number") {
    const scores = Array.from({ length: count }, () => undefined as number | undefined);
    scores[0] = value;
    return scores;
  }

  return Array.from({ length: count }, () => undefined as number | undefined);
};

const calculateAverage = (grade: StudentGrade) => {
  const scores = [
    ...(grade.quizzes || []),
    grade.midterm,
    grade.final,
    ...(grade.homework || []),
  ].filter((score): score is number => score !== undefined);

  if (scores.length === 0) {
    return undefined;
  }

  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

const getInitialGrades = (course: Course | null): StudentGrade[] => {
  if (!course) {
    return [];
  }

  const quizCount = getCourseQuizCount(course);
  const homeworkCount = getCourseHomeworkCount(course);

  const sourceGrades: StudentGrade[] =
    course.grades.length > 0
      ? course.grades
      : course.students.map((student) => ({
        studentId: student.id,
        studentName: student.name,
        quizzes: [],
        homework: [],
      }));

  return sourceGrades.map((grade) => {
    const quizzes = toScoreArray(grade.quizzes, quizCount);
    const homework = toScoreArray(grade.homework, homeworkCount);
    const normalized = {
      ...grade,
      quizzes,
      homework,
    };

    return {
      ...normalized,
      averageGrade: calculateAverage(normalized),
    };
  });
};

export default function GradeModal({ isOpen, onClose, course, onSaveGrades }: GradeModalProps) {
  const [grades, setGrades] = useState<StudentGrade[]>([]);

  useEffect(() => {
    setGrades(getInitialGrades(course));
  }, [course]);

  const handleArrayGradeChange = (
    studentId: string,
    assignmentType: "quizzes" | "homework",
    index: number,
    value: string
  ) => {
    const numValue = value === "" ? undefined : Math.min(100, Math.max(0, Number(value)));

    setGrades((prevGrades) => {
      return prevGrades.map((grade) => {
        if (grade.studentId !== studentId) {
          return grade;
        }

        const scores = [...(grade[assignmentType] || [])];
        scores[index] = numValue;
        const updated = { ...grade, [assignmentType]: scores };

        return {
          ...updated,
          averageGrade: calculateAverage(updated),
        };
      });
    });
  };

  const handleSingleGradeChange = (
    studentId: string,
    assignmentType: "midterm" | "final",
    value: string
  ) => {
    const numValue = value === "" ? undefined : Math.min(100, Math.max(0, Number(value)));

    setGrades((prevGrades) => {
      return prevGrades.map((grade) => {
        if (grade.studentId !== studentId) {
          return grade;
        }

        const updated = { ...grade, [assignmentType]: numValue };
        return {
          ...updated,
          averageGrade: calculateAverage(updated),
        };
      });
    });
  };

  const handleSave = () => {
    onSaveGrades(grades);
    onClose();
  };

  if (!isOpen || !course) return null;

  const quizCount = getCourseQuizCount(course);
  const homeworkCount = getCourseHomeworkCount(course);

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
                {Array.from({ length: quizCount }, (_, idx) => (
                  <th
                    key={`quiz-${idx}`}
                    className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50"
                  >
                    {`Quiz ${idx + 1}`}
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50">Midterm</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50">Final</th>
                {Array.from({ length: homeworkCount }, (_, idx) => (
                  <th
                    key={`homework-${idx}`}
                    className="text-center px-4 py-3 font-semibold text-gray-900 bg-gray-50"
                  >
                    {`Homework ${idx + 1}`}
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
                  {Array.from({ length: quizCount }, (_, idx) => (
                    <td key={`quiz-input-${idx}`} className="text-center px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.quizzes?.[idx] ?? ""}
                        onChange={(e) =>
                          handleArrayGradeChange(grade.studentId, "quizzes", idx, e.target.value)
                        }
                        placeholder="0-100"
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                  <td className="text-center px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.midterm ?? ""}
                      onChange={(e) =>
                        handleSingleGradeChange(grade.studentId, "midterm", e.target.value)
                      }
                      placeholder="0-100"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="text-center px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.final ?? ""}
                      onChange={(e) =>
                        handleSingleGradeChange(grade.studentId, "final", e.target.value)
                      }
                      placeholder="0-100"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  {Array.from({ length: homeworkCount }, (_, idx) => (
                    <td key={`homework-input-${idx}`} className="text-center px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grade.homework?.[idx] ?? ""}
                        onChange={(e) =>
                          handleArrayGradeChange(grade.studentId, "homework", idx, e.target.value)
                        }
                        placeholder="0-100"
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                  <td className="text-center px-4 py-3 font-semibold text-blue-600">
                    {grade.averageGrade !== undefined ? grade.averageGrade.toFixed(2) : "-"}
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
