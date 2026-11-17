import "../../styles/Investor.css";
import "../../styles/Property.css";
import StatCard from "../../components/common/StatCard";
import Pagination from "../../components/common/Pagination";
import AddDealModal from "../../components/pages/AddDealModal";
import { Button, Spinner } from "react-bootstrap";
import { LuCheck, LuPencil, LuTrash2 } from "react-icons/lu";
import { useDeals, DEALS_PER_PAGE } from "../../hooks/useDeal";
import DeleteModal from "../../components/common/DeleteModal";
import EditDealModal from "../../components/pages/EditDealModal";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";
const DEAL_STATUSES = [
  "Analyzing",
  "Negotiating",
  "Offer Made",
  "Under Contract",
  "Closed",
];
const formatUpdated = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const Index = () => {
  const {
    currentPage,
    totalCount,
    stats,
    isLoading,
    error,
    edges,
    showAddModal,
    handlePageChange,
    handleOpenModal,
    handleCloseModal,
    handleDealSaved,
    dealToEdit,
    handleStatusChange,
    showDeleteModal,
    dealToDelete,
    deleteLoading,
    handleDeleteClick,
    handleConfirmDelete,
    handleHideDeleteModal,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditSaved,
  } = useDeals();

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const onStatusSelect = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await handleStatusChange(id, status);
    } finally {
      setUpdatingId(null);
    }
  };
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
        <h4 className="mb-0">Deal Flow</h4>
        <Button variant="primary" onClick={handleOpenModal}>
          Add Deal
        </Button>
      </div>

      <div className="stat-card-row">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="property-container">
        <div className="table-wrapper">
          <table className="property-table">
            <thead>
              <tr>
                <th>PROPERTY</th>
                <th>ACQ. COST</th>
                <th>STATUS</th>
                <th>CONTACT</th>
                <th>NOTES</th>
                <th>UPDATED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: DEALS_PER_PAGE }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j}>
                        <div className="skeleton"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    Couldn't load deals. Check your connection and try again.
                  </td>
                </tr>
              ) : edges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No deals yet. Add your first deal to start tracking your
                    pipeline.
                  </td>
                </tr>
              ) : (
                edges.map(({ node: deal }) => (
                  <tr key={deal.id}>
                    <td data-label="PROPERTY">
                      <div className="d-flex flex-column">
                        <div className="fw-semibold text-dark">
                          {deal.address}
                        </div>
                        <div className="text-muted small">
                          {deal.location} • {deal.strategy}
                        </div>
                      </div>
                    </td>
                    <td
                      data-label="ACQ. COST"
                      className="fw-semibold text-dark"
                    >
                      ${deal.acqCost.toLocaleString()}
                    </td>
                    <td data-label="STATUS">
                      <Dropdown
                        onSelect={(status) =>
                          status && onStatusSelect(deal.id, status)
                        }
                      >
                        <Dropdown.Toggle
                          as="span"
                          disabled={updatingId === deal.id}
                          style={{
                            pointerEvents:
                              updatingId === deal.id ? "none" : "auto",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            cursor:
                              updatingId === deal.id
                                ? "not-allowed"
                                : "pointer",
                          }}
                          className={`status-badge status-toggle ${deal.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {updatingId === deal.id ? (
                            <>
                              <Spinner animation="border" size="sm" />
                              <span>Updating…</span>
                            </>
                          ) : (
                            <span>{deal.status}</span>
                          )}
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="start" className="status-menu">
                          {DEAL_STATUSES.map((status) => (
                            <Dropdown.Item
                              key={status}
                              eventKey={status}
                              className="status-menu-item"
                            >
                              <span
                                className={`status-badge ${status
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                              >
                                {status}
                              </span>
                              {deal.status === status && (
                                <LuCheck size={16} className="ms-auto" />
                              )}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td data-label="CONTACT">
                      <div className="d-flex flex-column">
                        <div className="fw-semibold text-dark">
                          {deal.contactName || "-"}
                        </div>
                        <div className="text-muted small">
                          {deal.contactPhone || "-"}
                        </div>
                        <span
                          className={`role-badge ${deal.contactRole.toLowerCase()}`}
                        >
                          {deal.contactRole}
                        </span>
                      </div>
                    </td>
                    <td data-label="NOTES" className="text-muted small">
                      <div
                        style={{
                          maxWidth: "250px",
                          minWidth: "150px",
                          wordBreak: "break-word",
                        }}
                      >
                        {deal.notes}
                      </div>
                    </td>
                    <td data-label="UPDATED" className="text-muted small">
                      {formatUpdated(deal.updatedAt)}
                    </td>

                    <td data-label="Actions">
                      <button
                        className="action-btn-clean edit-icon"
                        onClick={() => handleOpenEditModal(deal)}
                      >
                        <LuPencil size={18} />
                      </button>
                      <button
                        className="action-btn-clean delete-icon"
                        onClick={() => handleDeleteClick(deal)}
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          perPage={DEALS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>

      <AddDealModal
        show={showAddModal}
        handleClose={handleCloseModal}
        onSaved={handleDealSaved}
      />
      <EditDealModal
        show={!!dealToEdit}
        deal={dealToEdit}
        handleClose={handleCloseEditModal}
        onSaved={handleEditSaved}
        currentPage={currentPage}
      />
      <DeleteModal
        show={showDeleteModal}
        propertyAddress={dealToDelete?.address}
        loading={deleteLoading}
        onHide={handleHideDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
