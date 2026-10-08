import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding homepage heroes and advertisements...");

  // 1. Clear existing heroes and ads if any
  await prisma.homepageHero.deleteMany({});
  await prisma.homepageAdvertisement.deleteMany({});

  // 2. Seed Heroes
  const heroes = [
    {
      title: "Kids Fashion Festival",
      subtitle: "Discover the cutest styles, dresses and festive sets with up to 60% OFF",
      desktopImage: "/banners/banner1.jpeg",
      mobileImage: "/banners/banner1.jpeg",
      buttonText: "Shop Fashion",
      buttonUrl: "/products?type=featured",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Fun & Educational Toys",
      subtitle: "Brain-boosting puzzles, blocks, ride-ons and imaginative playsets",
      desktopImage: "/banners/banner2.jpeg",
      mobileImage: "/banners/banner2.jpeg",
      buttonText: "Explore Toys",
      buttonUrl: "/products?type=trending",
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "Baby Care Essentials",
      subtitle: "Gentle skincare, diapers, strollers, and everyday infant necessities",
      desktopImage: "/banners/banner3.jpeg",
      mobileImage: "/banners/banner3.jpeg",
      buttonText: "Shop Baby Care",
      buttonUrl: "/products?type=new-arrivals",
      displayOrder: 3,
      isActive: true,
    },
    {
      title: "School Gear & Accessories",
      subtitle: "Trendy backpacks, water bottles, and stationery for curious minds",
      desktopImage: "/banners/banner4.jpeg",
      mobileImage: "/banners/banner4.jpeg",
      buttonText: "Explore School Gear",
      buttonUrl: "/products?type=best-sellers",
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
    // Wide banner
    {
      title: "Mega Kids Carnival — Extra 25% Off Code: CARNIVAL25",
      desktopImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=1600",
      mobileImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800",
      redirectUrl: "/products",
      position: "wide_banner",
      displayOrder: 1,
      isActive: true,
    },
    // Banner Strip 1 (or "banner_strip")
    {
      title: "Flat 40% OFF On Baby Gear",
      desktopImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1400",
      mobileImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=700",
      redirectUrl: "/products?type=trending",
      position: "banner_strip_1",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Cute Footwear Collection",
      desktopImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000",
      mobileImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      redirectUrl: "/products?type=new-arrivals",
      position: "banner_strip_1",
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "Action Figures & Dolls",
      desktopImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000",
      mobileImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500",
      redirectUrl: "/products?type=featured",
      position: "banner_strip_1",
      displayOrder: 3,
      isActive: true,
    },
    // Banner Strip 2
    {
      title: "Super Saver Packs for Toddlers",
      desktopImage: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1400",
      mobileImage: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700",
      redirectUrl: "/products?type=best-sellers",
      position: "banner_strip_2",
      displayOrder: 1,
      isActive: true,
    },
    {
      title: "Outdoor & Sports Toys",
      desktopImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000",
      mobileImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500",
      redirectUrl: "/products",
      position: "banner_strip_2",
      displayOrder: 2,
      isActive: true,
    },
    {
      title: "Bedtime Stories & Activity Books",
      desktopImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1000",
      mobileImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
      redirectUrl: "/products",
      position: "banner_strip_2",
      displayOrder: 3,
      isActive: true,
    },
  ];

  for (const ad of advertisements) {
    await prisma.homepageAdvertisement.create({ data: ad });
  }
  console.log(`Created ${advertisements.length} advertisements.`);

  // 4. Distribute product flags mutually exclusively
  // Reset all flags first
  await prisma.product.updateMany({
    data: {
      isFeatured: false,
      isTrending: false,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: false,
    },
  });

  // Assign distinct products
  await prisma.product.update({ where: { id: 1 }, data: { isNewArrival: true } });
  await prisma.product.update({ where: { id: 8 }, data: { isNewArrival: true } });

  await prisma.product.update({ where: { id: 2 }, data: { isFeatured: true } });
  await prisma.product.update({ where: { id: 3 }, data: { isFeatured: true } });

  await prisma.product.update({ where: { id: 4 }, data: { isTrending: true } });
  await prisma.product.update({ where: { id: 5 }, data: { isTrending: true } });

  await prisma.product.update({ where: { id: 6 }, data: { isBestSeller: true } });
  await prisma.product.update({ where: { id: 7 }, data: { isBestSeller: true } });

  await prisma.product.update({ where: { id: 9 }, data: { isFlashSale: true } });
  await prisma.product.update({ where: { id: 10 }, data: { isFlashSale: true } });

  console.log("Successfully assigned products mutually exclusively to sections.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
