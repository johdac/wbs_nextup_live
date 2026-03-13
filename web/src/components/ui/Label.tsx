import type { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
};

export const Label = ({
  children,
  htmlFor,
  className = "block text-sm font-medium text-gray-300",
}: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
};
