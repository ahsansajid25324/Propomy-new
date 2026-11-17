import React, { useState, useEffect } from "react";

interface EditApiLimitModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (newLimit: number) => void;
  userName: string;
  initialLimit: number;
  loading?: boolean;
}

const EditApiLimitModal: React.FC<EditApiLimitModalProps> = ({
  show,
  onHide,
  onConfirm,
  userName,
  initialLimit,
  loading = false,
}) => {
  const [apiLimit, setApiLimit] = useState<number | "">(initialLimit);

  useEffect(() => {
    if (show) {
      setApiLimit(initialLimit);
    }
  }, [initialLimit, show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLimit = apiLimit === "" ? 0 : apiLimit;
    onConfirm(finalLimit);
  };

  return (
    <div className="api-edit-backdrop" onClick={onHide}>
      <div className="api-edit-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="api-edit-title">Edit API Limit</h3>

        <p className="api-edit-subtitle">
          Updating API Limit structure for user:{" "}
          <span className="user-highlight">{userName}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="api-edit-input-group">
            <label htmlFor="apiLimitInput" className="api-edit-label">
              API Request Limit
            </label>
            <input
              id="apiLimitInput"
              type="number"
              min="0"
              value={apiLimit}
              onChange={(e) => {
                const val = e.target.value;
                setApiLimit(val === "" ? "" : Number(val));
              }}
              onFocus={(e) => e.target.select()} 
              className="api-edit-input"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="api-edit-actions">
            <button
              type="button"
              onClick={onHide}
              disabled={loading}
              className="api-edit-btn api-edit-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="api-edit-btn api-edit-btn-save"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApiLimitModal;