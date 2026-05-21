// User roles enum
export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
  PARENT = "parent",
}

// Profile types for each role
export interface StudentProfile {
  id?: string;
  userId: string;
  dateOfBirth?: string;
  level?: string;
  classSection?: string;
  parentId?: string;
  enrollmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherProfile {
  id?: string;
  userId: string;
  specialty?: string;
  experience?: number;
  courseId?: string;
  hireDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentProfile {
  id?: string;
  userId: string;
  address?: string;
  children?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Main User type
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  gender?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: StudentProfile | TeacherProfile | ParentProfile | null;
}

// User Response DTO (from API)
export interface UserResponseDto {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
  profile?: StudentProfile | TeacherProfile | ParentProfile | null;
}

// Create User DTO
export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  gender?: string;
  // Student-specific fields
  dateOfBirth?: string;
  level?: string;
  classSection?: string;
  parentId?: string;
  enrollmentDate?: string;
  // Teacher-specific fields
  specialty?: string;
  experience?: number;
  courseId?: string;
  hireDate?: string;
  // Parent-specific fields
  address?: string;
}

// Update User DTO
export interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  gender?: string;
  // Student-specific fields
  dateOfBirth?: string;
  level?: string;
  classSection?: string;
  parentId?: string;
  enrollmentDate?: string;
  // Teacher-specific fields
  specialty?: string;
  experience?: number;
  courseId?: string;
  hireDate?: string;
  // Parent-specific fields
  address?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Paginated Users Response
export interface PaginatedUsersResponse {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}
