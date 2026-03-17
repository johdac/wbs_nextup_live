import type { InputHTMLAttributes } from "react";

type InputVariant = "default" | "glass" | "outline" | "event";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  variant?: InputVariant;
};

const variantClassMap: Record<InputVariant, string> = {
  default:
    "w-full rounded-md border border-gray-700 bg-gray-200 px-3 py-2 text-gray-900 outline-none transition focus:border-primary",
  glass:
    "w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur-md outline-none transition focus:border-purple-400",
  outline:
    "w-full rounded-md border-2 border-purple-500/60 bg-transparent px-3 py-2 text-white outline-none transition focus:border-purple-400",
  event: "w-full input-event-form",
};

export const Input = ({
  variant = "default",
  className = "",
  ...props
}: InputProps) => {
  return (
    <input
      {...props}
      className={`${variantClassMap[variant]} ${className}`.trim()}
    />
  );
};
