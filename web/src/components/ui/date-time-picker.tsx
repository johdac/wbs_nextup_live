import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { CalendarIcon, Clock3 } from "lucide-react";
import "react-day-picker/style.css";

type DateTimePickerProps = {
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
};

type DateTimeRangePickerProps = {
  startValue: Date | null;
  endValue: Date | null;
  onChange: (nextStart: Date | null, nextEnd: Date | null) => void;
  placeholder?: string;
  onOpenChange?: (isOpen: boolean) => void;
};

const toTimeValue = (date: Date | null) => {
  if (!date) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const mergeDateAndTime = (baseDate: Date, sourceDate: Date | null) => {
  const merged = new Date(baseDate);
  if (sourceDate) {
    merged.setHours(sourceDate.getHours(), sourceDate.getMinutes(), 0, 0);
  }
  return merged;
};

const dayPickerModifiersStyles = {
  selected: {
    backgroundColor: "transparent",
    color: "rgb(147 51 234)",
    border: "2px solid rgb(147 51 234)",
    borderRadius: "9999px",
    fontWeight: 600,
  },
};

export const DateTimePicker = ({
  value,
  onChange,
  placeholder = "Pick a date and time",
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const buttonLabel = useMemo(() => {
    if (!value) return placeholder;
    return format(value, "PPP p");
  }, [value, placeholder]);

  const handleDaySelect = (nextDate: Date | undefined) => {
    if (!nextDate) {
      onChange(null);
      return;
    }

    const baseDate = value ?? new Date();
    const merged = new Date(nextDate);
    merged.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0);
    onChange(merged);
  };

  const handleTimeChange = (timeValue: string) => {
    if (!value) return;
    const [hours, minutes] = timeValue.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

    const next = new Date(value);
    next.setHours(hours, minutes, 0, 0);
    onChange(next);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      const targetNode = event.target as Node;
      if (!wrapperRef.current.contains(targetNode)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-left text-white focus:outline-none focus:border-purple-500 transition flex items-center justify-between"
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {buttonLabel}
        </span>
        <CalendarIcon className="h-4 w-4 text-purple-300" />
      </button>

      {open && (
        <div className="absolute z-120 mt-2 w-full min-w-72.5 rounded-lg border border-purple-500/40 bg-[#110b27] p-3 shadow-xl">
          <div className="rounded-md bg-black/20 p-2">
            <DayPicker
              mode="single"
              selected={value ?? undefined}
              onSelect={handleDaySelect}
              className="text-white nxp-daypicker"
              modifiersStyles={dayPickerModifiersStyles}
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-purple-300" />
            <input
              type="time"
              value={toTimeValue(value)}
              onChange={(event) => handleTimeChange(event.target.value)}
              disabled={!value}
              className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-md text-white disabled:opacity-50"
            />
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="px-3 py-1.5 text-sm rounded-md border border-purple-500/40 text-purple-200 hover:bg-purple-500/10"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-500"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const DateTimeRangePicker = ({
  startValue,
  endValue,
  onChange,
  placeholder = "Pick start and end date/time",
  onOpenChange,
}: DateTimeRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const buttonLabel = useMemo(() => {
    if (!startValue || !endValue) return placeholder;
    return `${format(startValue, "PPP p")} → ${format(endValue, "PPP p")}`;
  }, [startValue, endValue, placeholder]);

  const updateStartDate = (nextDate: Date | undefined) => {
    if (!nextDate) {
      onChange(null, endValue);
      return;
    }

    const nextStart = mergeDateAndTime(nextDate, startValue ?? new Date());
    if (endValue && endValue < nextStart) {
      const bumpedEnd = new Date(nextStart);
      bumpedEnd.setHours(bumpedEnd.getHours() + 2);
      onChange(nextStart, bumpedEnd);
      return;
    }
    onChange(nextStart, endValue);
  };

  const updateEndDate = (nextDate: Date | undefined) => {
    if (!nextDate) {
      onChange(startValue, null);
      return;
    }

    const nextEnd = mergeDateAndTime(
      nextDate,
      endValue ?? startValue ?? new Date(),
    );
    onChange(startValue, nextEnd);
  };

  const updateStartTime = (timeValue: string) => {
    if (!startValue) return;
    const [hours, minutes] = timeValue.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

    const nextStart = new Date(startValue);
    nextStart.setHours(hours, minutes, 0, 0);

    if (endValue && endValue < nextStart) {
      const bumpedEnd = new Date(nextStart);
      bumpedEnd.setHours(bumpedEnd.getHours() + 2);
      onChange(nextStart, bumpedEnd);
      return;
    }

    onChange(nextStart, endValue);
  };

  const updateEndTime = (timeValue: string) => {
    if (!endValue) return;
    const [hours, minutes] = timeValue.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

    const nextEnd = new Date(endValue);
    nextEnd.setHours(hours, minutes, 0, 0);
    onChange(startValue, nextEnd);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      const targetNode = event.target as Node;
      if (!wrapperRef.current.contains(targetNode)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-lg text-left text-white focus:outline-none focus:border-purple-500 transition flex items-center justify-between"
      >
        <span
          className={startValue && endValue ? "text-white" : "text-gray-400"}
        >
          {buttonLabel}
        </span>
        <CalendarIcon className="h-4 w-4 text-purple-300" />
      </button>

      {open && (
        <div className="absolute z-120 mt-2 w-full min-w-72.5 rounded-lg border border-purple-500/40 bg-[#110b27] p-3 shadow-xl">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-purple-200">
                Start
              </p>
              <div className="rounded-md bg-black/20 p-2">
                <DayPicker
                  mode="single"
                  selected={startValue ?? undefined}
                  onSelect={updateStartDate}
                  className="text-white nxp-daypicker"
                  modifiersStyles={dayPickerModifiersStyles}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-purple-300" />
                <input
                  type="time"
                  value={toTimeValue(startValue)}
                  onChange={(event) => updateStartTime(event.target.value)}
                  disabled={!startValue}
                  className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-md text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-purple-200">End</p>
              <div className="rounded-md bg-black/20 p-2">
                <DayPicker
                  mode="single"
                  selected={endValue ?? undefined}
                  onSelect={updateEndDate}
                  className="text-white nxp-daypicker"
                  modifiersStyles={dayPickerModifiersStyles}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-purple-300" />
                <input
                  type="time"
                  value={toTimeValue(endValue)}
                  onChange={(event) => updateEndTime(event.target.value)}
                  disabled={!endValue}
                  className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-md text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onChange(null, null);
                setOpen(false);
              }}
              className="px-3 py-1.5 text-sm rounded-md border border-purple-500/40 text-purple-200 hover:bg-purple-500/10"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-500"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
