import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CREATE_REALTOR_PROFILE } from "../../apollo/graphql/mutations/realtor.gql";
import type {
  RealtorProfileInput,
  RealtorProfileResponse,
} from "../../types/auth";
import { Form, Button } from "react-bootstrap";
import FormField from "../common/FormField";
import Select from "react-select";
import { useState, useEffect } from "react";
import type { MultiValue } from "react-select";
import type { RealtorDetailsFormData } from "../../schemas/realtorSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { realtorDetailsSchema } from "../../schemas/realtorSchema";
import "./../../styles/signup.css";
import "./../../App.css";
import logo from "../../assets/logo.png";

type OptionType = { label: string; value: string };

const licenseStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];
const clientFocusOptions = ["Buyers", "Sellers", "Investors", "Renters"];
const priceRanges = [
  "Under $250,000", "$250,000 – $400,000", "$400,000 – $600,000",
  "$600,000 – $800,000", "$800,000 – $1,000,000", "$1,000,000 – $1,500,000",
  "$1,500,000 – $2,000,000", "Over $2,000,000"
];
const propertyTypes = [
  "Single-Family Homes", "Condos", "Townhomes", "Duplex/Triplex/Quadplex (2–4 units)",
  "Small Multifamily (5–20 units)", "Luxury Homes", "New Construction", "Land"
];
const primaryMarketsOptions: OptionType[] = [
  { label: "Virginia – Northern VA", value: "Virginia – Northern VA" },
  { label: "Virginia – Richmond", value: "Virginia – Richmond" },
  { label: "Virginia – Hampton Roads", value: "Virginia – Hampton Roads" },
  { label: "Maryland – Montgomery County", value: "Maryland – Montgomery County" },
  { label: "Maryland – Prince George’s County", value: "Maryland – Prince George’s County" },
  { label: "Washington, DC", value: "Washington, DC" },
  { label: "Ohio – Columbus", value: "Ohio – Columbus" },
  { label: "Ohio – Cleveland", value: "Ohio – Cleveland" },
  { label: "Ohio – Cincinnati", value: "Ohio – Cincinnati" },
  { label: "Michigan – Detroit", value: "Michigan – Detroit" },
  { label: "Florida – Tampa", value: "Florida – Tampa" },
  { label: "Florida – Orlando", value: "Florida – Orlando" },
  { label: "Texas – Dallas–Fort Worth", value: "Texas – Dallas–Fort Worth" },
  { label: "Texas – Austin", value: "Texas – Austin" },
  { label: "National / Multiple States", value: "National / Multiple States" }
];

// Added the explicit onReset property callback type definition
const RealtorForm = ({
  onSuccess,
  onReset,
  auth0Id,
}: {
  onSuccess: (data: RealtorDetailsFormData) => void;
  onReset: () => void;
  auth0Id?: string;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(realtorDetailsSchema),
    defaultValues: {
      brokerageName: "",
      licenseNumber: "",
      licenseState: [],
      targetPropertyTypes: undefined,
      primaryMarketsServed: [],
      clientFocus: "",
      averagePriceRange: "",
      preferredPropertyTypes: [],
      activeListingsCount: undefined,
      yearsOfExperience: undefined,
    },
  });

  const [selectedTargetPropertyTypes, setSelectedTargetPropertyTypes] =
    useState<MultiValue<OptionType>>([]);
  const [selectedPrimaryMarkets, setSelectedPrimaryMarkets] = useState<
    MultiValue<OptionType>
  >([]);
  const [selectedPreferredPropertyTypes, setSelectedPreferredPropertyTypes] =
    useState<MultiValue<OptionType>>([]);

  useEffect(() => {
    setSelectedTargetPropertyTypes(
      (getValues("targetPropertyTypes") || [])
        .filter((v): v is string => typeof v === "string")
        .map((v) => ({ label: v, value: v })),
    );
    setSelectedPrimaryMarkets(
      (getValues("primaryMarketsServed") || [])
        .filter((v): v is string => typeof v === "string")
        .map((v) => ({ label: v, value: v })),
    );
    setSelectedPreferredPropertyTypes(
      (getValues("preferredPropertyTypes") || [])
        .filter((v): v is string => typeof v === "string")
        .map((v) => ({ label: v, value: v })),
    );
  }, [getValues]);

  const [createRealtorProfile, { loading }] = useMutation<
    { createRealtorProfile: RealtorProfileResponse },
    { input: RealtorProfileInput }
  >(CREATE_REALTOR_PROFILE);

  const handleRegistration = async (data: RealtorDetailsFormData) => {
    if (!auth0Id) {
      toast.error("User context missing. Restarting registration.");
      onReset();
      return;
    }
    try {
      const payload: RealtorProfileInput = {
        auth0Id,
        brokerageName: data.brokerageName,
        licenseNumber: data.licenseNumber,
        licenseState: Array.isArray(data.licenseState)
          ? data.licenseState.filter((v): v is string => typeof v === "string")
          : [],
        yearsOfExperience: data.yearsOfExperience,
        primaryMarketsServed: Array.isArray(data.primaryMarketsServed)
          ? data.primaryMarketsServed.filter(
              (v): v is string => typeof v === "string",
            )
          : [],
        targetPropertyTypes: Array.isArray(data.targetPropertyTypes)
          ? data.targetPropertyTypes.filter(
              (v): v is string => typeof v === "string",
            )
          : undefined,
        clientFocus: data.clientFocus,
        averagePriceRange: data.averagePriceRange,
        preferredPropertyTypes: Array.isArray(data.preferredPropertyTypes)
          ? data.preferredPropertyTypes.filter(
              (v): v is string => typeof v === "string",
            )
          : undefined,
        activeListingsCount: data.activeListingsCount,
      };

      const { data: res } = await createRealtorProfile({
        variables: { input: payload },
      });

      if (!res || !res.createRealtorProfile) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (res.createRealtorProfile.success) {
        if (res.createRealtorProfile.message)
          toast.success(res.createRealtorProfile.message);
        setTimeout(() => onSuccess(data), 1000);
      } else {
        toast.error(res.createRealtorProfile.message);
        
        // Safety Reset if backend context says user wasn't initialized cleanly
        if (res.createRealtorProfile.message.toLowerCase().includes("user not found")) {
          onReset();
        }
      }
    } catch (error: unknown) {
      console.error("Realtor profile error:", error);
      if (error instanceof Error && error.message) {
        toast.error(error.message);
        
        // Safety Reset on hard Apollo GraphQL errors or broken database entities
        if (error.message.toLowerCase().includes("not found")) {
          onReset();
        }
      }
    }
  };

  return (
    <div className="formGeneric-contianer">
      <img src={logo} alt="Logo" className="formGeneric-logo" />
      <h2 className="formGeneric-title">Realtor Registration</h2>
      <p className="formGeneric-subtitle">
        Provide a few more details so Propomy can personalize your experience
      </p>

      <Form
        onSubmit={handleSubmit(handleRegistration)}
        className="formGeneric-form "
      >
        <div className="formGeneric-row">
          <div className="formGeneric-col">
            <FormField
              controlId="brokerageName"
              label="Brokerage Name"
              required
              error={errors.brokerageName?.message}
            >
              <Form.Control
                type="text"
                placeholder="Enter brokerage name"
                {...register("brokerageName")}
                className="custom-input"
                isInvalid={!!errors.brokerageName}
              />
            </FormField>
          </div>
          <div className="formGeneric-col phone-col">
            <FormField
              controlId="licenseNumber"
              label="License Number"
              required
              error={errors.licenseNumber?.message}
            >
              <Form.Control
                type="text"
                placeholder="Enter license number"
                {...register("licenseNumber")}
                className="custom-input"
                isInvalid={!!errors.licenseNumber}
              />
            </FormField>
          </div>
        </div>

        <div className="formGeneric-row mt-3">
          <div className="formGeneric-col">
            <FormField
              controlId="licenseState"
              label="License State(s)"
              required
              error={errors.licenseState?.message}
            >
              <Select
                classNamePrefix="react-select"
                isMulti
                options={licenseStates.map((state) => ({
                  label: state,
                  value: state,
                }))}
                value={(getValues("licenseState") || []).map((v: string) => ({
                  label: v,
                  value: v,
                }))}
                onChange={(selected) => {
                  const values = (selected as OptionType[]).map((s) => s.value);
                  setValue("licenseState", values, { shouldValidate: true });
                }}
                placeholder="Select state(s)..."
              />
            </FormField>
          </div>
          <div className="formGeneric-col phone-col">
            <FormField
              controlId="yearsOfExperience"
              label="Years of Experience"
              required
              error={errors.yearsOfExperience?.message}
            >
              <Form.Select
                {...register("yearsOfExperience")}
                className="custom-select"
                isInvalid={!!errors.yearsOfExperience}
              >
                <option value="">Select years of experience</option>
                <option value="0–1 years">0–1 years</option>
                <option value="1–3 years">1–3 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="5–10 years">5–10 years</option>
                <option value="10+ years">10+ years</option>
              </Form.Select>
            </FormField>
          </div>
        </div>

        <div className="formGeneric-row mt-3">
          <div className="formGeneric-col">
            <FormField
              controlId="primaryMarketsServed"
              label="Primary Market(s) Served"
              error={errors.primaryMarketsServed?.message}
            >
              <Select
                classNamePrefix="react-select"
                isMulti
                options={primaryMarketsOptions}
                value={selectedPrimaryMarkets}
                onChange={(selected) => {
                  const values = (selected as OptionType[]).map((s) => s.value);
                  setSelectedPrimaryMarkets(selected as MultiValue<OptionType>);
                  setValue("primaryMarketsServed", values, {
                    shouldValidate: true,
                  });
                }}
                placeholder="Select market(s)..."
              />
            </FormField>
          </div>
          <div className="formGeneric-col phone-col">
            <FormField
              controlId="targetPropertyTypes"
              label="Target Property Types (Optional)"
              error={errors.targetPropertyTypes?.message}
            >
              <Select
                classNamePrefix="react-select"
                isMulti
                options={propertyTypes.map((t) => ({ label: t, value: t }))}
                value={selectedTargetPropertyTypes}
                onChange={(selected) => {
                  const values = (selected as OptionType[]).map((s) => s.value);
                  setSelectedTargetPropertyTypes(
                    selected as MultiValue<OptionType>,
                  );
                  setValue("targetPropertyTypes", values);
                }}
                placeholder="Select property types..."
              />
            </FormField>
          </div>
        </div>

        <div className="formGeneric-row mt-3">
          <div className="formGeneric-col">
            <FormField
              controlId="clientFocus"
              label="Client Focus"
              required
              error={errors.clientFocus?.message}
            >
              <Form.Select
                {...register("clientFocus")}
                className="custom-select"
                isInvalid={!!errors.clientFocus}
              >
                <option value="">Select Focus</option>
                {clientFocusOptions.map((focus) => (
                  <option key={focus}>{focus}</option>
                ))}
              </Form.Select>
            </FormField>
          </div>
          <div className="formGeneric-col phone-col">
            <FormField
              controlId="averagePriceRange"
              label="Average Property Price Range"
              required
              error={errors.averagePriceRange?.message}
            >
              <Form.Select
                {...register("averagePriceRange")}
                className="custom-select"
                isInvalid={!!errors.averagePriceRange}
              >
                <option value="">Select Range</option>
                {priceRanges.map((range) => (
                  <option key={range}>{range}</option>
                ))}
              </Form.Select>
            </FormField>
          </div>
        </div>

        <div className="formGeneric-row mt-3">
          <div className="formGeneric-col">
            <FormField
              controlId="preferredPropertyTypes"
              label="Preferred Property Types"
              error={errors.preferredPropertyTypes?.message}
            >
              <Select
                classNamePrefix="react-select"
                isMulti
                options={propertyTypes.map((t) => ({ label: t, value: t }))}
                value={selectedPreferredPropertyTypes}
                onChange={(selected) => {
                  const values = (selected as OptionType[]).map((s) => s.value);
                  setSelectedPreferredPropertyTypes(
                    selected as MultiValue<OptionType>,
                  );
                  setValue("preferredPropertyTypes", values, {
                    shouldValidate: true,
                  });
                }}
                placeholder="Select preferred types..."
              />
            </FormField>
          </div>
          <div className="formGeneric-col phone-col">
            <FormField
              controlId="activeListingsCount"
              label="Active Listings Count"
              error={errors.activeListingsCount?.message}
            >
              <Form.Control
                type="number"
                placeholder="Enter count"
                {...register("activeListingsCount")}
                className="custom-input"
                isInvalid={!!errors.activeListingsCount}
              />
            </FormField>
          </div>
        </div>

        <div className="d-flex flex-direction-row align-items-center justify-content-between mt-3">
          <div></div>

          <div>
            <Button type="submit" className="btn-custom" disabled={loading}>
              {loading ? "Saving Profile..." : "Complete Registration"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default RealtorForm;