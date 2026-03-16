import { Toaster } from "react-hot-toast";

export const AppToaster = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 50000,
        removeDelay: 1000,
        success: {
          duration: 3000,
          iconTheme: {
            primary: "var(--color-green)",
            secondary: "white",
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: "var(--color-orange)",
            secondary: "white",
          },
        },
      }}
    />
  );
};
