import { InputProps } from "./input.types";
import clsx from "clsx";

export default function Input({
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={clsx(
        "w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-all",
        "focus:-sky- focus:ring-2 focus:-sky-",
        className
      )}
      {...props}
    />
  );
}