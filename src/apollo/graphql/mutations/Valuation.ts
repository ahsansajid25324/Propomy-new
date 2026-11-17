import { gql } from "@apollo/client";

export const PREDICT_PROPERTY_MUTATION = gql`
  mutation PredictProperty($input: PredictInput!) {
    predictProperty(input: $input) {
      success
      message
      propertyId
      prediction {
        prediction
        data_version
        explanation
        feature_set_version
        geo_scope
        high_estimate
        low_estimate
        quality_tier
        model_version
        quality_score
        source
        valuation
        top_features {
          feature
          impact
        }
      }
    }
  }
`;



export const EXPORT_VALUATIONS = gql`
  mutation ExportValuations(
    $startDate: String!
    $endDate: String!
    $format: ExportFormat!
  ) {
    exportValuations(
      startDate: $startDate
      endDate: $endDate
      format: $format
    ) {
      filename
      mimeType
      content
    }
  }
`;