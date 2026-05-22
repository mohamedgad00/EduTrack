import api from "./api";
import { Course, CreateCoursePayload } from "@/types/course";
import { ApiResponse } from "@/types/user";

type CourseApiEnvelope<T> = ApiResponse<T> | T;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapData<T>(payload: CourseApiEnvelope<T>): T {
  if (isRecord(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

function normalizeCourse(
  course: Partial<Course> & Record<string, unknown>,
): Course {
  const teacherRelation = isRecord(course.teacher) ? course.teacher : null;
  const teacherName =
    course.teacherName ||
    (teacherRelation && typeof teacherRelation.fullName === "string"
      ? teacherRelation.fullName
      : undefined) ||
    (teacherRelation && typeof teacherRelation.name === "string"
      ? teacherRelation.name
      : undefined) ||
    "";

  const students = Array.isArray(course.students)
    ? course.students.map((student) => {
        if (isRecord(student)) {
          const rawStudent = student as Record<string, unknown>;
          return {
            id: String(rawStudent.id ?? ""),
            name:
              typeof rawStudent.name === "string"
                ? rawStudent.name
                : typeof rawStudent.fullName === "string"
                  ? rawStudent.fullName
                  : "",
          };
        }

        return { id: "", name: "" };
      })
    : [];

  return {
    id: String(course.id ?? ""),
    name: String(course.name ?? ""),
    level: String(course.level ?? ""),
    class: String(course.class ?? ""),
    description: String(course.description ?? ""),
    teacherId: String(course.teacherId ?? ""),
    teacherName,
    studentIds: Array.isArray(course.studentIds)
      ? course.studentIds.map((studentId) => String(studentId))
      : [],
    students,
    createdAt: String(course.createdAt ?? new Date().toISOString()),
    updatedAt: String(course.updatedAt ?? new Date().toISOString()),
    quizzes: Array.isArray(course.quizzes)
      ? (course.quizzes as Course["quizzes"])
      : [],
    homeworks: Array.isArray(course.homeworks)
      ? (course.homeworks as Course["homeworks"])
      : [],
    midtermExam: (course.midtermExam as Course["midtermExam"]) ?? null,
    finalExam: (course.finalExam as Course["finalExam"]) ?? null,
    attendance: Array.isArray(course.attendance)
      ? (course.attendance as Course["attendance"])
      : [],
  };
}

function normalizeCourseList(payload: unknown): Course[] {
  if (Array.isArray(payload)) {
    return payload.map((item) =>
      normalizeCourse(item as Partial<Course> & Record<string, unknown>),
    );
  }

  if (isRecord(payload)) {
    if (Array.isArray(payload.data)) {
      return payload.data.map((item) =>
        normalizeCourse(item as Partial<Course> & Record<string, unknown>),
      );
    }

    if (Array.isArray(payload.items)) {
      return payload.items.map((item) =>
        normalizeCourse(item as Partial<Course> & Record<string, unknown>),
      );
    }
  }

  return [];
}

export const courseApi = {
  async getCourses(teacherId?: string): Promise<Course[]> {
    const response = await api.get<
      CourseApiEnvelope<Course[] | { data?: Course[]; items?: Course[] }>
    >("/courses", {
      params: teacherId ? { teacherId } : undefined,
    });
    return normalizeCourseList(unwrapData(response.data));
  },

  async createCourse(payload: CreateCoursePayload): Promise<Course> {
    const response = await api.post<CourseApiEnvelope<Course>>(
      "/courses",
      payload,
    );
    return normalizeCourse(
      unwrapData(response.data) as Partial<Course> & Record<string, unknown>,
    );
  },

  async updateCourse(
    courseId: string,
    payload: CreateCoursePayload,
  ): Promise<Course> {
    const response = await api.patch<CourseApiEnvelope<Course>>(
      `/courses/${courseId}`,
      payload,
    );
    return normalizeCourse(
      unwrapData(response.data) as Partial<Course> & Record<string, unknown>,
    );
  },

  async deleteCourse(courseId: string): Promise<void> {
    await api.delete(`/courses/${courseId}`);
  },
};
