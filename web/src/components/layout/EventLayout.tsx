import { CalendarIcon, Save } from "lucide-react";
import dayjs from "dayjs";
import { DateTimeRangePicker } from "../ui/date-time-picker";
import { FileUploadField } from "../ui/FileUpload";
import type { EventFormValues } from "../../types/event";

interface EventLayoutProps {
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

export const EventLayout = ({
  title,
  description,
  startDate,
  endDate,
  isDateRangePickerOpen,
  setValue,
  setIsDateRangePickerOpen,
  setEventMainImageFile,
  EventMutation,
}: EventLayoutProps) => {
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setValue("title", e.target.value)}
          placeholder="e.g., Summer Music Festival 2026"
          className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setValue("description", e.target.value)}
          placeholder="Describe your event..."
          rows={4}
          className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
        />
      </div>

      {/* Date Range Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Event Start & End *</label>
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Image Upload</label>
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
