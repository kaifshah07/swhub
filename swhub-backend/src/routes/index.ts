import { Router } from "express";
import bannerRoutes from "../modules/banner/banner.routes";
import adminRoutes from "../modules/admin/admin.routes";
import productRoutes from "../modules/product/product.routes";
import publicProductRoutes from "../modules/product/public-product.routes";
import categoryRoutes from "../modules/category/category.routes";
import orderRoutes from "../modules/order/order.routes";
import { customerRoutes } from "../modules/customer";
import { couponRoutes } from "../modules/coupon";
import { settingsRoutes } from "../modules/settings";
import paymentRoutes from "../modules/payment/payment.routes";
import customerAuthRoutes from "../modules/customer-auth/customer-auth.routes";
import vendorEnquiryRoutes from "../modules/vendor-enquiry/vendor-enquiry.routes";
import franchiseEnquiryRoutes from "../modules/franchise-enquiry/franchise-enquiry.routes";
import franchiseUserRoutes from "../modules/franchise-user/franchise-user.routes";
import franchiseAuthRoutes from "../modules/franchise-auth/franchise-auth.routes";
import franchiseOrderRoutes from "../modules/franchise-order/franchise-order.routes";
import franchiseInventoryRoutes from "../modules/franchise-inventory/franchise-inventory.routes";
import franchiseInvoiceRoutes from "../modules/franchise-invoice/franchise-invoice.routes";
import franchiseDashboardRoutes from "../modules/franchise-dashboard/franchise-dashboard.routes";
import publicCategoryRoutes from "../modules/category/public-category.routes";
import subCategoryRoutes from "../modules/subcategory/subcategory.routes";
import homepageHeroRoutes from "../modules/homepage-hero/homepage-hero.routes";
import homepageAdvertisementRoutes from "../modules/homepage-advertisement/homepage-advertisement.routes";
import homepageSectionRoutes from "../modules/homepage-section/homepage-section.routes";
import homepageProductRoutes from "../modules/homepage-product/homepage-product.routes";
import trustFeatureRoutes from "../modules/trust-feature/trust-feature.routes";


const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

router.use("/admin", adminRoutes);
router.use("/admin/categories", categoryRoutes);
router.use("/admin/products", productRoutes);
router.use("/admin/banners", bannerRoutes);
router.use("/admin/homepage/heroes", homepageHeroRoutes);
router.use("/admin/homepage/advertisements", homepageAdvertisementRoutes);
router.use("/admin/homepage/products", homepageProductRoutes);

router.use("/categories", publicCategoryRoutes);
router.use("/subcategories", subCategoryRoutes); 
router.use("/products", publicProductRoutes);
router.use("/banners", bannerRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);
router.use("/coupons", couponRoutes);
router.use("/settings", settingsRoutes);
router.use("/payments", paymentRoutes);
router.use("/auth/customer", customerAuthRoutes);
router.use("/vendor-enquiries", vendorEnquiryRoutes);
router.use("/franchise-enquiries", franchiseEnquiryRoutes);
router.use("/franchise-users", franchiseUserRoutes);
router.use("/franchise-auth", franchiseAuthRoutes);
router.use("/franchise-orders", franchiseOrderRoutes);
router.use("/franchise-inventory", franchiseInventoryRoutes);
router.use("/franchise-invoices", franchiseInvoiceRoutes);
router.use("/franchise-dashboard", franchiseDashboardRoutes);
router.use("/homepage/heroes", homepageHeroRoutes);
router.use("/homepage/advertisements", homepageAdvertisementRoutes);
router.use("/homepage/sections", homepageSectionRoutes);
router.use("/homepage/products", homepageProductRoutes);
router.use("/admin/homepage/trust-features", trustFeatureRoutes);
router.use("/homepage/trust-features", trustFeatureRoutes);

export default router;