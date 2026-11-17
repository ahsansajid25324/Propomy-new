import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { propertySchema, type PropertyFormData } from "../../schemas/Property";
import "../../styles/Property.css";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import DiscardModal from "../../components/common/DiscardModal";
import FormInput from "../../components/common/FormInput";
import { PropertyFormSection } from "../../libs/constants/AddProperty";
import AddressAutocompleteInput from "../../components/common/AddressAutoComplete";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type {
  PropertyResponse,
  PropertyInput,
  PropertyAvmQueryResponse,
  PropertyAvmQueryVariables,
} from "../../types/Property";
import { ADD_PROPERTY_MUTATION } from "../../apollo/graphql/mutations/Property";
import { GET_USER_PROPERTY_STATS } from "../../apollo/graphql/queries/Investor";
import client from "../../apollo/client";
import { GET_PROPERTY_AVM_DETAIL } from "../../apollo/graphql/queries/Map";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../features/auth/authSlice";

const PropertyForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [avmNoData, setAvmNoData] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingAddAnother, setLoadingAddAnother] = useState(false);
  const navigate = useNavigate();

  const [addProperty] = useMutation<
    { addProperty: PropertyResponse },
    { input: PropertyInput }
  >(ADD_PROPERTY_MUTATION);

  const [getPropertyAvm] = useLazyQuery<
    PropertyAvmQueryResponse,
    PropertyAvmQueryVariables
  >(GET_PROPERTY_AVM_DETAIL, {
    fetchPolicy: "network-only",
  });

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
      address: "",
      status: "",
      showCalculations: false,
      purchasePrice: null,
      downPayment: null,
      loanAmount: null,
      interestRate: null,
      loanTermYears: null,
      closingCosts: null,
      rehabCosts: null,
      monthlyRent: null,
      taxesAnnual: null,
      insuranceAnnual: null,
      hoaMonthly: null,
      maintenancePercent: null,
      vacancyPercent: null,
      propertyMgmtPercent: null,
      utilitiesMonthly: null,
      avmLow: 0,
      avmMid: 0,
      avmHigh: 0,
    },
  });

  const isEnabled = watch("showCalculations");
  const purchasePrice = watch("purchasePrice");
  const downPayment = watch("downPayment");

  const fetchPropertyAvm = async (address: string) => {
    try {
      setAvmNoData(false);

      const { data } = await getPropertyAvm({
        variables: { address },
      });

      const pData = data?.propertyDetail;

      if (!pData) {
        throw new Error("No data returned for this address");
      }

      const avmLow = pData.avmMin ?? 0;
      const avmMid = pData.avm ?? 0;
      const avmHigh = pData.avmMax ?? 0;

      if (!pData.isCached && user && user.apiLimit > 0) {
        dispatch(updateUser({ apiLimit: user.apiLimit - 1 }));
      }

      setValue("avmLow", avmLow, { shouldValidate: true });
      setValue("avmMid", avmMid, { shouldValidate: true });
      setValue("avmHigh", avmHigh, { shouldValidate: true });

      setAvmNoData(avmLow === 0 && avmMid === 0 && avmHigh === 0);
    } catch (error) {
      console.error("Failed to fetch GraphQL AVM data", error);
      setValue("avmLow", 0, { shouldValidate: true });
      setValue("avmMid", 0, { shouldValidate: true });
      setValue("avmHigh", 0, { shouldValidate: true });
      setAvmNoData(true);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      const pPrice = Number(purchasePrice) || 0;
      const dPayment = Number(downPayment) || 0;
      if (dPayment > 0 && pPrice > 0) {
        setValue("loanAmount", Math.max(0, pPrice - dPayment), {
          shouldValidate: true,
        });
      }
    } else {
      PropertyFormSection.forEach((section) => {
        if (
          section.title === "Acquisition Assumptions" ||
          section.title === "Income & Expenses"
        ) {
          section.fields.forEach((field) => {
            if (field.name !== "showCalculations") {
              setValue(field.name as keyof PropertyFormData, null, {
                shouldValidate: false,
              });
            }
          });
        }
      });
      setValue("loanAmount", null, { shouldValidate: false });
    }
  }, [isEnabled, purchasePrice, downPayment, setValue]);

  const onSubmit = async (
    data: PropertyFormData,
    action: "save" | "addAnother",
  ) => {
    const setLoading =
      action === "save" ? setLoadingSave : setLoadingAddAnother;
    setLoading(true);

    try {
      const input: PropertyInput = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value ?? undefined]),
      ) as unknown as PropertyInput;

      const response = await addProperty({ variables: { input } });
      const result = response.data?.addProperty;

      if (!result) throw new Error("No response from server");

      if (result.success) {
        toast.success(result.message);
        client.refetchQueries({ include: [GET_USER_PROPERTY_STATS] });
        if (action === "save") {
          setTimeout(() => navigate("/investor/view-properties"), 1000);
        } else {
          reset();
          setAvmNoData(false);
        }
      } else {
        toast.error(result.message || "Failed to add property.");
      }
    } catch (error: unknown) {
      console.error("Add property failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add property. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-main-container py-2">
      <div className="property-heading mb-3">
        <h3>Add Property</h3>
      </div>

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
                <div className="calculation-toggle-container mb-4 p-3 bg-light border rounded">
                  <Form.Check
                    type="checkbox"
                    id="showCalculations"
                    label="Want to make calculations?"
                    className="fw-bold"
                    {...register("showCalculations")}
                  />
                  <small className="text-muted">
                    Check this box if you want to include financial assumptions
                    and expense details.
                  </small>
                </div>
              )}

              <div
                className={`add-form-section mb-4 ${sectionDisabled ? "section-disabled" : ""}`}
              >
                <h3
                  className={`section-title mb-2 ${sectionDisabled ? "text-muted" : ""}`}
                >
                  {section.title}
                </h3>

                {section.title === "Valuation Snapshot" && avmNoData && (
                  <small className="text-danger mb-2 d-block">
                    No AVM data available for this address.
                  </small>
                )}

                <div className="row g-3">
                  {section.fields.map((field) => (
                    <div key={field.name} className="col-md-6">
                      {field.name === "address" ? (
                        <AddressAutocompleteInput<PropertyFormData>
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
                          placeholder={
                            sectionDisabled
                              ? "Check toggle to enable"
                              : field.placeholder ||
                                `Enter ${field.label.replace("*", "")}`
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

        <div className="d-flex justify-content-between flex-wrap mt-4 border-top pt-3">
          <Button
            variant="outline-primary"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel
          </Button>
          <div className="d-flex gap-2 flex-wrap justify-content-end ms-auto">
            <Button
              variant="outline-primary"
              disabled={loadingAddAnother}
              onClick={handleSubmit((data) => onSubmit(data, "addAnother"))}
            >
              {loadingAddAnother ? "Saving..." : "Save & Add Another"}
            </Button>
            <Button
              variant="primary"
              disabled={loadingSave}
              onClick={handleSubmit((data) => onSubmit(data, "save"))}
            >
              {loadingSave ? "Saving..." : "Save Property"}
            </Button>
          </div>
        </div>
      </form>

      <DiscardModal
        showCancelModal={showCancelModal}
        closeModal={() => setShowCancelModal(false)}
        confirmCancel={() => {
          reset();
          setAvmNoData(false);
          setShowCancelModal(false);
        }}
      />
    </div>
  );
};

export default PropertyForm;
