import OfferStrip from "@/components/homepage/TopBar/OfferStrip";
import MegaMenu from "@/components/homepage/MegaMenu/MegaMenu";
import MainHero from "@/components/homepage/Hero/MainHero";
import CategoryGrid from "@/components/homepage/Categories/CategoryGrid";
import AgeGroupGrid from "@/components/homepage/Categories/AgeGroupGrid";
import FlashSale from "@/components/homepage/FlashSale/FlashSale";
import ProductGrid from "@/components/homepage/Products/ProductGrid";
import WideBanner from "@/components/homepage/PromoBanners/WideBanner";
import BannerStrip from "@/components/homepage/PromoBanners/BannerStrip";
import CollectionStrip from "@/components/homepage/Collections/CollectionStrip";
import BrandSlider from "@/components/homepage/Brands/BrandSlider";
import BusinessSection from "@/components/homepage/BusinessStrip/BusinessStrip";
import Testimonials from "@/components/homepage/Testimonials/Testimonials";
import Newsletter from "@/components/homepage/Newsletter/Newsletter";
import TrustSection from "@/components/homepage/Trust/TrustSection";

export default function HomePage() {
  return (
    <>
      <OfferStrip />
      <MegaMenu />
      <MainHero />
      <CategoryGrid />
      <FlashSale />
      <WideBanner />
      <AgeGroupGrid />
      
      <ProductGrid type="trending" title="Trending Essentials & Groceries" />
      
      <BannerStrip position="banner_strip_1" title="Special Pantry & Home Offers" />
      {/* <CollectionStrip /> */}
      
      <ProductGrid type="new-arrivals" title="New Arrivals" />
      
      <BannerStrip position="banner_strip_2" title="More Exciting Deals" />
      <BrandSlider />
      <BusinessSection />
      
      <ProductGrid type="best-sellers" title="Best Sellers" />
      
      <Testimonials />
      <Newsletter />
      <TrustSection />
    </>
  );
}