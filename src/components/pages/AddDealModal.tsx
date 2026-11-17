import React from "react";
import { toast } from "react-toastify";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AddressAutocompleteInput from "../common/AddressAutoComplete";
import { validationSchema } from "../../schemas/Deal.Schema";
import type { DealFormData } from "../../types/Deal";
import { ADD_DEAL_MUTATION } from "../../apollo/graphql/mutations/Deal";
import { useMutation } from "@apollo/client/react";
import type {
  AddDealMutationResponse,
  AddDealMutationVariables,
} from "../../types/Deal";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { DEALS_PER_PAGE } from "../../hooks/useDeal";
import { GET_MY_DEALS } from "../../apollo/graphql/queries/Deal";

interface AddDealModalProps {
  show: boolean;
  handleClose: () => void;
  onSaved: () => void;
}

const AddDealModal: React.FC<AddDealModalProps> = ({
  show,
  handleClose,
  onSaved,
}) => {
  const [addDeal, { loading }] = useMutation<
    AddDealMutationResponse,
    AddDealMutationVariables
  >(ADD_DEAL_MUTATION, {
    refetchQueries: [
      {
        query: GET_MY_DEALS,
        variables: {
          pagination: {
            limit: DEALS_PER_PAGE,
            offset: 0,
          },
        },
      },
    ],
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: yupResolver(validationSchema) as Resolver<DealFormData>,
    defaultValues: {
      strategy: "Wholesale",
      status: "Analyzing",
      targetCloseDate: new Date().toISOString().split("T")[0],
      contactRole: "Seller",
    },
  });

  const onSubmit = async (data: DealFormData) => {
    const formattedInput = {
      ...data,
      acqCost: Number(data.acqCost),
    };

    try {
      const { data: responseData } = await addDeal({
        variables: { input: formattedInput },
      });

      const result = responseData?.addDeal;

      if (!result?.success) {
        toast.error(result?.message || "Failed to add deal. Please try again.");
        return;
      }

      toast.success("Deal added successfully!");
      reset();
      onSaved(); // instead of handleClose()
    } catch (err) {
      console.error("Mutation Execution Error:", err);
      toast.error("An error occurred while adding the deal. Please try again.");
    }
  };

  const onModalHide = () => {
    reset();
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={onModalHide}
      centered
      size="lg"
      className="add-deal-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Deal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3 mx-2" controlId="formPropertyAddress">
            <AddressAutocompleteInput<DealFormData>
              label="Property Address *"
              name="address"
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              placeholder="e.g. 412 Maple Ave, Columbus, OH 43201"
            />
            <Form.Text
              className="text-muted small d-block mt-1"
              style={{ fontSize: "0.75rem" }}
            >
              Address autocomplete linked to the property record, so valuations
              and rent estimates attach to this deal.
            </Form.Text>
          </Form.Group>

          <Row className="mb-3">
            {/* Deal Type */}
            <Col md={6}>
              <Form.Group controlId="formDealType">
                <Form.Label className="fw-semibold text-muted small">
                  Deal Type
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.strategy}
                  {...register("strategy")}
                >
                  <option value="Wholesale">Wholesale</option>
                  <option value="Buy & Hold">Buy & Hold</option>
                  <option value="Fix & Flip">Fix & Flip</option>
                  <option value="BRRRR">BRRRR</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Acquisition Cost */}
            <Col md={6}>
              <Form.Group controlId="formAcquisitionCost">
                <Form.Label className="fw-semibold text-muted small">
                  Acquisition Cost ($) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="186000"
                  isInvalid={!!errors.acqCost}
                  {...register("acqCost")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.acqCost?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Status */}
            <Col md={6}>
              <Form.Group controlId="formStatus">
                <Form.Label className="fw-semibold text-muted small">
                  Status
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.status}
                  {...register("status")}
                >
                  <option value="Analyzing">Analyzing</option>
                  <option value="Negotiating">Negotiating</option>
                  <option value="Offer Made">Offer Made</option>
                  <option value="Under Contract">Under Contract</option>
                  <option value="Closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Target Close Date */}
            <Col md={6}>
              <Form.Group controlId="formTargetCloseDate">
                <Form.Label className="fw-semibold text-muted small">
                  Target Close Date
                </Form.Label>
                <Form.Control
                  type="date"
                  isInvalid={!!errors.targetCloseDate}
                  {...register("targetCloseDate")}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Contact Name */}
            <Col md={6}>
              <Form.Group controlId="formContactName">
                <Form.Label className="fw-semibold text-muted small">
                  Contact Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Maria Reyes"
                  isInvalid={!!errors.contactName}
                  {...register("contactName")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contactName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Contact Phone */}
            <Col md={6}>
              <Form.Group controlId="formContactPhone">
                <Form.Label className="fw-semibold text-muted small">
                  Contact Phone
                </Form.Label>
                <PhoneInput
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  countries={["US", "CA"]}
                  value={watch("contactPhone") ?? undefined}
                  onChange={(value) =>
                    setValue("contactPhone", value ?? "", {
                      shouldValidate: true,
                    })
                  }
                  className={`custom-phone-input ${errors.contactPhone ? "is-invalid" : ""}`}
                />
                {errors.contactPhone && (
                  <div
                    className="text-danger small mt-1"
                    style={{ fontSize: "0.875em" }}
                  >
                    {errors.contactPhone.message}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formContactRole">
                <Form.Label className="fw-semibold text-muted small">
                  Contact Role
                </Form.Label>
                <Form.Select
                  isInvalid={!!errors.contactRole}
                  {...register("contactRole")}
                >
                  <option value="Seller">Seller</option>
                  <option value="Agent">Agent</option>
                  <option value="Wholesaler">Wholesaler</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Contact Email */}
            <Col md={6}>
              <Form.Group controlId="formContactEmail">
                <Form.Label className="fw-semibold text-muted small">
                  Contact Email
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@email.com"
                  isInvalid={!!errors.contactEmail}
                  {...register("contactEmail")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contactEmail?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Notes */}
          <Form.Group className="mb-4 mx-3" controlId="formNotes">
            <Form.Label className="fw-semibold text-muted small">
              Notes
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Seller open to $8k credit for roof. Inspection scheduled Friday."
              isInvalid={!!errors.notes}
              {...register("notes")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.notes?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={onModalHide}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                "Save Deal"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDealModal;
