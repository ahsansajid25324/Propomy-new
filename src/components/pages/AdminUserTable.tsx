import React from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { capitalize } from "../../utils/StringUtils";
import { Badge } from "../common/Badge";
import type { BadgeVariant } from "../common/Badge";
import type { UserProfilesData } from "../../types/Admin";
import "../../styles/Property.css";
interface AdminTableProps {
  isLoading: boolean;
  edges: NonNullable<UserProfilesData["userProfiles"]>["edges"];
  onDeleteClick: (user: { id: string; name: string; apiLimit: number }) => void;
  onEditClick: (user: { id: string; name: string; apiLimit: number }) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
  isLoading,
  edges,
  onDeleteClick,
  onEditClick,
}) => {
  return (
    <table className="property-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th>Plan</th>
          <th>API Limit</th>
          <th>Registration Status</th>
          <th>Subscription Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? /* MATCHED WITH VIEWPROPERTIES: dynamically sizes skeleton placeholders to avoid UI shifting during jumps */
            Array.from({ length: edges.length || 5 }).map((_, i) => (
              <tr key={`skeleton-row-${i}`}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={`skeleton-cell-${j}`}>
                    <div className="skeleton" />
                  </td>
                ))}
              </tr>
            ))
          : edges.map(({ cursor, node }) => {
              const fullName = `${node.firstName} ${node.lastName}`;

              const getPlanVariant = (plan?: string): BadgeVariant => {
                if (!plan) return "neutral";
                return plan.toLowerCase().includes("free")
                  ? "warning"
                  : "success";
              };

              const getRegStatusVariant = (status?: string): BadgeVariant => {
                return status === "completed" ? "success" : "danger";
              };

              const getSubStatusVariant = (status?: string): BadgeVariant => {
                if (!status || status.toLowerCase() === "non-active")
                  return "neutral";
                return "info";
              };

              const userPayload = {
                id: node.id,
                name: fullName,
                apiLimit: node.apiLimit,
              };

              return (
                <tr key={cursor}>
                  <td data-label="User">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 500, color: "#333" }}>
                        {fullName}
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#666",
                          marginTop: "2px",
                        }}
                      >
                        {node.email}
                      </span>
                    </div>
                  </td>

                  <td data-label="Role" style={{ textTransform: "capitalize" }}>
                    {capitalize(node.role)}
                  </td>

                  <td data-label="Plan">
                    <Badge
                      text={node.plan}
                      variant={getPlanVariant(node.plan)}
                    />
                  </td>

                  <td data-label="API Limit">{node.apiLimit}</td>

                  <td data-label="Status">
                    <Badge
                      text={node.registrationStatus}
                      variant={getRegStatusVariant(node.registrationStatus)}
                    />
                  </td>

                  <td data-label="Subscription Status">
                    <Badge
                      text={node.subscriptionStatus}
                      variant={getSubStatusVariant(node.subscriptionStatus)}
                      fallbackText="Non-active"
                    />
                  </td>

                  <td data-label="Actions">
                    <button
                      className="action-btn-clean edit-icon"
                      onClick={() => onEditClick(userPayload)}
                    >
                      <LuPencil size={18} />
                    </button>
                    <button
                      className="action-btn-clean delete-icon"
                      onClick={() => onDeleteClick(userPayload)}
                    >
                      <LuTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
      </tbody>
    </table>
  );
};

export default React.memo(AdminTable);
