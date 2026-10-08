import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div
      className="rounded-3xl bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)]"
    >
      {children}
    </div>
  );
}