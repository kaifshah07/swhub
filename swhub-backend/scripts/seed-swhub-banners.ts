import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SW Hub homepage heroes and advertisements...");

  // 1. Clear existing heroes and ads
  await prisma.homepageHero.deleteMany({});
  await prisma.homepageAdvertisement.deleteMany({});

  // 2. Seed Heroes
  const heroes = [
    {
      title: "Daily Grocery Savings",
      subtitle: "Save up to 40% on flours, oils, dals & daily kitchen staples",
      desktopImage: "/banners/banner1.jpeg",
      mobileImage: "/banners/banner1.jpeg",
      buttonText: "Shop Groceries",
      buttonUrl: "/categories/groceries-staples",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Morning Breakfast & Beverages",
      subtitle: "Premium tea, instant coffee, healthy oats & fresh juices",
      desktopImage: "/banners/banner2.jpeg",
      mobileImage: "/banners/banner2.jpeg",
      buttonText: "Explore Beverages",
      buttonUrl: "/categories/beverages-juices",
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "Cookware & Kitchen Essentials",
      subtitle: "Stainless steel flasks, storage containers & non-stick cookware",
      desktopImage: "/banners/banner3.jpeg",
      mobileImage: "/banners/banner3.jpeg",
      buttonText: "Shop Kitchenware",
      buttonUrl: "/categories/crockery-kitchenware",
      displayOrder: 3,
      isActive: true,
    },
    {
      title: "Spotless Cleaning & Home Care",
      subtitle: "Detergent powders, floor cleaners, dishwash gels & handwashes",
      desktopImage: "/banners/banner4.jpeg",
      mobileImage: "/banners/banner4.jpeg",
      buttonText: "Shop Home Care",
      buttonUrl: "/categories/cleaning-household",
      displayOrder: 4,
      isActive: true,
    },
  ];

  for (const h of heroes) {
    await prisma.homepageHero.create({ data: h });
  }
  console.log(`Created ${heroes.length} hero slides.`);

  // 3. Seed Advertisements
  const advertisements = [
    {
      title: "Mega Pantry Carnival — Extra Discounts On Monthly Restock",
      desktopImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600",
      mobileImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
      redirectUrl: "/products",
      position: "wide_banner",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Pantry Staples & Cooking Oils",
      desktopImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000",
      mobileImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500",
      redirectUrl: "/categories/groceries-staples",
      position: "banner_strip_1",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Teatime Munchies & Snacks",
      desktopImage: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1000",
      mobileImage: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500",
      redirectUrl: "/categories/packaged-foods",
      position: "banner_strip_1",
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "Home & Personal Hygiene",
      desktopImage: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1000",
      mobileImage: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500",
      redirectUrl: "/categories/cleaning-household",
      position: "banner_strip_2",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Stainless Steel Flasks & Cookware",
      desktopImage: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1000",
      mobileImage: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      redirectUrl: "/categories/crockery-kitchenware",
      position: "banner_strip_2",
      displayOrder: 2,
      isActive: true,
    },
  ];

  for (const ad of advertisements) {
    await prisma.homepageAdvertisement.create({ data: ad });
  }
  console.log(`Created ${advertisements.length} advertisements.`);
  console.log("✅ SW Hub Banners Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
