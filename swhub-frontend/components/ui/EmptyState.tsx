import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  ctaText,
  ctaLink,
  onCtaClick,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-50 shadow-sm text-neutral-400">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h2 className="mb-3 text-2xl font-black text-slate-900">{title}</h2>
      <p className="mb-8 max-w-md text-sm text-neutral-500">{description}</p>
      
      {ctaText && (
        ctaLink ? (
          <Link
            href={ctaLink}
            className="rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-blue-600 active:scale-95"
          >
            {ctaText}
          </Link>
        ) : (
          <button
            onClick={onCtaClick}
            className="rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-blue-600 active:scale-95"
          >
            {ctaText}
          </button>
        )
      )}
    </div>
  );
}
