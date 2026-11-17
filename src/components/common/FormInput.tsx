import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  options?: { label: string; value: string }[]; // Added for Select support
}

const FormInput = <T extends FieldValues>({
  label,
  name,
  register,
  errors,
  placeholder,
  type = "text",
  disabled = false,
  min,
  max,
  options,
}: FormInputProps<T>) => {
  const error = errors[name];

  return (
    <div>
      <label className="custom-label mb-1">{label}</label>

      {options ? (
        <select
          {...register(name)}
          disabled={disabled}
          className={`form-select custom-input ${error ? "is-invalid" : ""}`}
        >
          <option value="">{placeholder || "Select option..."}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          {...register(name)}
          className={`form-control custom-input ${error ? "is-invalid" : ""}`}
        />
      )}

      {error && (
        <div className="invalid-feedback">{error.message?.toString()}</div>
      )}
    </div>
  );
};

export default FormInput;
