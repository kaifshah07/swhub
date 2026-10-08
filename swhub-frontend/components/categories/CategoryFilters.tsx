"use client";

const QUICK_FILTERS = [
  "Everyday Essentials",
  "Top Rated",
  "Family Saver Pack",
  "Best Value Deals",
  "Express Delivery",
  "Bulk Refill Pack",
];

interface CategoryFiltersProps {
  subcategories?: { id: number; name: string }[];
  selectedSubcategory?: string;
  onSelectSubcategory?: (id: string) => void;
  selectedAge?: string;
  onSelectAge?: (age: string) => void;
  onClear?: () => void;
}

export default function CategoryFilters({
  subcategories = [],
  selectedSubcategory = "",
  onSelectSubcategory,
  selectedAge = "",
  onSelectAge,
  onClear,
}: CategoryFiltersProps) {
  return (
    <div className="sticky top-24 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Refine Results</h3>
        {(selectedSubcategory || selectedAge) && (
          <button
            onClick={onClear}
            className="text-xs font-bold text-primary hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {subcategories.length > 0 && (
        <div className="pb-4 border-b border-slate-100">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
            Sub-Aisles
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            <button
              onClick={() => onSelectSubcategory && onSelectSubcategory("")}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedSubcategory === ""
                  ? "bg-slate-50 text-primary font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Items In Department
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectSubcategory && onSelectSubcategory(String(sub.id))}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedSubcategory === String(sub.id)
                    ? "bg-slate-50 text-primary font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
          Quick Filters
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_FILTERS.map((item) => (
            <button
              key={item}
              onClick={() => onSelectAge && onSelectAge(selectedAge === item ? "" : item)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                selectedAge === item
                  ? "border-primary bg-primary text-white shadow-xs"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}