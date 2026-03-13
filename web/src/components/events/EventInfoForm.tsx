import { CalendarIcon, Save } from "lucide-react";
import dayjs from "dayjs";
import { DateTimeRangePicker } from "../ui/date-time-picker";
import { FileUploadField } from "../ui/FileUpload";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import type { EventFormValues } from "../../types/event";

interface EventInfoFormProps {
  title: string;
  description: string;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  isDateRangePickerOpen: boolean;
  setValue: (field: keyof EventFormValues, value: any) => void;
  setIsDateRangePickerOpen: (open: boolean) => void;
  setEventMainImageFile: (file: File | null) => void;
  EventMutation: {
    isPending: boolean;
  };
}

export const EventInfoForm = ({
  title,
  description,
  startDate,
  endDate,
  isDateRangePickerOpen,
  setValue,
  setIsDateRangePickerOpen,
  setEventMainImageFile,
  EventMutation,
}: EventInfoFormProps) => {
  return (
    <div
      className={`bg-purple/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 space-y-6 transition-all duration-300 ${
        isDateRangePickerOpen ? "pb-120" : ""
      }`}
    >
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <CalendarIcon className="h-6 w-6" />
        Event Information
      </h2>

      {/* Title */}
      <div>
        <Label htmlFor="event-title" className="block text-sm font-medium text-gray-300 mb-2">
          Event Title *
        </Label>
        <Input
          id="event-title"
          type="text"
          value={title}
          onChange={(e) => setValue("title", e.target.value)}
          placeholder="e.g., Summer Music Festival 2026"
          variant="event"
          className="px-4 py-3"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="event-description" className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </Label>
        <textarea
          id="event-description"
          value={description}
          onChange={(e) => setValue("description", e.target.value)}
          placeholder="Describe your event..."
          rows={4}
          className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
        />
      </div>

      {/* Date Range Picker */}
      <div>
        <Label className="block text-sm font-medium text-gray-300 mb-2">
          Event Start & End *
        </Label>
        <DateTimeRangePicker
          startValue={startDate ? startDate.toDate() : null}
          endValue={endDate ? endDate.toDate() : null}
          onOpenChange={setIsDateRangePickerOpen}
          onChange={(nextStart: Date | null, nextEnd: Date | null) => {
            setValue("startDate", nextStart ? dayjs(nextStart).toISOString() : "");
            setValue("endDate", nextEnd ? dayjs(nextEnd).toISOString() : "");
          }}
        />
      </div>

      {/* Image Upload for Event */}
      <div>
        <Label className="block text-sm font-medium text-gray-300 mb-2">
          Image Upload
        </Label>
        <FileUploadField uploadType="artistImage" onFileChange={setEventMainImageFile} />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={EventMutation.isPending}
        className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="h-5 w-5" />
        {EventMutation.isPending ? "Creating Event..." : "Save Event"}
      </button>
    </div>
  );
};
