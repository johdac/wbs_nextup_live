import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export default function DateTimeInput({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
}) {
  const handleChange = (dayjsDate: Dayjs | null) => {
    onChange(dayjsDate ? dayjsDate.toDate() : null);
  };

  return (
    <DatePicker
      label="From Date"
      value={value ? dayjs(value) : null}
      onChange={handleChange}
      slotProps={{
        textField: {
          fullWidth: true,
          className: "mui-white-outline",
        },
      }}
    />
  );
}
