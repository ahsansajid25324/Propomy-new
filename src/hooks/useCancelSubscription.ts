import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { CANCEL_SUBSCRIPTION } from "../apollo/graphql/mutations/signup.gql";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/auth/authSlice";

interface CancelSubscriptionResponse {
  cancelSubscription: {
    success: boolean;
    message: string;
  };
}

export const useCancelSubscription = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [cancelSubscription] =
    useMutation<CancelSubscriptionResponse>(CANCEL_SUBSCRIPTION);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const confirmCancel = async () => {
    setLoading(true);
    try {
      const { data } = await cancelSubscription();
      if (data?.cancelSubscription.success) {
        toast.success(data.cancelSubscription.message);

        dispatch(
          updateUser({
            cancelAtPeriodEnd: true,
          }),
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        toast.error(err.message || "Failed to cancel subscription");
      }
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return { showModal, openModal, closeModal, confirmCancel, loading };
};
