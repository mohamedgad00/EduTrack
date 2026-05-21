"use client";

import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  fetchDashboardStats,
  clearCreateUserError,
  clearUpdateUserError,
  clearDeleteUserError,
  clearGetUserError,
  clearUsersError,
  resetSelectedUser,
} from "@/redux/features/users/usersSlice";
import { CreateUserDto, UpdateUserDto, UserRole } from "@/types/user";
import { AppDispatch, RootState } from "@/redux/store";

/**
 * Hook to manage user list operations
 */
export const useUsersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    totalUsers,
    currentPage,
    pageSize,
    isLoadingUsers,
    usersError,
  } = useSelector<RootState, RootState["users"]>((state) => state.users);

  const fetchUsersList = useCallback(
    (
      params: {
        role?: UserRole;
        search?: string;
        page?: number;
        limit?: number;
      } = {},
    ) => {
      dispatch(fetchUsers(params));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearUsersError());
  }, [dispatch]);

  return {
    users,
    totalUsers,
    currentPage,
    pageSize,
    isLoading: isLoadingUsers,
    error: usersError,
    fetchUsersList,
    clearError,
  };
};

/**
 * Hook to manage single user operations
 */
export const useUserDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser, isLoadingUser, getUserError } = useSelector(
    (state: RootState) => state.users,
  );

  const getUser = useCallback(
    (id: string) => {
      dispatch(fetchUserById(id));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearGetUserError());
  }, [dispatch]);

  const resetUser = useCallback(() => {
    dispatch(resetSelectedUser());
  }, [dispatch]);

  return {
    user: selectedUser,
    isLoading: isLoadingUser,
    error: getUserError,
    getUser,
    clearError,
    resetUser,
  };
};

/**
 * Hook to manage user creation
 */
export const useCreateUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isCreating, createError } = useSelector(
    (state: RootState) => state.users,
  );

  const create = useCallback(
    (userData: CreateUserDto) => {
      dispatch(createUser(userData));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearCreateUserError());
  }, [dispatch]);

  return {
    isLoading: isCreating,
    error: createError,
    create,
    clearError,
  };
};

/**
 * Hook to manage user updates
 */
export const useUpdateUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isUpdating, updateError, updatingUserId } = useSelector(
    (state: RootState) => state.users,
  );

  const update = useCallback(
    (id: string, updateData: UpdateUserDto) => {
      dispatch(updateUser({ id, data: updateData }));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearUpdateUserError());
  }, [dispatch]);

  return {
    isLoading: isUpdating,
    error: updateError,
    updatingUserId,
    update,
    clearError,
  };
};

/**
 * Hook to manage user deletion
 */
export const useDeleteUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDeleting, deleteError, deletingUserId } = useSelector(
    (state: RootState) => state.users,
  );

  const remove = useCallback(
    (id: string) => {
      return dispatch(deleteUser(id));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearDeleteUserError());
  }, [dispatch]);

  return {
    isLoading: isDeleting,
    error: deleteError,
    deletingUserId,
    remove,
    clearError,
  };
};

/**
 * Hook to manage dashboard statistics
 */
export const useDashboardStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardStats, isLoadingStats, statsLoaded, statsError } =
    useSelector<RootState, RootState["users"]>((state) => state.users);

  const fetchStats = useCallback(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return {
    stats: dashboardStats,
    isLoading: isLoadingStats,
    isLoaded: statsLoaded,
    error: statsError,
    fetchStats,
  };
};

/**
 * Hook to manage all user operations (combined)
 */
export const useUsers = () => {
  const usersList = useUsersList();
  const userDetail = useUserDetail();
  const createUserOps = useCreateUser();
  const updateUserOps = useUpdateUser();
  const deleteUserOps = useDeleteUser();

  return {
    // List operations
    users: usersList.users,
    totalUsers: usersList.totalUsers,
    currentPage: usersList.currentPage,
    pageSize: usersList.pageSize,
    fetchUsersList: usersList.fetchUsersList,

    // Detail operations
    selectedUser: userDetail.user,
    getUser: userDetail.getUser,
    resetUser: userDetail.resetUser,

    // Create operations
    createUser: createUserOps.create,

    // Update operations
    updateUser: updateUserOps.update,

    // Delete operations
    deleteUser: deleteUserOps.remove,

    // Loading states
    isLoadingUsers: usersList.isLoading,
    isLoadingUser: userDetail.isLoading,
    isCreating: createUserOps.isLoading,
    isUpdating: updateUserOps.isLoading,
    isDeleting: deleteUserOps.isLoading,

    // Error states
    usersError: usersList.error,
    getUserError: userDetail.error,
    createError: createUserOps.error,
    updateError: updateUserOps.error,
    deleteError: deleteUserOps.error,

    // Clear errors
    clearUsersError: usersList.clearError,
    clearUserError: userDetail.clearError,
    clearCreateError: createUserOps.clearError,
    clearUpdateError: updateUserOps.clearError,
    clearDeleteError: deleteUserOps.clearError,

    updatingUserId: updateUserOps.updatingUserId,
    deletingUserId: deleteUserOps.deletingUserId,
  };
};
