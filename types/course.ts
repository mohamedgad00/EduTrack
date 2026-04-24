export type AssignmentType = "Quizzes" | "Midterm" | "Final" | "Homework";
export type AttendanceStatus = "present" | "absent";

export interface StudentGrade {
  studentId: string;
  studentName: string;
  quizzes?: number;
  midterm?: number;
  final?: number;
  homework?: number;
  averageGrade?: number;
}

export interface StudentAttendance {
  studentId: string;
  studentName: string;
  attendance: Record<string, AttendanceStatus>;
  totalPresent: number;
  totalAbsent: number;
  attendancePercentage: number;
}

export interface Course {
  id: string;
  name: string;
  level: string;
  class: string;
  description: string;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  students: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
  grades: StudentGrade[];
  attendance: StudentAttendance[];
}

export interface CreateCoursePayload {
  name: string;
  level: string;
  class: string;
  description: string;
  teacherId: string;
  studentIds: string[];
}
