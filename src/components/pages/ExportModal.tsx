import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Spinner, Form, Table } from "react-bootstrap";
import { useMutation } from "@apollo/client/react";
import { EXPORT_VALUATIONS } from "../../apollo/graphql/mutations/Valuation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { updateUser } from "../../features/auth/authSlice";
import type {
  ExportValuationsResponse,
  ExportValuationsVariables,
} from "../../types/Valuation";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ExportFormat = "csv" | "pdf" | "xlsx";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (selection: {
    startDate: string;
    endDate: string;
    format: ExportFormat;
  }) => void;
}

const MAX_RANGE_DAYS = 60;

const toLocalYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const startOfDay = (d: Date): Date => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const { minDate, maxDate } = useMemo(() => {
    const today = startOfDay(new Date());
    const earliest = startOfDay(new Date());
    earliest.setDate(earliest.getDate() - MAX_RANGE_DAYS);
    return { minDate: earliest, maxDate: today };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [startDate, setStartDate] = useState<Date | null>(minDate);
  const [endDate, setEndDate] = useState<Date | null>(maxDate);
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStartDate(minDate);
      setEndDate(maxDate);
      setFormat("csv");
      setLocalError(null);
    }
  }, [isOpen, minDate, maxDate]);

  const [runExport, { loading }] = useMutation<
    ExportValuationsResponse,
    ExportValuationsVariables
  >(EXPORT_VALUATIONS);

  const handleSubmit = async () => {
    setLocalError(null);

    if (!startDate || !endDate) {
      setLocalError("Please select both a start and end date.");
      return;
    }

    if (startDate > endDate) {
      setLocalError("The start date must be on or before the end date.");
      return;
    }

    const startDateStr = toLocalYMD(startDate);
    const endDateStr = toLocalYMD(endDate);

    try {
      const { data } = await runExport({
        variables: { startDate: startDateStr, endDate: endDateStr, format },
      });

      const result = data?.exportValuations;
      if (!result) {
        setLocalError("Export failed: no data returned.");
        return;
      }

      const { content, filename, mimeType } = result;

      const bytes = Uint8Array.from(atob(content), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: mimeType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      const currentCount = user?.exportCount ?? 0;
      dispatch(updateUser({ exportCount: currentCount + 1 }));

      onConfirm?.({ startDate: startDateStr, endDate: endDateStr, format });
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { graphQLErrors?: { message?: string }[] })?.graphQLErrors?.[0]
          ?.message ||
        (err as { message?: string })?.message ||
        "Something went wrong during export.";
      setLocalError(message);
    }
  };

  const cellLabel: React.CSSProperties = {
    width: "25%",
    fontWeight: 500,
    paddingLeft: 0,
    verticalAlign: "middle",
  };
  const cellInput: React.CSSProperties = { paddingRight: 0 };

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header
        closeButton
        style={{ borderBottom: "none", paddingBottom: 0 }}
      >
        <Modal.Title>Export Valuation History</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ paddingTop: "8px" }}>
        <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "20px" }}>
          Select the date range and file format for your export. You can export
          up to {MAX_RANGE_DAYS} days of valuation history.
        </p>

        <Table borderless responsive style={{ marginBottom: 0 }}>
          <tbody>
            <tr>
              <td style={cellLabel}>
                <label htmlFor="export-start-date" className="mb-0">
                  Start Date
                </label>
              </td>
              <td style={cellInput}>
                <DatePicker
                  id="export-start-date"
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={minDate}
                  maxDate={endDate ?? maxDate}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  disabled={loading}
                  customInput={
                    <Form.Control autoComplete="off" aria-label="Start date" />
                  }
                  wrapperClassName="d-block"
                />
              </td>
            </tr>
            <tr>
              <td style={cellLabel}>
                <label htmlFor="export-end-date" className="mb-0">
                  End Date
                </label>
              </td>
              <td style={cellInput}>
                <DatePicker
                  id="export-end-date"
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate ?? minDate}
                  maxDate={maxDate}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  disabled={loading}
                  customInput={
                    <Form.Control autoComplete="off" aria-label="End date" />
                  }
                  wrapperClassName="d-block"
                />
              </td>
            </tr>
            <tr>
              <td style={cellLabel}>
                <label htmlFor="export-format" className="mb-0">
                  File Format
                </label>
              </td>
              <td style={cellInput}>
                <Form.Select
                  id="export-format"
                  value={format}
                  disabled={loading}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                >
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                  <option value="xlsx">Excel (.xlsx)</option>
                </Form.Select>
              </td>
            </tr>
          </tbody>
        </Table>

        {localError && (
          <p className="text-danger small mt-3 mb-0" role="alert">
            {localError}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer style={{ borderTop: "none" }}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Exporting…
            </>
          ) : (
            "Confirm"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportModal;
