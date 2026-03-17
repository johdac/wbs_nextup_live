import { CircleAlert } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="p-2 flex items-center rounded-lg bg-red-500/20 border border-red-500 text-red-800 text-sm mb-2">
      <CircleAlert className="text-red-800 pr-2" /> {message}
    </div>
  );
};
