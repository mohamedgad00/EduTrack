import api from "./api";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  ApiResponse,
  PaginatedUsersResponse,
  UserRole,
} from "@/types/user";

/**
 * User API Service - Handles all user-related API calls
 */

export const userApi = {
  /**
   * Create a new user
   * @param userData - The user data to create
   * @returns The created user
   */
  async createUser(
    userData: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const response = await api.post<ApiResponse<UserResponseDto>>(
      "/users",
      userData,
    );
    return response.data;
  },

  /**
   * Get all users with optional filtering and pagination
   * @param role - Filter by user role (optional)
   * @param search - Search term for fullName, email, or username (optional)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Paginated list of users
   */
  async getUsers(
    role?: UserRole,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    const params: Record<string, unknown> = {
      page,
      limit,
    };

    if (role) {
      params.role = role;
    }

    if (search) {
      params.search = search;
    }

    const response = await api.get<ApiResponse<UserResponseDto[]>>("/users", {
      params,
    });
    return response.data;
  },

  /**
   * Get a user by ID
   * @param id - The user ID
   * @returns The user data
   */
  async getUserById(id: string): Promise<ApiResponse<UserResponseDto>> {
    const response = await api.get<ApiResponse<UserResponseDto>>(
      `/users/${id}`,
    );
    return response.data;
  },

  /**
   * Update a user
   * @param id - The user ID
   * @param updateData - The data to update
   * @returns The updated user
   */
  async updateUser(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const response = await api.put<ApiResponse<UserResponseDto>>(
      `/users/${id}`,
      updateData,
    );
    return response.data;
  },

  /**
   * Delete a user (soft delete)
   * @param id - The user ID
   * @returns Success response
   */
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Get all students
   * @param search - Search term (optional)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns List of students
   */
  async getStudents(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    return this.getUsers(UserRole.STUDENT, search, page, limit);
  },

  /**
   * Get all teachers
   * @param search - Search term (optional)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns List of teachers
   */
  async getTeachers(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    return this.getUsers(UserRole.TEACHER, search, page, limit);
  },

  /**
   * Get all parents
   * @param search - Search term (optional)
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns List of parents
   */
  async getParents(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    return this.getUsers(UserRole.PARENT, search, page, limit);
  },
};

export default userApi;
