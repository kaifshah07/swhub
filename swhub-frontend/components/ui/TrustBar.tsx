import { Truck, ShieldCheck, RotateCcw, Award, CheckCircle } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="w-full border-b border-neutral-200 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-wrap justify-center md:justify-between gap-6 sm:gap-8 text-xs sm:text-sm text-neutral-700 font-medium">
          <div className="flex items-center gap-2">
            <Truck size={20} className="text-primary shrink-0" /> 
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary shrink-0" /> 
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw size={20} className="text-primary shrink-0" /> 
            <span>Easy Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={20} className="text-primary shrink-0" /> 
            <span>Quality Products</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-primary shrink-0" /> 
            <span>Verified Sellers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
