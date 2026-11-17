import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import "../../styles/Map.css";
import "../../styles/DashboardLayout.css";
import type { RootState } from "../../store/store";
import { ProfileSetting } from "../../schemas/ProfileSetting";
import { UPDATE_PROFILE } from "../../apollo/graphql/mutations/ProfileSettings";
import { LOGOUT_MUTATION } from "../../apollo/graphql/mutations/logout";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { updateUser, logout } from "../../features/auth/authSlice";
import type {
  UpdateProfileResponse,
  UpdateProfileVariables,
  ProfileFormValues,
} from "../../types/ProfileSettings";
import { useNavigate } from "react-router-dom";

interface ProfileSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({
  open,
  onClose,
}: ProfileSettingsModalProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updateProfile, { loading, error }] = useMutation<
    UpdateProfileResponse,
    UpdateProfileVariables
  >(UPDATE_PROFILE);

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(ProfileSetting),
  });

  useEffect(() => {
    if (open && user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    } else if (!open) {
      reset({ firstName: "", lastName: "", email: "" });
    }
  }, [open, user, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      const { data: responseData } = await updateProfile({
        variables: { input: { ...data } },
      });

      const result = responseData?.updateProfile;

      if (!result?.success) {
        toast.error(result?.message || "Update failed. Please try again.");
        return;
      }

      if (result.logoutRequired) {
        toast.info(
          "Email updated. Logging out for security. Please verify it through email",
          {
            autoClose: 2000,
            onClose: () => {
              logoutMutation().catch(console.error);
              dispatch(logout());
              onClose();
              navigate("/login");
            },
          },
        );
        return;
      }

      dispatch(updateUser({ ...data }));
      toast.success(result.message || "Profile updated!");
      onClose();
    } catch (err) {
      toast.error("A network error occurred.");
      console.error("Submission error:", err);
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
          <h2 className="mb-4">Profile Settings</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column gap-3"
          >
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                placeholder="Enter first name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <div className="invalid-feedback">
                  {errors.firstName.message}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                placeholder="Enter last name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <div className="invalid-feedback">
                  {errors.lastName.message}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="example@mail.com"
                {...register("email")}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-2">
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
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {error && (
              <div className="text-danger mt-2">
                Error updating profile. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
