import "../../styles/Admin.css";
import "../../styles/Investor.css";
import StatCard from "../../components/common/StatCard";
import Pagination from "../../components/common/Pagination";
import DeleteModal from "../../components/common/DeleteModal";
import AdminTable from "../../components/pages/AdminUserTable";
import EditApiLimitModal from "../../components/pages/EditAPILimitModal";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

const USERS_PER_PAGE = 10;

const Index = () => {
  const {
    currentPage,
    totalCount,
    stats,
    isLoading,
    edges,
    showDeleteModal,
    userToDelete,
    showEditModal,
    userToEdit,
    deleteLoading,
    mutationLoading,
    handlePageChange,
    handleDeleteClick,
    handleEditClick,
    handleHideDeleteModal,
    handleHideEditModal,
    handleConfirmDelete,
    handleConfirmEdit,
  } = useAdminDashboard();


  
  return (
    <div className="admin-dashboard-container">
      <h4>Welcome to the Admin Dashboard!</h4>

      <div className="stat-card-row">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="property-container">
        <div className="table-wrapper">
          <AdminTable
            isLoading={isLoading}
            edges={edges}
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEditClick}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          perPage={USERS_PER_PAGE}
          onPageChange={handlePageChange}
        />

        <DeleteModal
          show={showDeleteModal}
          onHide={handleHideDeleteModal}
          loading={deleteLoading}
          onConfirm={handleConfirmDelete}
          propertyAddress={userToDelete?.name}
        />

        <EditApiLimitModal
          show={showEditModal}
          onHide={handleHideEditModal}
          onConfirm={handleConfirmEdit}
          userName={userToEdit?.name || ""}
          initialLimit={userToEdit?.apiLimit ?? 0}
          loading={mutationLoading}
        />
      </div>
    </div>
  );
};

export default Index;
