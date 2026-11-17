import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Navbar from "../../components/common/Navbar";
import "../../styles/SkipTrace.css";
import { skipTraceSchema } from "../../schemas/SingleSkipTrace";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
interface SkipTraceFormData {
  address: string;
  city: string;
  state: string;
  zipcode: string;
}
const SingleEntry = () => {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(skipTraceSchema),
  });

  const [loading, setLoading] = useState(false);
  const onSubmit = async (formData: SkipTraceFormData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/skip-trace/single`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zipcode,
          }),
        },
      );

      const apiResult = await response.json();

      if (apiResult.resultCount === 0 || apiResult.persons.length === 0) {
        toast.error("No data found for this address. Please try another.");
      } else {
        nav("/skip-trace/results", { state: { apiResult } });
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
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
          <div className="mb-4">
            <h1 className="fw-bold display-6">
              Find Property{" "}
              <span className="brand-text-primary">Owner Data</span> In Seconds
            </h1>
            <p className="text-secondary mt-0 fs-5">Skip Trace Any Address</p>
          </div>

          <div className="mb-0 mb-md-4 mt-0 mt-md-5">
            <h2 className="fw-bold mb-4">Single Address Search</h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="search-wrapper mb-4"
          >
            <div className="row g-2 g-md-3 text-start">
              {/* Address */}
              <div className="col-12">
                <input
                  type="text"
                  placeholder="Address"
                  className="form-control search-input"
                  {...register("address")}
                />
                <small className="text-danger">{errors.address?.message}</small>
              </div>

              {/* City */}
              <div className="col-md-4">
                <input
                  type="text"
                  placeholder="City"
                  className="form-control search-input"
                  {...register("city")}
                />
                <small className="text-danger">{errors.city?.message}</small>
              </div>

              {/* State */}
              <div className="col-md-4">
                <input
                  type="text"
                  placeholder="State"
                  className="form-control search-input"
                  {...register("state")}
                />
                <small className="text-danger">{errors.state?.message}</small>
              </div>

              {/* Zipcode */}
              <div className="col-md-4">
                <input
                  type="text"
                  placeholder="Zipcode"
                  className="form-control search-input"
                  {...register("zipcode")}
                />
                <small className="text-danger">{errors.zipcode?.message}</small>
              </div>
            </div>
            <div className="mt-3">
              <button
                disabled={loading}
                type="submit"
                className="btn-search-go"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>

          <div className="sub-text-muted mt-4">
            Powered by nationwide property data • Secure & private • Built for
            investors
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-muted">
        <small>© 2026 Propomy. All rights reserved.</small>
      </footer>
    </div>
  );
};

export default SingleEntry;
