import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-full px-6 py-3 text-sm font-semibold transition duration-300",
       {
  "bg-slate-900 text-white hover:bg-black": variant === "primary",
  "border border-slate-800 text-slate-600 bg-transparent hover:bg-slate-900 hover:text-white": variant === "outline",
  "bg-red-600 text-white hover:bg-red-600": variant === "danger",
  "bg-slate-200 text-black hover:bg-slate-300": variant === "secondary",
},
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}