import type { ReactNode } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

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
        <Label htmlFor="location-name" className="label-event-form mb-1">
          Name *
        </Label>
        <Input
          id="location-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Central Arena"
          variant="event"
        />
      </div>

      <div>
        <Label htmlFor="location-address" className="label-event-form mb-1">
          Address
        </Label>
        <Input
          id="location-address"
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="e.g., 123 Main St"
          variant="event"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="location-city" className="label-event-form mb-1">
            City
          </Label>
          <Input
            id="location-city"
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="e.g., Berlin"
            variant="event"
          />
        </div>
        <div>
          <Label htmlFor="location-zip" className="label-event-form mb-1">
            Zip
          </Label>
          <Input
            id="location-zip"
            type="text"
            value={zip}
            onChange={(e) => onZipChange(e.target.value)}
            placeholder="e.g., 10115"
            variant="event"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location-country" className="label-event-form mb-1">
          Country
        </Label>
        <Input
          id="location-country"
          type="text"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          placeholder="e.g., Germany"
          variant="event"
        />
      </div>

      {validationMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{validationMessage}</p>
        </div>
      )}

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        variant="secondary"
        fullWidth
      >
        {isSubmitting ? pendingLabel : submitLabel}
      </Button>

      {actionSlot}
    </div>
  );
};
