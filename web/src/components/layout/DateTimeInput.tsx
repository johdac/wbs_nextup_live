import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function DateTimeInput({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
}) {
  return (
    <DateTimePicker
      label="Date & Time"
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <TextField {...params} fullWidth className="mui-white-outline" />
      )}
      ampm={false}
      inputFormat="yyyy/MM/dd HH:mm"
    />
  );
}
