import { useState, useRef } from "react";
import Papa from "papaparse";
import type { ChangeEvent, MouseEvent } from "react";
import Navbar from "../../components/common/Navbar";
import "../../styles/SkipTrace.css";
import { toast } from "react-toastify";
import { downloadCSVTemplate, validateCSVData } from "../../utils/csvHelpers";
import type { CSVRow } from "../../utils/csvHelpers";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BulkUpload = () => {
  const nav = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Please upload a valid CSV file.");
        clearFile();
        return;
      }
      setSelectedFile(file);
    }
  };

  const clearFile = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadAndValidate = () => {
    if (!selectedFile) return toast.error("Please select a CSV file first.");
    setLoading(true);

    Papa.parse<CSVRow>(selectedFile, {
      header: true,
      skipEmptyLines: "greedy",
      complete: async (results) => {
        const validation = validateCSVData(
          results.data,
          results.meta.fields || [],
        );
        if (!validation.isValid) {
          toast.error(validation.error);
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/skip-trace/bulk-init`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ skips: validation.data }),
            },
          );

          if (!response.ok) throw new Error("Failed to process bulk request");

          const result = await response.json();

          if (!result.requestId || result.resultCount === 0) {
            toast.warning("No records found.");
            setLoading(false);
            return;
          }

          console.log("Bulk upload response:", result);

          nav("/skip-trace/bulk-results", {
            state: {
              bulkData: result.data,
              requestId: result.requestId,
              resultCount: result.resultCount,
              total: result.totalProcessed,
            },
          });
        } catch (err: unknown) {
          toast.error((err as Error).message || "An error occurred");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="skip-trace-container d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container mt-4">
        <button onClick={() => nav("/skip-trace")} className="btn-back-link">
          <FaArrowLeft className="back-icon" />
          <span>Back</span>
        </button>
      </div>
      <main className="flex-grow-1 d-flex align-items-center">
        <div className="container text-center">
          <header className="mb-5">
            <h1 className="fw-bold display-6">
              Find Property{" "}
              <span className="brand-text-primary">Owner Data</span>
            </h1>
          </header>

          <section className="mx-auto" style={{ maxWidth: "600px" }}>
            <div className="mb-3">
              <button
                onClick={downloadCSVTemplate}
                className="btn btn-link text-decoration-none p-0"
              >
                <i className="bi bi-download me-1"></i> Download Sample Template
              </button>
            </div>

            <div
              className={`upload-card p-4 mb-4 border-2 ${selectedFile ? "border-primary" : "border-dashed"}`}
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "20px",
                border: "2px dashed #dee2e6",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="d-none"
                accept=".csv"
              />

              {!selectedFile ? (
                <div className="py-3">
                  <i className="bi bi-cloud-arrow-up fs-1 text-secondary"></i>
                  <p className="mb-0 mt-2 text-secondary">
                    Click or drag CSV here
                  </p>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between bg-white p-3 rounded shadow-sm">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-filetype-csv fs-3 text-success me-3"></i>
                    <div className="text-start">
                      <p
                        className="mb-0 fw-bold text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {selectedFile.name}
                      </p>
                      <small className="text-muted">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </small>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={clearFile}>
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleUploadAndValidate}
              disabled={loading || !selectedFile}
              className="btn btn-primary w-100 py-3 rounded-pill"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                "Upload & Validate"
              )}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BulkUpload;
