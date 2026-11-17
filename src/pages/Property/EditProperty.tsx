import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation } from "@apollo/client/react";
import axios from "axios";
import { toast } from "react-toastify";
import { GET_PROPERTY_BY_ID } from "../../apollo/graphql/queries/ViewProperties";
import { UPDATE_PROPERTY } from "../../apollo/graphql/mutations/Property";
import { propertySchema, type PropertyFormData } from "../../schemas/Property";
import { PropertyFormSection } from "../../libs/constants/AddProperty";
import AddressAutocompleteInput from "../../components/common/AddressAutoComplete";
import FormInput from "../../components/common/FormInput";
import DiscardModal from "../../components/common/DiscardModal";
import { Button, Form } from "react-bootstrap";
import "../../styles/Property.css";
import type {
  PropertyResponse,
  PropertyInput,
  GetPropertyByIdResult,
} from "../../types/Property";

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [avmNoData, setAvmNoData] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [savedFinancials, setSavedFinancials] = useState<
    Partial<PropertyFormData>
  >({});

  const { data, loading } = useQuery<GetPropertyByIdResult>(
    GET_PROPERTY_BY_ID,
    {
      variables: { id },
      fetchPolicy: "network-only",
    },
  );

  const [updateProperty] = useMutation<
    { updateProperty: PropertyResponse },
    { id: string; input: PropertyInput }
  >(UPDATE_PROPERTY);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema),
    defaultValues: {
      showCalculations: false,
    },
  });

  const isEnabled = watch("showCalculations");
  const purchasePrice = watch("purchasePrice");
  const downPayment = watch("downPayment");

  useEffect(() => {
    if (data?.propertyById) {
      const property = data.propertyById;

      reset({
        ...property,
        showCalculations: Boolean(property.showCalculations),
      });

      setAvmNoData(!property.avmLow && !property.avmMid && !property.avmHigh);

      if (property.showCalculations) {
        setSavedFinancials({
          purchasePrice: property.purchasePrice,
          downPayment: property.downPayment,
          loanAmount: property.loanAmount,
          interestRate: property.interestRate,
          loanTermYears: property.loanTermYears,
          closingCosts: property.closingCosts,
          rehabCosts: property.rehabCosts,
          monthlyRent: property.monthlyRent,
          taxesAnnual: property.taxesAnnual,
          insuranceAnnual: property.insuranceAnnual,
          hoaMonthly: property.hoaMonthly,
          maintenancePercent: property.maintenancePercent,
          vacancyPercent: property.vacancyPercent,
          propertyMgmtPercent: property.propertyMgmtPercent,
          utilitiesMonthly: property.utilitiesMonthly,
        });
      }
    }
  }, [data, reset]);

  useEffect(() => {
    if (isEnabled) {
      const pPrice = Number(purchasePrice) || 0;
      const dPayment = Number(downPayment) || 0;

      if (pPrice > 0 && dPayment >= 0) {
        setValue("loanAmount", Math.max(0, pPrice - dPayment), {
          shouldValidate: true,
        });
      }
    }
  }, [isEnabled, purchasePrice, downPayment, setValue]);

  useEffect(() => {
    if (!isEnabled) {
      setSavedFinancials({
        purchasePrice: watch("purchasePrice"),
        downPayment: watch("downPayment"),
        loanAmount: watch("loanAmount"),
        interestRate: watch("interestRate"),
        loanTermYears: watch("loanTermYears"),
        closingCosts: watch("closingCosts"),
        rehabCosts: watch("rehabCosts"),
        monthlyRent: watch("monthlyRent"),
        taxesAnnual: watch("taxesAnnual"),
        insuranceAnnual: watch("insuranceAnnual"),
        hoaMonthly: watch("hoaMonthly"),
        maintenancePercent: watch("maintenancePercent"),
        vacancyPercent: watch("vacancyPercent"),
        propertyMgmtPercent: watch("propertyMgmtPercent"),
        utilitiesMonthly: watch("utilitiesMonthly"),
      });
    } else if (isEnabled && Object.keys(savedFinancials).length > 0) {
      Object.entries(savedFinancials).forEach(([key, value]) => {
        setValue(key as keyof PropertyFormData, value);
      });
    }
  }, [isEnabled]);

  const fetchPropertyAvm = async (address: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/map/property-detail`,
        { address },
      );

      const avmLow = res.data.avmMin ?? 0;
      const avmMid = res.data.avm ?? 0;
      const avmHigh = res.data.avmMax ?? 0;

      setValue("avmLow", avmLow);
      setValue("avmMid", avmMid);
      setValue("avmHigh", avmHigh);

      setAvmNoData(avmLow === 0 && avmMid === 0 && avmHigh === 0);
    } catch (error) {
      console.error("Failed to fetch AVM", error);
      setAvmNoData(true);
    }
  };

  const onSubmit = async (formData: PropertyFormData) => {
    setLoadingSave(true);

    try {
      const { showCalculations, avmLow, avmMid, avmHigh, ...rest } = formData;

      const input: PropertyInput = {
        address: rest.address,
        status: rest.status,
        showCalculations,
        avmLow: avmLow ?? undefined,
        avmMid: avmMid ?? undefined,
        avmHigh: avmHigh ?? undefined,
      };

      if (showCalculations) {
        Object.assign(input, {
          purchasePrice: rest.purchasePrice ?? undefined,
          downPayment: rest.downPayment ?? undefined,
          loanAmount: rest.loanAmount ?? undefined,
          interestRate: rest.interestRate ?? undefined,
          loanTermYears: rest.loanTermYears ?? undefined,
          closingCosts: rest.closingCosts ?? undefined,
          rehabCosts: rest.rehabCosts ?? undefined,
          monthlyRent: rest.monthlyRent ?? undefined,
          taxesAnnual: rest.taxesAnnual ?? undefined,
          insuranceAnnual: rest.insuranceAnnual ?? undefined,
          hoaMonthly: rest.hoaMonthly ?? undefined,
          maintenancePercent: rest.maintenancePercent ?? undefined,
          vacancyPercent: rest.vacancyPercent ?? undefined,
          propertyMgmtPercent: rest.propertyMgmtPercent ?? undefined,
          utilitiesMonthly: rest.utilitiesMonthly ?? undefined,
        });
      }

      if (!showCalculations) {
        Object.assign(input, {
          purchasePrice: undefined,
          downPayment: undefined,
          loanAmount: undefined,
          interestRate: undefined,
          loanTermYears: undefined,
          closingCosts: undefined,
          rehabCosts: undefined,
          monthlyRent: undefined,
          taxesAnnual: undefined,
          insuranceAnnual: undefined,
          hoaMonthly: undefined,
          maintenancePercent: undefined,
          vacancyPercent: undefined,
          propertyMgmtPercent: undefined,
          utilitiesMonthly: undefined,
        });
      }

      console.log("Sending payload:", input);

      const response = await updateProperty({
        variables: { id: id!, input },
      });

      const result = response.data?.updateProperty;
      if (!result) throw new Error("No response from server");

      if (result.success) {
        toast.success(result.message);
        setTimeout(() => navigate("/investor/view-properties"), 1000);
      } else {
        toast.error(result.message || "Update failed.");
      }
    } catch (error: unknown) {
      console.error("Update failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update property",
      );
    } finally {
      setLoadingSave(false);
    }
  };

  if (loading) return <div>Loading property details...</div>;

  return (
    <div className="form-main-container py-2">
      <h3 className="mb-3">Edit Property</h3>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="custom-form-card shadow-sm"
      >
        {PropertyFormSection.map((section) => {
          const isFinancialSection =
            section.title === "Acquisition Assumptions" ||
            section.title === "Income & Expenses";

          const sectionDisabled = isFinancialSection && !isEnabled;

          return (
            <div key={section.title}>
              {section.title === "Acquisition Assumptions" && (
                <div className="mb-4 p-3 bg-light border rounded">
                  <Form.Check
                    type="checkbox"
                    label="Want to make calculations?"
                    {...register("showCalculations")}
                  />
                </div>
              )}

              <div
                className={`mb-4 ${sectionDisabled ? "section-disabled" : ""}`}
              >
                <h5 className="mb-3">{section.title}</h5>

                {section.title === "Valuation Snapshot" && avmNoData && (
                  <small className="text-danger">No AVM data available.</small>
                )}

                <div className="row g-3">
                  {section.fields.map((field) => (
                    <div key={field.name} className="col-md-6">
                      {field.name === "address" ? (
                        <AddressAutocompleteInput
                          label={field.label}
                          name="address"
                          register={register}
                          setValue={setValue}
                          errors={errors}
                          disabled={sectionDisabled}
                          onAddressSelect={fetchPropertyAvm}
                          watch={watch}
                        />
                      ) : (
                        <FormInput
                          {...field}
                          register={register}
                          errors={errors}
                          disabled={
                            sectionDisabled ||
                            ["avmLow", "avmMid", "avmHigh"].includes(field.name)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="outline-primary"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            disabled={loadingSave}
            onClick={handleSubmit(onSubmit)}
          >
            {loadingSave ? "Updating..." : "Update Property"}
          </Button>
        </div>

      </form>

      <DiscardModal
        showCancelModal={showCancelModal}
        closeModal={() => setShowCancelModal(false)}
        confirmCancel={() => {
          reset();
          navigate("/investor/view-properties");
        }}
      />
    </div>
  );
};

export default EditProperty;
