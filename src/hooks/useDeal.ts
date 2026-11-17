import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { getDealStats } from "../libs/constants/DealStats";
import { GET_MY_DEALS } from "../apollo/graphql/queries/Deal";
import {
  DELETE_DEAL,
  UPDATE_DEAL_STATUS_MUTATION,
} from "../apollo/graphql/mutations/Deal";
import type {
  DealNode,
  MyDealsData,
  DeleteDealData,
  DeleteDealVars,
  UpdateDealMutationResponse,
} from "../types/Deal";

export const DEALS_PER_PAGE = 10;

export const useDeals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<DealNode | null>(null);
  const [dealToDelete, setDealToDelete] = useState<DealNode | null>(null);

  const showDeleteModal = !!dealToDelete;
  const handleHideDeleteModal = useCallback(() => setDealToDelete(null), []);

  const queryVariables = {
    pagination: {
      limit: DEALS_PER_PAGE,
      offset: (currentPage - 1) * DEALS_PER_PAGE,
    },
  };

  const { data, previousData, loading, error, refetch } = useQuery<MyDealsData>(
    GET_MY_DEALS,
    {
      variables: queryVariables,
      fetchPolicy: "cache-and-network",
    },
  );

  const [deleteDeal, { loading: deleteLoading }] = useMutation<
    DeleteDealData,
    DeleteDealVars
  >(DELETE_DEAL, {
    refetchQueries: [{ query: GET_MY_DEALS, variables: queryVariables }],
    onCompleted: (mutationData) => {
      if (mutationData?.deleteDeal?.success) {
        toast.success(mutationData.deleteDeal.message ?? "Deal deleted.");
        handleHideDeleteModal();
      } else {
        toast.error(
          mutationData?.deleteDeal?.message ?? "Failed to delete deal.",
        );
      }
    },
    onError: (error) => {
      console.error("Delete deal mutation error:", error);
      toast.error(
        error.message ?? "An unexpected error occurred during deletion.",
      );
    },
  });

  const handleDeleteClick = useCallback(
    (deal: DealNode) => setDealToDelete(deal),
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!dealToDelete?.id) return;
    deleteDeal({ variables: { id: dealToDelete.id } });
  }, [dealToDelete, deleteDeal]);

  const connection = (data ?? previousData)?.myDeals;
  const edges = connection?.edges ?? [];
  const totalCount = connection?.pageInfo.totalCount ?? 0;

  const stats = useMemo(
    () =>
      getDealStats({
        activeDealsCount: connection?.activeDealsCount ?? 0,
        underContractDealsCount: connection?.underContractDealsCount ?? 0,
        activePipelineValue: connection?.activePipelineValue ?? 0,
        closedDealsCount: connection?.closedDealsCount ?? 0,
      }),
    [connection],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOpenModal = useCallback(() => setShowAddModal(true), []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setDealToEdit(null);
  }, []);

  const handleDealSaved = useCallback(() => {
    setShowAddModal(false);
    setDealToEdit(null);
    setCurrentPage(1);
  }, []);

  const handleOpenEditModal = useCallback((deal: DealNode) => {
    setDealToEdit(deal);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setDealToEdit(null);
  }, []);

  const handleEditSaved = useCallback(() => {
    setDealToEdit(null);
  }, []);

  const [updateDealStatus] = useMutation<
    UpdateDealMutationResponse,
    { id: string; input: { status: string } }
  >(UPDATE_DEAL_STATUS_MUTATION, {
    refetchQueries: [{ query: GET_MY_DEALS, variables: queryVariables }],
    onCompleted: (data) => {
      if (data?.updateDeal?.success) {
        toast.success("Deal status updated!");
      } else {
        toast.error(data?.updateDeal?.message ?? "Failed to update status.");
      }
    },
    onError: (error) => {
      toast.error(error.message ?? "Error updating deal status.");
    },
  });

  const handleStatusChange = useCallback(
    (id: string, newStatus: string) => {
      return updateDealStatus({
        variables: {
          id,
          input: { status: newStatus },
        },
      });
    },
    [updateDealStatus],
  );
  return {
    currentPage,
    totalCount,
    stats,
    isLoading: loading && !data && !previousData,
    error,
    edges,
    showAddModal,
    dealToEdit,
    handleStatusChange,
    dealToDelete,
    showDeleteModal,
    deleteLoading,
    handlePageChange,
    handleOpenModal,
    handleCloseModal,
    handleDealSaved,
    handleDeleteClick,
    handleConfirmDelete,
    handleHideDeleteModal,
    refetch,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditSaved,
  };
};
