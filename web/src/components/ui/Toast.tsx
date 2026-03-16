import { Alert, Snackbar } from "@mui/material";

interface ToastProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
  autoHideDuration?: number;
}

export function Toast({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 3000,
}: ToastProps) {
  const handleClose = (_event?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
