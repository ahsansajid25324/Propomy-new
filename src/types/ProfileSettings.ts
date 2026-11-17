export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateProfileResponse {
  updateProfile: {
    success: boolean;
    message: string;
    logoutRequired?: boolean;
  };
}

export interface UpdateProfileVariables {
  input: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  updatePassword: {
    success: boolean;
    message: string;
    logoutRequired: boolean;
  };
}

export interface UpdatePasswordVariables {
  input: UpdatePasswordInput;
}
