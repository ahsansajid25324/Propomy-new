import { Form } from "react-bootstrap";
import React from "react";

interface FormFieldProps {
  controlId: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  controlId,
  label,
  children,
  error,
  required = false,
  className = "",
}) => (
  <Form.Group controlId={controlId} className={className}>
    <Form.Label className="custom-label">
      {label}
      {required ? " *" : ""}
    </Form.Label>
    {children}
    {error && (
      <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
        {error}
      </Form.Control.Feedback>
    )}
  </Form.Group>
);

export default FormField;
