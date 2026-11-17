import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import logo from "/logo.png";

interface LeaveModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string; // Optional title
  description?: string; // Optional description
  confirmText?: string; // Optional confirm button text
  cancelText?: string; // Optional cancel button text
}

const LeaveModal: React.FC<LeaveModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  loading = false,
  title,
  description,
  confirmText,
  cancelText,
}) => {
  return (
    <Modal
      show={visible}
      onHide={onCancel}
      centered
      contentClassName="border-0 shadow-lg"
      style={{ borderRadius: "16px" }}
    >
      <Modal.Body className="p-4 text-center">
        <div className="d-flex align-items-center justify-content-center mb-2 mx-auto">
          <img
            src={logo}
            style={{ width: "42px", height: "42px" }}
            alt="Logo"
          />
        </div>

        <h4 className="fw-bold mb-2" style={{ color: "#1a1f36" }}>
          {title || "Confirm Action"}
        </h4>

        {description && (
          <p
            className="text-muted px-3"
            style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
          >
            {description}
          </p>
        )}

        <div className="d-grid gap-2 mt-4">
          <Button
            size="lg"
            disabled={loading}
            onClick={onConfirm}
            style={{
              backgroundColor: title?.toLowerCase().includes("cancel")
                ? "#ff4d4f"
                : "#2150fe",
              border: "none",
              fontWeight: "500",
              fontSize: "1rem",
              padding: "8px",
            }}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                {confirmText || "Processing..."}
              </>
            ) : (
              confirmText ||
              (title?.toLowerCase().includes("cancel") ? "Confirm" : "Continue")
            )}
          </Button>

          <Button
            variant="link"
            className="text-decoration-none text-muted"
            onClick={onCancel}
            style={{ fontSize: "0.9rem" }}
          >
            {cancelText || "Go back"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LeaveModal;
