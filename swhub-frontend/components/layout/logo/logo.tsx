import Link from "next/link";

interface LogoProps {
  href?: string;
  variant?: "light" | "dark";
  showTagline?: boolean;
  className?: string;
}

export default function Logo({
  href = "/",
  variant = "light",
  showTagline = true,
  className = "",
}: LogoProps) {
  const isDark = variant === "dark";

  return (
    <Link
      href={href}
      className={`group flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-95 ${className}`}
      aria-label="SW Hub - Daily Needs Marketplace"
    >
      {/* Modern Retail Emblem */}
      <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white shadow-md shadow-blue-900/20 transition-transform duration-300 group-hover:scale-105">
        <span className="font-black text-base sm:text-lg tracking-tighter text-white">
          SW
        </span>
        
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span
            className={`text-xl sm:text-2xl font-black tracking-tight ${
              isDark ? "text-white" : "text-slate-600"
            }`}
          >
            SW
          </span>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-primary">
            HUB
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-0.5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Daily Needs Market
          </span>
        )}
      </div>
    </Link>
  );
}
