import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SW Hub | Daily Needs & Household Marketplace",
  description:
    "Your trusted daily-needs marketplace for fresh groceries, beverages, crockery, kitchenware, personal care, cleaning supplies, and household essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} font-sans bg-slate-50 text-slate-900 antialiased`}
      >
        <Toaster position="top-right" />
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
