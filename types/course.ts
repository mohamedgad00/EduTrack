export type AssignmentType = "Quizzes" | "Midterm" | "Final" | "Homework";
export type AttendanceStatus = "present" | "absent";

export interface StudentGrade {
  studentId: string;
  studentName: string;
  quizzes?: Array<number | undefined>;
  midterm?: number;
  final?: number;
  homework?: Array<number | undefined>;
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
  quizCount: number;
  homeworkCount: number;
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
  quizCount: number;
  homeworkCount: number;
}
