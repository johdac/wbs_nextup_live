import { ChevronDown } from "lucide-react";

type LocationOption = {
  id?: string;
  _id?: string;
  name: string;
  city?: string;
};

type LocationSelectDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: LocationOption[];
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  placeholder?: string;
};

export const LocationSelectDropdown = ({
  value,
  onChange,
  options,
  disabled,
  loading,
  loadingText = "Loading locations...",
  placeholder = "Select a location",
}: LocationSelectDropdownProps) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pr-10 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition appearance-none"
        style={{ backgroundColor: "#110b27" }}
        disabled={disabled}
        required
      >
        <option value="">{loading ? loadingText : placeholder}</option>
        {options.map((location) => (
          <option
            key={location.id || location._id}
            value={location.id || location._id}
          >
            {location.name} - {location.city || "Unknown City"}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
    </div>
  );
};
