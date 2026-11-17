import { useState } from "react";
import { useAutocomplete } from "../../utils/useAutoComplete";
import "../../styles/Map.css";

import type {
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
  RegisterOptions,
  UseFormWatch,
} from "react-hook-form";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";

interface AddressAutocompleteInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>;

  placeholder?: string;
  onAddressSelect?: (address: string) => void;
}

const AddressAutocompleteInput = <T extends FieldValues>({
  label,
  name,
  register,
  setValue,
  rules,
  watch,
  errors,
  disabled = false,
  placeholder = "Search address",
  onAddressSelect,
}: AddressAutocompleteInputProps<T>) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const formValue = watch(name) as string;
  const user = useSelector((state: RootState) => state.auth.user);

  const { suggestions, loading } = useAutocomplete(formValue || "");
  const error = errors[name];

  const updateValue = (value: string) => {
    setValue(name, value as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true,
    });
    onAddressSelect?.(value);
  };

  return (
    <div className="position-relative">
      <label className="custom-label mb-1">{label}</label>

      <input
        {...register(name, rules)}
        type="text"
        value={formValue || ""}
        disabled={disabled || user?.apiLimit === 0}
        placeholder={user?.apiLimit === 0 ? "API Limit Reached" : placeholder}
        autoComplete="off"
        className={`form-control custom-input ${error ? "is-invalid" : ""}`}
        onChange={(e) => {
          updateValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && (loading || suggestions.length > 0) && (
        <ul className="autocomplete-dropdown-custom">
          {loading ? (
            <li className="autocomplete-item loading">
              Loading suggestions...
            </li>
          ) : (
            suggestions.map((s, i) => (
              <li
                key={i}
                className="autocomplete-item"
                onClick={() => {
                  updateValue(s.address);
                  setShowSuggestions(false);
                }}
              >
                {s.address}
              </li>
            ))
          )}
        </ul>
      )}

      {error && (
        <div className="invalid-feedback">{error.message?.toString()}</div>
      )}
    </div>
  );
};

export default AddressAutocompleteInput;
