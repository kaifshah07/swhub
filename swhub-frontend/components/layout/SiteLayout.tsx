"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/footer/Footer";
import AuthModal from "@/components/auth/AuthModal";
import CartDrawer from "@/components/cart/CartDrawer";
import MobileBottomNav from "@/components/layout/Navbar/MobileBottomNav";
// import TopOfferBar from "@/components/layout/TopOfferBar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");
  // Hide navbar on franchise panel pages, but SHOW it on the public /franchise page
  const isFranchisePanel = pathname.startsWith("/franchise/") && pathname !== "/franchise";
  const isOrderSuccessPage = pathname.startsWith("/order-success");

  // Pages with custom layouts
  if (
    isAdminPage ||
    isFranchisePanel ||
    isOrderSuccessPage
  ) {
    return <>{children}</>;
  }

  return (
    <>
      {/* <TopOfferBar /> */}

      <Navbar />

      <main className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      <MobileBottomNav />

      <Footer />

      <CartDrawer />
      <AuthModal />
    </>
  );
}