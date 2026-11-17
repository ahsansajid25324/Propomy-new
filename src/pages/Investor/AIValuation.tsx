import { useForm } from "react-hook-form";
import "../../styles/Investor.css";
import AddressAutocompleteInput from "../../components/common/AddressAutoComplete";
import { Button, Spinner, Placeholder } from "react-bootstrap";
import { propertyDetailsConfig } from "../../libs/constants/Valuation";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import {
  DetailBox,
  ValuationItem,
} from "./../../components/pages/ValuationItem";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { PREDICT_PROPERTY_MUTATION } from "../../apollo/graphql/mutations/Valuation";
import { GET_VALUATION_PROPERTY_DETAIL } from "../../apollo/graphql/queries/Map";
import type {
  ValuationForm,
  PropertyData,
  Prediction,
  PropertyDetailValuationQueryResponse,
  PropertyDetailValuationQueryVariables,
  PredictPropertyResponse,
} from "../../types/Valuation";
import { updateUser } from "../../features/auth/authSlice";
import posthog from "posthog-js";
import { capitalize } from "../../utils/StringUtils";

const AIValuation = () => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValuationForm>({
    defaultValues: { address: "" },
    mode: "onSubmit",
  });

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [propertyData, setPropertyData] = useState<PropertyData>({});
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [valuationLoading, setValuationLoading] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [getPropertyDetail] = useLazyQuery<
    PropertyDetailValuationQueryResponse,
    PropertyDetailValuationQueryVariables
  >(GET_VALUATION_PROPERTY_DETAIL, {
    fetchPolicy: "network-only",
  });

  const fetchPropertyDetail = async (formData: ValuationForm) => {
    try {
      setLoading(true);
      setInvalidAddress(false);
      setPrediction(null);
      setHasSearched(false);

      const { data } = await getPropertyDetail({
        variables: { address: formData.address },
      });

      const pData = data?.propertyDetail;
      if (!pData) {
        setInvalidAddress(true);
        return;
      }

      if (!pData.isCached && user && user.apiLimit > 0) {
        dispatch(updateUser({ apiLimit: user.apiLimit - 1 }));
      }
      setPropertyData(pData as PropertyData);

      const isInvalid =
        pData.estimatedValue === 0 &&
        pData.equity === 0 &&
        pData.roundedAverageCompValue === 0;

      setInvalidAddress(isInvalid);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching property details via GraphQL:", error);
      setInvalidAddress(true);
    } finally {
      setLoading(false);
    }
  };

  const [predictProperty] = useMutation<PredictPropertyResponse>(
    PREDICT_PROPERTY_MUTATION,
  );

  const getAIValuation = async () => {
    const address = watch("address")?.trim();
    if (!address) return;

    setValuationLoading(true);
    try {
      const { data } = await predictProperty({
        variables: { input: { address } },
      });

      if (data?.predictProperty) {
        const valuationResult = data.predictProperty.prediction;
        setPrediction(valuationResult);

        posthog.capture("ai_valuation_completed", {
          property_address: address,
          estimated_value: valuationResult.prediction,
          predicted_value: valuationResult.valuation,
          high_estimate: valuationResult.high_estimate,
          low_estimate: valuationResult.low_estimate,
          quality_score: valuationResult.quality_score,
          role: user?.role || "investor",
        });
      } else {
        setPrediction(null);
      }
    } catch (error) {
      console.error("Error fetching AI valuation:", error);
    } finally {
      setValuationLoading(false);
    }
  };

  const modelInputs = useMemo(
    () => [
      {
        label: "Estimated Value",
        value: propertyData.estimatedValue
          ? Number(propertyData.estimatedValue)
          : 0,
        isCurrency: true,
      },
      {
        label: "Living Sqft",
        value: propertyData.livingSquareFeet,
        isCurrency: false,
      },
      { label: "Bedrooms", value: propertyData.bedrooms, isCurrency: false },
      { label: "Bathrooms", value: propertyData.bathrooms, isCurrency: false },
    ],
    [propertyData],
  );

  return (
    <div className="valuation-container">
      <div className="search-section-wrapper">
        <div className="search-input-container">
          <AddressAutocompleteInput
            label=""
            name="address"
            placeholder="Enter Property Address"
            register={register}
            setValue={setValue}
            watch={watch}
            rules={{ required: "Property address is required" }}
            errors={errors}
          />
        </div>

        <div className="search-actions">
          <Button
            variant="outline-secondary"
            className="btn-clear"
            disabled={loading || valuationLoading}
            onClick={() => {
              reset();
              setPropertyData({});
              setPrediction(null);
              setInvalidAddress(false);
              setHasSearched(false);
            }}
          >
            Clear
          </Button>

          <Button
            variant="primary"
            className="btn-search"
            disabled={loading}
            onClick={handleSubmit(fetchPropertyDetail)}
          >
            {loading ? (
              <Spinner size="sm" animation="border" className="me-2" />
            ) : null}
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      <div className="details-card">
        <h3 className="details-title">Property Details (Auto-filled)</h3>
        <div className="details-grid">
          {propertyDetailsConfig.map((item) => (
            <DetailBox
              key={item.key}
              icon={item.icon}
              label={item.label}
              value={
                propertyData[item.key as keyof PropertyData] as string | number
              }
              loading={loading}
            />
          ))}
        </div>

        {invalidAddress && (
          <div className="valuation-error mt-3">
            Address data unavailable. Cannot perform AI valuation.
          </div>
        )}

        <Button
          variant="primary"
          className="btn-valuation mt-3 w-100"
          onClick={getAIValuation}
          disabled={!hasSearched || invalidAddress || valuationLoading}
        >
          {valuationLoading ? (
            <Spinner size="sm" animation="grow" className="me-2" />
          ) : null}
          {valuationLoading ? "Analyzing Market Data..." : "Get AI Valuation"}
        </Button>
      </div>

      <div className="valuation-output-grid">
        <div
          className={`valuation-card ${valuationLoading ? "opacity-75" : ""}`}
        >
          <h2>AI Valuation</h2>
          <div className="valuation-main-value">
            {valuationLoading ? (
              <Placeholder as="div" animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
            ) : prediction?.valuation ? (
              `$${prediction.valuation.toLocaleString()}`
            ) : (
              "$0.00"
            )}
          </div>

          <ValuationItem
            label="Low Estimate"
            value={prediction?.low_estimate}
            isCurrency
            loading={valuationLoading}
          />
          <ValuationItem
            label="High Estimate"
            value={prediction?.high_estimate}
            isCurrency
            loading={valuationLoading}
          />

          {!valuationLoading && hasSearched && (
            <div className="valuation-confidence mt-3 p-2 bg-light rounded">
              <small>
                Confidence Score:{" "}
                <strong>{capitalize(prediction?.quality_tier) ?? "N/A"}</strong>{" "}
                based on local comps.
              </small>
            </div>
          )}
        </div>

        <div className="valuation-card">
          <h2>Why this valuation?</h2>
          <div className="mb-2 text-muted">
            Primary drivers for this calculation:
          </div>
          {valuationLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <ValuationItem
                    key={`loading-${i}`}
                    label="Analyzing factor..."
                    loading={true}
                  />
                ))
            : prediction?.top_features?.length
              ? prediction.top_features.map((f, i) => (
                  <ValuationItem
                    key={i}
                    label={
                      f.feature
                        ? f.feature
                            .replace(/_/g, " ")
                            .replace(/^\w/, (c) => c.toUpperCase())
                        : "Factor"
                    }
                    value={f.impact}
                    isCurrency={false}
                  />
                ))
              : ["Estimated Value", "Living Sqft", "Suggested Rent"].map(
                  (placeholder) => (
                    <ValuationItem
                      key={placeholder}
                      label={placeholder}
                      value=""
                    />
                  ),
                )}
        </div>

        <div className="valuation-card">
          <h2>Model Inputs Used</h2>
          {modelInputs.map((item) => (
            <ValuationItem
              key={item.label}
              label={item.label}
              value={item.value}
              isCurrency={item.isCurrency}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIValuation;
