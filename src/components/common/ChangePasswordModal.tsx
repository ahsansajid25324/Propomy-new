import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { SubmitHandler } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../styles/Map.css";
import "../../styles/DashboardLayout.css";
import { ChangePassword } from "../../schemas/ProfileSetting";
import { LOGOUT_MUTATION } from "../../apollo/graphql/mutations/logout";
import { logout } from "../../features/auth/authSlice";
import { UPDATE_PASSWORD } from "../../apollo/graphql/mutations/ProfileSettings";
import type {
  UpdatePasswordResponse,
  UpdatePasswordVariables,
} from "../../types/ProfileSettings";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updatePassword, { loading }] = useMutation<
    UpdatePasswordResponse,
    UpdatePasswordVariables
  >(UPDATE_PASSWORD);

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: yupResolver(ChangePassword),
  });

  useEffect(() => {
    if (!open) {
      reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
    try {
      const { data: responseData } = await updatePassword({
        variables: {
          input: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        },
      });

      const result = responseData?.updatePassword;

      if (!result?.success) {
        toast.error(result?.message || "Password update failed.");
        return;
      }

      if (result.logoutRequired) {
        toast.info(result.message, {
          autoClose: 2000,
          onClose: () => {
            logoutMutation().catch(console.error);
            dispatch(logout());
            onClose();
            navigate("/login");
          },
        });
        return;
      }

      toast.success(result.message || "Password updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Network error occurred.");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card-settings">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <img src={logo} className="dashboard-logo" alt="Logo" />
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="setting-details-section">
          <h2 className="mb-4">Change Password</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column gap-3"
          >
            {/* Current Password */}
            <div className="form-group">
              <label className="form-label">Current Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showCurrent ? "text" : "password"}
                  className={`form-control no-browser-icon ${errors.currentPassword ? "is-invalid" : ""}`}
                  placeholder="Enter current password"
                  {...register("currentPassword")}
                />

                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? (
                    <AiFillEyeInvisible size={22} />
                  ) : (
                    <AiFillEye size={22} />
                  )}
                </button>
              </div>

              {errors.currentPassword && (
                <div className="invalid-feedback d-block">
                  {errors.currentPassword.message}
                </div>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  className={`form-control no-browser-icon ${errors.newPassword ? "is-invalid" : ""}`}
                  placeholder="Enter new password"
                  {...register("newPassword")}
                />

                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? (
                    <AiFillEyeInvisible size={22} />
                  ) : (
                    <AiFillEye size={22} />
                  )}
                </button>
              </div>

              {errors.newPassword && (
                <div className="invalid-feedback d-block">
                  {errors.newPassword.message}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`form-control no-browser-icon ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="Confirm new password"
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <AiFillEyeInvisible size={22} />
                  ) : (
                    <AiFillEye size={22} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <div className="invalid-feedback d-block">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
