import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { GET_USER_PROFILES } from "../apollo/graphql/queries/Admin";
import {
  UPDATE_USER_API_LIMIT,
  DELETE_USER,
} from "../apollo/graphql/mutations/Admin";
import { usePagination } from "./usePagination";
import { getAdminStats } from "../libs/constants/AdminStats";
import type {
  UserProfilesData,
  UserProfilesVars,
  UpdateUserApiLimitData,
  UpdateUserApiLimitVars,
  DeleteUserData,
  DeleteUserVars,
} from "../types/Admin";

const USERS_PER_PAGE = 10;

export interface TargetUser {
  id: string;
  name: string;
  apiLimit: number;
}

export interface UserProfileEdge {
  cursor: string;
  node: {
    id: string;
    __typename?: string;
  };
}

export const useAdminDashboard = () => {
  // 1. Pagination Setup
  const { currentPage, queryVariables, handlePageChange } =
    usePagination(USERS_PER_PAGE);

  const [userToDelete, setUserToDelete] = useState<TargetUser | null>(null);
  const [userToEdit, setUserToEdit] = useState<TargetUser | null>(null);

  const showDeleteModal = !!userToDelete;
  const showEditModal = !!userToEdit;

  const handleHideEditModal = useCallback(() => setUserToEdit(null), []);
  const handleHideDeleteModal = useCallback(() => setUserToDelete(null), []);

  // 3. Main Query
  const { data, loading: queryLoading } = useQuery<
    UserProfilesData,
    UserProfilesVars
  >(GET_USER_PROFILES, {
    variables: { pagination: queryVariables },
    fetchPolicy: "cache-and-network",
  });
  const [deleteUser, { loading: deleteLoading }] = useMutation<
    DeleteUserData,
    DeleteUserVars
  >(DELETE_USER, {
    refetchQueries: [
      {
        query: GET_USER_PROFILES,
        variables: { pagination: queryVariables },
      },
    ],
    onCompleted: async (mutationData) => {
      if (mutationData?.deleteUser?.success) {
        toast.success(mutationData.deleteUser.message ?? "User deleted.");
        handleHideDeleteModal();
      } else {
        toast.error(
          mutationData?.deleteUser?.message ?? "Failed to delete user.",
        );
      }
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
      toast.error(
        error.message ?? "An unexpected error occurred during deletion.",
      );
    },
  });
  const [updateApiLimit, { loading: mutationLoading }] = useMutation<
    UpdateUserApiLimitData,
    UpdateUserApiLimitVars
  >(UPDATE_USER_API_LIMIT, {
    update(cache, { data: mutationData }) {
      if (!mutationData?.updateUserApiLimit?.success) return;

      const { id, apiLimit } = mutationData.updateUserApiLimit;

      cache.modify({
        id: cache.identify({ __typename: "UserProfiles", id }),
        fields: {
          apiLimit: () => apiLimit,
        },
      });
    },
    onCompleted: (mutationData) => {
      if (mutationData?.updateUserApiLimit?.success) {
        toast.success(mutationData.updateUserApiLimit.message);
        handleHideEditModal();
      } else {
        toast.error(
          mutationData?.updateUserApiLimit?.message ??
            "Failed to update API limit.",
        );
      }
    },
    onError: (error) => {
      console.error("Update API limit mutation error:", error);
      toast.error(error.message ?? "An unexpected error occurred.");
    },
  });

  // 6. Action Handlers
  const handleDeleteClick = useCallback(
    (user: TargetUser) => setUserToDelete(user),
    [],
  );
  const handleEditClick = useCallback(
    (user: TargetUser) => setUserToEdit(user),
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!userToDelete?.id) return;
    deleteUser({ variables: { input: { targetUserId: userToDelete.id } } });
  }, [userToDelete, deleteUser]);

  const handleConfirmEdit = useCallback(
    (newLimit: number) => {
      if (!userToEdit?.id) return;
      updateApiLimit({
        variables: {
          input: { targetUserId: userToEdit.id, newApiLimit: newLimit },
        },
      });
    },
    [userToEdit, updateApiLimit],
  );

  // 7. Memoized & Synchronized Derived Values
  const totalCount = data?.userProfiles?.pageInfo?.totalCount ?? 0;

  const stats = useMemo(
    () =>
      getAdminStats({
        totalUsers: data?.userProfiles?.totalUsers,
        paidUsers: data?.userProfiles?.paidUsers,
      }),
    [data?.userProfiles?.totalUsers, data?.userProfiles?.paidUsers],
  );

  return {
    currentPage,
    totalCount,
    stats,
    isLoading: queryLoading && !data,
    edges: data?.userProfiles?.edges ?? [],
    showDeleteModal,
    userToDelete,
    showEditModal,
    userToEdit,
    deleteLoading,
    mutationLoading,
    handlePageChange,
    handleDeleteClick,
    handleEditClick,
    handleHideDeleteModal,
    handleHideEditModal,
    handleConfirmDelete,
    handleConfirmEdit,
  };
};
