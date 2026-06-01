export type AttendanceStatus = "present" | "absent";

export type AssessmentType = "quiz" | "homework" | "midterm" | "final";

export interface StudentAssessmentRecord {
  studentId: string;
  studentName: string;
  grade?: number;
  isPresent: boolean;
}

export interface CreateStudentAssessmentRecordPayload {
  studentId: string;
  grade?: number;
  isPresent: boolean;
}

export interface CreateCourseAssessmentPayload {
  type: AssessmentType;
  name: string;
  date: string;
  maxGrade: number;
  studentRecords: CreateStudentAssessmentRecordPayload[];
}

export interface CourseAssessment {
  id: string;
  type: AssessmentType;
  name: string;
  date: string;
  maxGrade: number;
  studentRecords: StudentAssessmentRecord[];
}

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

export interface UpdateCourseAttendanceItemPayload {
  studentId: string;
  attendance: Record<string, AttendanceStatus>;
}

export interface UpdateCourseAttendancePayload {
  items: UpdateCourseAttendanceItemPayload[];
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
  quizzes: CourseAssessment[];
  homeworks: CourseAssessment[];
  midtermExam: CourseAssessment | null;
  finalExam: CourseAssessment | null;
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
