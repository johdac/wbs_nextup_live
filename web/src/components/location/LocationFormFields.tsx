import type { ReactNode } from "react";

type LocationFormFieldsProps = {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  onNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onZipChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  pendingLabel: string;
  isSubmitting: boolean;
  validationMessage?: string;
  topSlot?: ReactNode;
  actionSlot?: ReactNode;
};

export const LocationFormFields = ({
  name,
  address,
  city,
  zip,
  country,
  onNameChange,
  onAddressChange,
  onCityChange,
  onZipChange,
  onCountryChange,
  onSubmit,
  submitLabel,
  pendingLabel,
  isSubmitting,
  validationMessage,
  topSlot,
  actionSlot,
}: LocationFormFieldsProps) => {
  return (
    <div className="space-y-3 mb-4">
      {topSlot}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Central Arena"
          className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="e.g., 123 Main St"
          className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="e.g., Berlin"
            className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Zip
          </label>
          <input
            type="text"
            value={zip}
            onChange={(e) => onZipChange(e.target.value)}
            placeholder="e.g., 10115"
            className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Country
        </label>
        <input
          type="text"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          placeholder="e.g., Germany"
          className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      {validationMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{validationMessage}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? pendingLabel : submitLabel}
      </button>

      {actionSlot}
    </div>
  );
};
