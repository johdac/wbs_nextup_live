import { useState } from "react";

type ToastSeverity = "success" | "error" | "info" | "warning";

interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message: string, severity: ToastSeverity = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast((current) => ({ ...current, open: false }));
  };

  return { toast, showToast, closeToast };
}
