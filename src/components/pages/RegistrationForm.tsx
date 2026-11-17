import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../common/FormField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import "./../../styles/signup.css";
import "../../App.css";
import logo from "../../assets/logo.png";
import { signupSchema } from "../../schemas/signupSchem";
import type { SignupFormData } from "../../schemas/signupSchem";
import { Link } from "react-router-dom";

import { SIGNUP_MUTATION } from "../../apollo/graphql/mutations/signup.gql";
import { useMutation } from "@apollo/client/react";
import type { SignupFormDataInput, SignupResponse } from "../../types/auth";

const roles = ["Investor"];

const RegistrationForm = ({
  onSuccess,
}: {
  onSuccess: (data: SignupFormData, auth0Id?: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: undefined,
      role: "",
      country: "",
      state: "",
      heardAbout: undefined,
      terms: true,
    },
  });

  const country = watch("country");
  const state = watch("state");

  const [signup, { loading }] = useMutation<
    { signup: SignupResponse },
    { input: SignupFormDataInput }
  >(SIGNUP_MUTATION);

  const handleRegistration = async (data: SignupFormData) => {
    try {
      const payload: SignupFormDataInput = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || null,
        country: data.country,
        state: data.state,
        heardAbout: data.heardAbout || null,
        role: data.role.trim().toLowerCase(),
      };

      const { data: res } = await signup({
        variables: { input: payload },
      });

      if (!res || !res.signup) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (res.signup.success) {
        if (res.signup.message) toast.success(res.signup.message);
        setTimeout(() => onSuccess(data, res.signup.user?.user_id), 1000);
      } else {
        toast.error(res.signup.message);
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <div className="formGeneric-contianer">
        <img src={logo} alt="Logo" className="formGeneric-logo" />
        <h2 className="formGeneric-title">Create your Propomy account</h2>
        <p className="formGeneric-subtitle ">
          Account Setup - complete the universal information below
        </p>

        <Form
          className="formGeneric-form gap-3"
          onSubmit={handleSubmit(handleRegistration)}
        >
          <div className="formGeneric-row">
            <div className="formGeneric-col">
              <FormField
                controlId="firstName"
                label="First Name"
                required
                error={errors.firstName?.message}
              >
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  {...register("firstName")}
                  isInvalid={!!errors.firstName}
                  className="custom-input"
                />
              </FormField>
            </div>
            <div className="formGeneric-col">
              <FormField
                controlId="lastName"
                label="Last Name"
                required
                error={errors.lastName?.message}
              >
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  {...register("lastName")}
                  isInvalid={!!errors.lastName}
                  className="custom-input"
                />
              </FormField>
            </div>
          </div>
          <div className="formGeneric-row">
            <div className="formGeneric-col phone-col">
              <FormField
                controlId="email"
                label="Email Address"
                required
                error={errors.email?.message}
              >
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  {...register("email")}
                  className="custom-input"
                  isInvalid={!!errors.email}
                />
              </FormField>
            </div>
            <div className="formGeneric-col">
              <FormField
                controlId="password"
                label="Password"
                required
                error={errors.password?.message}
              >
                <Form.Control
                  type="password"
                  className="custom-input"
                  placeholder="Enter password"
                  {...register("password")}
                  isInvalid={!!errors.password}
                />
              </FormField>
            </div>
          </div>
          <div className="formGeneric-row">
            <div className="formGeneric-col phone-col">
              <FormField
                controlId="phone"
                label="Phone (Optional)"
                error={errors.phone?.message}
              >
                <PhoneInput
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  countries={["US", "CA"]}
                  value={watch("phone") ?? undefined}
                  onChange={(value) => setValue("phone", value)}
                  className="custom-phone-input"
                />
              </FormField>
            </div>
            <div className="formGeneric-col">
              <FormField
                controlId="country"
                label="Country"
                required
                error={errors.country?.message}
              >
                <CountryDropdown
                  value={country}
                  onChange={(val) =>
                    setValue("country", val, { shouldValidate: true })
                  }
                  className="form-select custom-select"
                  whitelist={["US", "CA"]}
                />
              </FormField>
            </div>
          </div>

          <div className="formGeneric-row">
            <div className="formGeneric-col phone-col">
              <FormField
                controlId="state"
                label="State / Region"
                required
                error={errors.state?.message}
              >
                <RegionDropdown
                  country={country}
                  value={state}
                  className="form-select custom-select"
                  onChange={(val) =>
                    setValue("state", val, { shouldValidate: true })
                  }
                  disableWhenEmpty={true}
                />
              </FormField>
            </div>
            <div className="formGeneric-col">
              <FormField
                controlId="role"
                label="Role"
                required
                error={errors.role?.message}
              >
                <Form.Select
                  {...register("role")}
                  className="custom-select"
                  isInvalid={!!errors.role}
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              </FormField>
            </div>
          </div>

          <FormField
            controlId="heardAbout"
            label="How did you hear about us? (optional)"
          >
            <Form.Select className="custom-select" {...register("heardAbout")}>
              <option value="">Select an option</option>
              <option value="Google Search">Google Search</option>
              <option value="Social Media (Instagram / TikTok / Facebook / LinkedIn)">
                Social Media (Instagram / TikTok / Facebook / LinkedIn)
              </option>
              <option value="Realtor/Agent Referral">
                Realtor/Agent Referral
              </option>
              <option value="Investor Referral">Investor Referral</option>
              <option value="BiggerPockets">BiggerPockets</option>
              <option value="Email Outreach">Email Outreach</option>
              <option value="YouTube / Podcast">YouTube / Podcast</option>
              <option value="Online Ads">Online Ads</option>
              <option value="Friend / Family Referral">
                Friend / Family Referral
              </option>
              <option value="Other">Other</option>
            </Form.Select>
          </FormField>

          <div className="d-flex flex-direction-row align-items-center justify-content-between">
            <div>
              <Form.Group controlId="terms">
                <Form.Check
                  type="checkbox"
                  label={
                    <span style={{ fontSize: "0.9em" }}>
                      I agree to the <a href="#">Terms of Service</a>
                    </span>
                  }
                  {...register("terms")}
                  isInvalid={!!errors.terms}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.terms?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div>
              <Button type="submit" className="btn-custom" disabled={loading}>
                {loading ? "Creating Account..." : "Continue to Role Details"}
              </Button>
            </div>
          </div>
        </Form>

        <div className="formGeneric-footer fw-light text-center text-16">
          Already have an account?{" "}
          <Link className="formGeneric-signin" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
