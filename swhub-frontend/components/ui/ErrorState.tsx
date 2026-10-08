import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  returnLink?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected error while loading this page. Please try again.",
  onRetry,
  returnLink = "/",
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm">
        <AlertTriangle size={32} />
      </div>
      <h2 className="mb-2 text-xl font-black text-slate-900">{title}</h2>
      <p className="mb-8 max-w-sm text-sm text-neutral-500">{message}</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 active:scale-95"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        )}
        <Link
          href={returnLink}
          className="flex items-center gap-2 rounded-xl bg-neutral-100 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-neutral-200 active:scale-95"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
