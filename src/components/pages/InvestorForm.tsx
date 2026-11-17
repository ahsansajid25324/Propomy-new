import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CREATE_INVESTOR_PROFILE } from "../../apollo/graphql/mutations/investor.gql";
import type {
  InvestorProfileInput,
  InvestorProfileResponse,
} from "../../types/auth";
import { Form, Button } from "react-bootstrap";
import FormField from "../common/FormField";
import Select from "react-select";
import { useState, useEffect } from "react";
import type { MultiValue } from "react-select";
import type { InvestorDetailsFormData } from "../../schemas/investorSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { detailsSchema } from "../../schemas/investorSchema";
import "./../../styles/signup.css";
import "./../../App.css";
import logo from "../../assets/logo.png";

type OptionType = { label: string; value: string };

const investorTypes = ["Individual", "Group", "LLC", "Fund"];
const experienceLevels = [
  "Beginner Investor",
  "Intermediate Investor",
  "Advanced / Full-Time Investor",
];
const investmentStrategies = [
  "Buy & Hold – Cash-Flow Focused",
  "Buy & Hold – Appreciation Focused",
  "BRRRR Strategy",
  "Fix & Flip",
  "Short-Term Rentals (Airbnb/VRBO)",
  "Mid-Term Rentals (Travel nurse, corporate)",
  "Section-8 / Subsidized Housing",
  "Multifamily (2–4 units)",
  "Small Apartments (5–20 units)",
];
const targetPropertyTypes = [
  "Single-Family",
  "Multi-Family",
  "Condo",
  "Commercial",
  "Land",
];
const budgetRanges = ["$50K–$150K", "$150K–$300K", "$300K–$500K", "$500K+"];

const targetMarketOptions: OptionType[] = [
  {
    label: "Local Market (Investing near where I live)",
    value: "Local Market",
  },
  { label: "Out-of-State Markets", value: "Out-of-State Markets" },
  { label: "Nationwide (Open to multiple markets)", value: "Nationwide" },
];

const desiredROIOptions: OptionType[] = [
  { label: "4–6%", value: "4–6%" },
  { label: "6–8%", value: "6–8%" },
  { label: "8–10%", value: "8–10%" },
  { label: "10–12%", value: "10–12%" },
  { label: "12–15%", value: "12–15%" },
  { label: "15%+", value: "15%+" },
  { label: "Not Sure", value: "Not Sure" },
];

const InvestorForm = ({
  onSuccess,
  onReset,
  auth0Id,
}: {
  onSuccess: (data: InvestorDetailsFormData) => void;
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
    resolver: yupResolver(detailsSchema),
    defaultValues: {
      investorType: "",
      experienceLevel: "",
      investmentStrategy: [],
      targetMarkets: undefined,
      targetPropertyType: [],
      budgetRange: undefined,
      desiredROI: undefined,
      propertiesOwned: undefined,
      collaborateWithRealtors: false,
    },
  });

  const [selectedStrategies, setSelectedStrategies] = useState<
    MultiValue<OptionType>
  >([]);
  const [selectedMarkets, setSelectedMarkets] = useState<
    MultiValue<OptionType>
  >([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<
    MultiValue<OptionType>
  >([]);

  useEffect(() => {
    setSelectedStrategies(
      (getValues("investmentStrategy") || []).map((v: string) => ({
        label: v,
        value: v,
      })),
    );
    setSelectedMarkets(
      (getValues("targetMarkets") || [])
        .filter((v): v is string => typeof v === "string")
        .map((v) => ({ label: v, value: v })),
    );
    setSelectedPropertyTypes(
      (getValues("targetPropertyType") || []).map((v: string) => ({
        label: v,
        value: v,
      })),
    );
  }, [getValues]);

  const [createInvestorProfile, { loading }] = useMutation<
    { createInvestorProfile: InvestorProfileResponse },
    { input: InvestorProfileInput }
  >(CREATE_INVESTOR_PROFILE);

  const handleRegistration = async (data: InvestorDetailsFormData) => {
    if (!auth0Id) {
      toast.error("User context missing. Restarting registration.");
      onReset();
      return;
    }
    try {
      const payload: InvestorProfileInput = {
        auth0Id,
        investorType: data.investorType,
        experienceLevel: data.experienceLevel,
        investmentStrategy: data.investmentStrategy,
        targetMarkets: Array.isArray(data.targetMarkets)
          ? data.targetMarkets.filter((v): v is string => typeof v === "string")
          : undefined,
        targetPropertyType: Array.isArray(data.targetPropertyType)
          ? data.targetPropertyType.filter(
              (v): v is string => typeof v === "string",
            )
          : [],
        budgetRange: data.budgetRange,
        desiredROI: data.desiredROI,
        propertiesOwned: data.propertiesOwned,
        collaborateWithRealtors: data.collaborateWithRealtors,
      };

      const { data: res } = await createInvestorProfile({
        variables: { input: payload },
      });

      if (!res || !res.createInvestorProfile) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (res.createInvestorProfile.success) {
        if (res.createInvestorProfile.message)
          toast.success(res.createInvestorProfile.message);
        setTimeout(() => onSuccess(data), 1000);
      } else {
        toast.error(res.createInvestorProfile.message);
        
        if (res.createInvestorProfile.message.toLowerCase().includes("user not found")) {
          onReset();
        }
      }
    } catch (error: unknown) {
      console.error("Investor profile error:", error);
      if (error instanceof Error && error.message) {
        toast.error(error.message);
        
        if (error.message.toLowerCase().includes("not found")) {
          onReset();
        }
      }
    }
  };

  return (
    <div className="formGeneric-contianer">
      <img src={logo} alt="Logo" className="formGeneric-logo" />
      <h2 className="formGeneric-title">Investor Registration</h2>
      <p className="formGeneric-subtitle">
        Provide a few more details so Propomy can personalize your experience
      </p>

      <Form
        onSubmit={handleSubmit(handleRegistration)}
        className="formGeneric-form gap-3"
      >
        <div className="formGeneric-row ">
          <div className="formGeneric-col">
            <FormField
              controlId="investorType"
              label="Investor Type"
              required
              error={errors.investorType?.message}
            >
              <Form.Select
                {...register("investorType")}
                className="custom-select"
                isInvalid={!!errors.investorType}
              >
                <option value="">Select type</option>
                {investorTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Form.Select>
            </FormField>
          </div>

          <div className="formGeneric-col phone-col">
            <FormField
              controlId="experienceLevel"
              label="Experience Level"
              required
              error={errors.experienceLevel?.message}
            >
              <Form.Select
                {...register("experienceLevel")}
                className="custom-select"
                isInvalid={!!errors.experienceLevel}
              >
                <option value="">Select level</option>
                {experienceLevels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </Form.Select>
            </FormField>
          </div>
        </div>

        {/* Investment Strategy */}
        <div className="formGeneric-row ">
          <div className="formGeneric-col">
            <FormField
              controlId="investmentStrategy"
              label="Investment Strategy"
              required
              error={errors.investmentStrategy?.message}
            >
              <Select
                classNamePrefix="react-select"
                isMulti
                options={investmentStrategies.map((s) => ({
                  label: s,
                  value: s,
                }))}
                value={selectedStrategies}
                onChange={(selected) => {
                  const values = (selected as OptionType[]).map((s) => s.value);
                  setSelectedStrategies(selected as MultiValue<OptionType>);
                  setValue("investmentStrategy", values, {
                    shouldValidate: true,
                  });
                }}
                placeholder="Select strategies..."
              />
            </FormField>
          </div>
        </div>

        <div className="formGeneric-row ">
          {/* Target Markets */}
          <div className="formGeneric-col">
            <FormField
              controlId="targetMarkets"
              label="Target Markets (Optional)"
            >
              <Select
                classNamePrefix="react-select"
                isMulti
                options={targetMarketOptions}
                value={selectedMarkets}
                onChange={(selected) => {
                  const values = (selected as OptionType[]).map((s) => s.value);
                  setSelectedMarkets(selected as MultiValue<OptionType>);
                  setValue("targetMarkets", values);
                }}
                placeholder="Select cities or ZIP codes..."
              />
            </FormField>
          </div>

          <div className="formGeneric-col phone-col">
            <FormField
              controlId="targetPropertyType"
              label="Target Property Type"
              required
              error={errors.targetPropertyType?.message}
            >
              <Select
                classNamePrefix="react-select"
                isMulti
                options={targetPropertyTypes.map((t) => ({
                  label: t,
                  value: t,
                }))}
                value={selectedPropertyTypes}
                onChange={(selected) => {
                  const values = (selected as OptionType[]).map((s) => s.value);
                  setSelectedPropertyTypes(selected as MultiValue<OptionType>);
                  setValue("targetPropertyType", values, {
                    shouldValidate: true,
                  });
                }}
                placeholder="Select property types..."
              />
            </FormField>
          </div>
        </div>

        {/* Budget & ROI */}
        <div className="formGeneric-row ">
          <div className="formGeneric-col">
            <FormField
              controlId="budgetRange"
              label="Typical Budget Range (Optional)"
            >
              <Form.Select
                {...register("budgetRange")}
                className="custom-select"
              >
                <option value="">Select range</option>
                {budgetRanges.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Form.Select>
            </FormField>
          </div>

          <div className="formGeneric-col phone-col">
            <FormField
              controlId="desiredROI"
              label="Desired ROI (Optional)"
              error={errors.desiredROI?.message}
            >
              <Form.Select
                {...register("desiredROI")}
                className="custom-select"
                isInvalid={!!errors.desiredROI}
              >
                <option value="">Select ROI</option>
                {desiredROIOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </FormField>
          </div>
        </div>

        {/* Properties Owned */}
        <div className="formGeneric-row">
          <div className="formGeneric-col">
            <FormField
              controlId="propertiesOwned"
              label="Number of Properties Owned (Optional)"
              error={errors.propertiesOwned?.message}
            >
              <Form.Control
                type="number"
                placeholder="Enter a number"
                {...register("propertiesOwned")}
                className="custom-input"
                isInvalid={!!errors.propertiesOwned}
              />
            </FormField>
          </div>
        </div>

        <div className="d-flex flex-direction-row align-items-center justify-content-between">
          <div>
            <Form.Group controlId="collaborateWithRealtors">
              <Form.Check
                type="checkbox"
                label={
                  <span style={{ fontSize: "0.9em" }}>
                    I am open to collaborating with Realtors
                  </span>
                }
                {...register("collaborateWithRealtors")}
              />
            </Form.Group>
          </div>

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

export default InvestorForm;