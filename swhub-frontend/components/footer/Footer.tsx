import Link from "next/link";
import Logo from "../layout/logo/logo";
import TrustBar from "../ui/TrustBar";
import { Users, Camera, MessageSquare, PlayCircle, Briefcase } from "lucide-react";

const SOCIAL_LINKS = [
  { name: "Facebook", icon: Users, href: "#" },
  { name: "Instagram", icon: Camera, href: "#" },
  { name: "X (Twitter)", icon: MessageSquare, href: "#" },
  { name: "YouTube", icon: PlayCircle, href: "#" },
  { name: "LinkedIn", icon: Briefcase, href: "#" },
];

const CATEGORY_LINKS = [
  { name: "Groceries & Staples", href: "/categories/groceries-staples" },
  { name: "Beverages & Juices", href: "/categories/beverages-juices" },
  { name: "Crockery & Kitchenware", href: "/categories/crockery-kitchenware" },
  { name: "Cleaning Supplies", href: "/categories/cleaning-household" },
  { name: "Personal Care & Hygiene", href: "/categories/personal-care" },
  { name: "Packaged Foods & Snacks", href: "/categories/packaged-foods" },
  { name: "Stationery & Office", href: "/categories/stationery-office" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-neutral-400">
      <TrustBar />
      
      {/* Top Area */}
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <Logo variant="dark" />
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-neutral-400">
              India's trusted daily-needs marketplace for fresh groceries, packaged foods, crockery, kitchenware, personal care, and household essentials.
            </p>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-bold text-sm tracking-wide text-white mb-4">
              Shop Categories
            </h3>
            <ul className="space-y-3 text-sm text-neutral-300">
              {CATEGORY_LINKS.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-sm tracking-wide text-white mb-4">
              Customer Support
            </h3>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li><Link href="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors">Track Orders</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary transition-colors">Saved Wishlist</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          {/* Partner With Us */}
          <div>
            <h3 className="font-bold text-sm tracking-wide text-white mb-4">
              Partner With SW Hub
            </h3>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li><Link href="/become-a-vendor" className="hover:text-primary transition-colors">Sell as Vendor</Link></li>
              <li><Link href="/franchise" className="hover:text-primary transition-colors">Open Store Franchise</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Bulk B2B Supply</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Advertise with Us</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-bold text-sm tracking-wide text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm mb-6 text-neutral-300">
              <li>Email: support@swhub.com</li>
              <li>Helpline: 1800-SW-HUB</li>
              <li>Mumbai · Bangalore · Delhi NCR</li>
            </ul>
            
            <h4 className="font-bold text-sm tracking-wide text-white mb-3">
              Connect
            </h4>
            <div className="flex gap-2 flex-wrap">
              {SOCIAL_LINKS.map(social => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    aria-label={social.name} 
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-neutral-300 hover:bg-primary hover:text-white transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
            <p>© 2026 SW Hub. All Rights Reserved.</p>
            <div className="flex gap-4 sm:gap-6 flex-wrap justify-center text-neutral-300">
              <Link href="/contact" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Refund & Return Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}