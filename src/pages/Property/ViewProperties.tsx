import { useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../components/common/Pagination";
import DeleteModal from "../../components/common/DeleteModal";
import { GET_MY_PROPERTIES } from "../../apollo/graphql/queries/ViewProperties";
import { DELETE_PROPERTY } from "../../apollo/graphql/mutations/Property";
import type { MyPropertiesData, PropertyResponse } from "../../types/Property";
import "../../styles/Property.css";
import { usePagination } from "../../hooks/usePagination";

const RECORDS_PER_PAGE = 10;


const ViewProperties = () => {
  const navigate = useNavigate();

  const { currentPage, queryVariables, handlePageChange } =
    usePagination(RECORDS_PER_PAGE);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{
    id: string;
    address: string;
  } | null>(null);

  const { data, loading } = useQuery<MyPropertiesData>(GET_MY_PROPERTIES, {
    variables: { pagination: queryVariables },
    fetchPolicy: "cache-and-network",
  });

  const [deleteProperty, { loading: deleteLoading }] = useMutation<{
    deleteProperty: PropertyResponse;
  }>(DELETE_PROPERTY, {
    refetchQueries: [
      {
        query: GET_MY_PROPERTIES,
        variables: { pagination: queryVariables },
      },
    ],
  });

  const isLoading = loading && !data;
  const properties = data?.myProperties.edges || [];
  const totalCount = data?.myProperties.pageInfo.totalCount ?? 0;

  const handleDeleteClick = (id: string, address: string) => {
    setPropertyToDelete({ id, address });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      const response = await deleteProperty({
        variables: { id: propertyToDelete.id },
      });

      if (response.data?.deleteProperty.success) {
        toast.success("Property deleted successfully");
      } else {
        toast.error(
          response.data?.deleteProperty.message || "Failed to delete property",
        );
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("An error occurred while deleting the property.");
    } finally {
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };

  return (
    <div>
      <div className="property-heading">
        <h3>View Properties</h3>
      </div>

      <div className="property-container">
        <div className="table-wrapper">
          <table className="property-table">
            <thead>
              <tr>
                <th className="address-col">Address</th>
                <th>Status</th>
                <th>Value</th>
                <th>NOI</th>
                <th>Cash Flow</th>
                <th>Cap Rate</th>
                <th>CoC</th>
                <th>ROI</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: properties.length || 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j}>
                          <div className="skeleton"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                : properties.map((prop) => (
                    <tr key={prop._id}>
                      <td className="address-col" data-label="Address">
                        {prop.address}
                      </td>
                      <td data-label="Status">
                        <span
                          className={`status-badge ${prop.status.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {prop.status}
                        </span>
                      </td>
                      <td data-label="Value">
                        {prop.showCalculations
                          ? prop.avmMid != null
                            ? `$${prop.avmMid.toFixed(2)}`
                            : "N/A"
                          : "-"}
                      </td>
                      <td data-label="NOI">
                        {prop.showCalculations
                          ? prop.netOperatingIncome != null
                            ? `$${prop.netOperatingIncome.toFixed(2)}`
                            : "-"
                          : "-"}
                      </td>
                      <td data-label="Cash Flow">
                        {prop.showCalculations
                          ? prop.annualCashFlow != null
                            ? `$${prop.annualCashFlow.toFixed(2)}`
                            : "-"
                          : "-"}
                      </td>
                      <td data-label="Cap Rate">
                        {prop.showCalculations
                          ? `${prop.capRate?.toFixed(2)}%`
                          : "-"}
                      </td>
                      <td data-label="CoC">
                        {prop.showCalculations
                          ? `${prop.cashOnCashReturn?.toFixed(2)}%`
                          : "-"}
                      </td>
                      <td data-label="ROI">
                        {prop.showCalculations
                          ? `${prop.roiYear1WithEquity?.toFixed(2)}%`
                          : "-"}
                      </td>
                      <td data-label="Actions">
                        <button
                          className="action-btn-clean edit-icon"
                          onClick={() =>
                            navigate(`/investor/edit-property/${prop._id}`)
                          }
                        >
                          <LuPencil size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(prop._id, prop.address)
                          }
                          className="action-btn-clean delete-icon"
                        >
                          <LuTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          perPage={RECORDS_PER_PAGE}
          onPageChange={handlePageChange}
        />

        <DeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          loading={deleteLoading}
          onConfirm={handleConfirmDelete}
          propertyAddress={propertyToDelete?.address}
        />
      </div>
    </div>
  );
};

export default ViewProperties;
