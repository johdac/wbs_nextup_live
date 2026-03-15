import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "secondary" | "cancel" | "gradient";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantClassMap: Record<ButtonVariant, string> = {
  default: "btn-default",
  secondary: "btn-secondary",
  cancel: "btn-cancel",
  gradient:
    "cursor-pointer bg-linear-to-r from-primary to-secondary text-white font-bold rounded-lg hover:opacity-90 transition",
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-4 py-3",
};

export const Button = ({
  variant = "default",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClassMap[variant],
        sizeClassMap[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .join(" ")
        .trim()}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};
