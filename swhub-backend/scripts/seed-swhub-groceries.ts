import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SW Hub Grocery & FMCG Seed...");

  // Categories
  const categoriesData = [
    {
      name: "Groceries & Staples",
      slug: "groceries-staples",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
      description: "Daily flours, rice, dals, edible oils and cooking essentials",
      subcategories: [
        { name: "Cooking Oils & Ghee", slug: "cooking-oils-ghee" },
        { name: "Flours & Grains", slug: "flours-grains" },
        { name: "Rice & Dals", slug: "rice-dals" },
      ],
    },
    {
      name: "Beverages & Juices",
      slug: "beverages-juices",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600",
      description: "Tea, coffee, health drinks, fruit juices and cold drinks",
      subcategories: [
        { name: "Tea & Coffee", slug: "tea-coffee" },
        { name: "Fruit Juices", slug: "fruit-juices" },
      ],
    },
    {
      name: "Crockery & Kitchenware",
      slug: "crockery-kitchenware",
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600",
      description: "Non-stick pans, steel flasks, dinner sets and storage jars",
      subcategories: [
        { name: "Bottles & Flasks", slug: "bottles-flasks" },
        { name: "Cookware & Jars", slug: "cookware-jars" },
      ],
    },
    {
      name: "Personal Care",
      slug: "personal-care",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
      description: "Soaps, shampoos, oral care and hygiene essentials",
      subcategories: [
        { name: "Oral Care", slug: "oral-care" },
        { name: "Body Wash & Soaps", slug: "body-wash-soaps" },
      ],
    },
    {
      name: "Cleaning & Household",
      slug: "cleaning-household",
      image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=600",
      description: "Detergent powders, floor cleaners, dishwash and wipes",
      subcategories: [
        { name: "Laundry & Detergents", slug: "laundry-detergents" },
        { name: "Dishwash & Cleaners", slug: "dishwash-cleaners" },
      ],
    },
    {
      name: "Packaged Foods & Snacks",
      slug: "packaged-foods",
      image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&q=80&w=600",
      description: "Biscuits, namkeens, chips, instant noodles and chocolates",
      subcategories: [
        { name: "Biscuits & Cookies", slug: "biscuits-cookies" },
        { name: "Namkeen & Munchies", slug: "namkeen-munchies" },
      ],
    },
    {
      name: "Stationery & Office",
      slug: "stationery-office",
      image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600",
      description: "Notebooks, pens, desk organizers and paper supplies",
      subcategories: [
        { name: "Notebooks & Pens", slug: "notebooks-pens" },
      ],
    },
    {
      name: "Dairy & Breakfast",
      slug: "dairy-breakfast",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600",
      description: "Butter, cheese, paneer, oats, cornflakes and milk powder",
      subcategories: [
        { name: "Cereals & Oats", slug: "cereals-oats" },
      ],
    },
  ];

  const categoryMap = new Map<string, any>();
  const subcategoryMap = new Map<string, any>();

  for (const cat of categoriesData) {
    let existingCat = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existingCat) {
      existingCat = await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          description: cat.description,
        },
      });
      console.log(`Created Category: ${cat.name}`);
    }
    categoryMap.set(cat.slug, existingCat);

    for (const sub of cat.subcategories) {
      let existingSub = await prisma.subcategory.findFirst({
        where: { categoryId: existingCat.id, slug: sub.slug },
      });
      if (!existingSub) {
        existingSub = await prisma.subcategory.create({
          data: {
            name: sub.name,
            slug: sub.slug,
            categoryId: existingCat.id,
          },
        });
        console.log(`  Created Subcategory: ${sub.name}`);
      }
      subcategoryMap.set(sub.slug, existingSub);
    }
  }

  // Products
  const productsList = [
    {
      name: "Fortune Sunlite Refined Sunflower Oil 1L",
      slug: "fortune-sunlite-sunflower-oil-1l",
      sku: "SKU-FORTUNE-OIL-1L",
      brand: "Fortune",
      price: 175,
      discountPrice: 145,
      stock: 50,
      categorySlug: "groceries-staples",
      subcategorySlug: "cooking-oils-ghee",
      thumbnail: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Refined sunflower oil enriched with Vitamins A & D for healthy everyday cooking.",
      description: "Fortune Sunlite Refined Sunflower Oil is a light, healthy oil that helps maintain an active lifestyle. Low absorb technology.",
      isTrending: true,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Tata Tea Premium Desh Ki Chai 500g",
      slug: "tata-tea-premium-500g",
      sku: "SKU-TATA-TEA-500G",
      brand: "Tata",
      price: 310,
      discountPrice: 260,
      stock: 80,
      categorySlug: "beverages-juices",
      subcategorySlug: "tea-coffee",
      thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
      shortDescription: "India's favorite strong blend of large and small tea grains for the perfect kadak chai.",
      description: "Tata Tea Premium offers an exquisite blend combining strength and rich aroma, ensuring every morning cup invigorates your spirit.",
      isTrending: false,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Aashirvaad Superior MP Whole Wheat Atta 10kg",
      slug: "aashirvaad-mp-whole-wheat-atta-10kg",
      sku: "SKU-AASHIRVAAD-ATTA-10KG",
      brand: "Aashirvaad",
      price: 520,
      discountPrice: 460,
      stock: 40,
      categorySlug: "groceries-staples",
      subcategorySlug: "flours-grains",
      thumbnail: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
      shortDescription: "100% pure whole wheat chakki atta from select grains of Madhya Pradesh.",
      description: "Aashirvaad Whole Wheat Atta gives soft, fluffy and golden rotis with 0% maida and 100% natural fiber goodness.",
      isTrending: true,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Amul Pure Cow Ghee 1L Tin",
      slug: "amul-pure-cow-ghee-1l",
      sku: "SKU-AMUL-GHEE-1L",
      brand: "Amul",
      price: 650,
      discountPrice: 585,
      stock: 60,
      categorySlug: "groceries-staples",
      subcategorySlug: "cooking-oils-ghee",
      thumbnail: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Rich aroma and granular texture, made from fresh cow milk cream.",
      description: "Amul Cow Ghee contains natural antioxidants, beta-carotene, and essential fatty acids for enhanced immunity and traditional taste.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      isFlashSale: false,
    },
    {
      name: "Daawat Rozana Super Basmati Rice 5kg",
      slug: "daawat-rozana-super-basmati-rice-5kg",
      sku: "SKU-DAAWAT-RICE-5KG",
      brand: "Daawat",
      price: 490,
      discountPrice: 389,
      stock: 45,
      categorySlug: "groceries-staples",
      subcategorySlug: "rice-dals",
      thumbnail: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Aged long grain aromatic Basmati rice for daily pulav, fried rice and khichdi.",
      description: "Daawat Rozana Super Basmati Rice features pristine slender grains that fluff up perfectly without sticking together.",
      isTrending: true,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Colgate Strong Teeth Dental Cream 500g",
      slug: "colgate-strong-teeth-500g",
      sku: "SKU-COLGATE-500G",
      brand: "Colgate",
      price: 280,
      discountPrice: 220,
      stock: 120,
      categorySlug: "personal-care",
      subcategorySlug: "oral-care",
      thumbnail: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Amino Shakti formula with unique Calcium boost for 2x stronger teeth.",
      description: "Colgate Strong Teeth delivers complete cavity protection, fresh breath, and strengthened enamel for the entire family.",
      isTrending: false,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Surf Excel Matic Top Load Detergent Powder 2kg",
      slug: "surf-excel-matic-top-load-2kg",
      sku: "SKU-SURF-MATIC-2KG",
      brand: "Surf Excel",
      price: 460,
      discountPrice: 380,
      stock: 75,
      categorySlug: "cleaning-household",
      subcategorySlug: "laundry-detergents",
      thumbnail: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Specially formulated for washing machines to remove tough stains in one wash.",
      description: "Surf Excel Matic Top Load dissolves faster than normal detergents, producing the optimal foam to safeguard your washing machine.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      isFlashSale: false,
    },
    {
      name: "Britannia Good Day Butter Cookies 600g",
      slug: "britannia-good-day-butter-cookies-600g",
      sku: "SKU-GOOD-DAY-600G",
      brand: "Britannia",
      price: 160,
      discountPrice: 125,
      stock: 150,
      categorySlug: "packaged-foods",
      subcategorySlug: "biscuits-cookies",
      thumbnail: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Rich buttery taste with iconic smile design for cheerful snack breaks.",
      description: "Britannia Good Day Butter Cookies provide a melt-in-the-mouth texture enriched with real cream and fine butter.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: true,
    },
    {
      name: "Parle-G Original Glucose Biscuits 800g",
      slug: "parle-g-glucose-biscuits-800g",
      sku: "SKU-PARLE-G-800G",
      brand: "Parle",
      price: 110,
      discountPrice: 90,
      stock: 200,
      categorySlug: "packaged-foods",
      subcategorySlug: "biscuits-cookies",
      thumbnail: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
      shortDescription: "The nation's staple teatime companion packed with energy, milk and wheat.",
      description: "Filled with the goodness of milk and wheat, Parle-G has nourished generations of Indian families as the ultimate tea dip.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: true,
    },
    {
      name: "Nescafe Classic Instant Coffee Jar 100g",
      slug: "nescafe-classic-instant-coffee-100g",
      sku: "SKU-NESCAFE-100G",
      brand: "Nescafe",
      price: 380,
      discountPrice: 315,
      stock: 65,
      categorySlug: "beverages-juices",
      subcategorySlug: "tea-coffee",
      thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      shortDescription: "100% pure roasted coffee beans providing that distinct signature aroma.",
      description: "Nescafe Classic is crafted from world-class Robusta coffee beans, roasted to perfection to awaken your senses every morning.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Milton Stainless Steel Insulated Flask 1000ml",
      slug: "milton-stainless-flask-1000ml",
      sku: "SKU-MILTON-FLASK-1L",
      brand: "Milton",
      price: 1199,
      discountPrice: 799,
      stock: 35,
      categorySlug: "crockery-kitchenware",
      subcategorySlug: "bottles-flasks",
      thumbnail: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Double-walled vacuum insulated flask keeps beverages hot or cold for 24 hours.",
      description: "Built with food-grade 304 rust-proof stainless steel, leak-proof screw cap, and easy-pour mechanism for home or travel.",
      isTrending: false,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Dettol Original Liquid Handwash Refill 1500ml",
      slug: "dettol-original-handwash-1500ml",
      sku: "SKU-DETTOL-1500ML",
      brand: "Dettol",
      price: 320,
      discountPrice: 249,
      stock: 90,
      categorySlug: "personal-care",
      subcategorySlug: "body-wash-soaps",
      thumbnail: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Trusted 99.9% germ protection with moisturizers to keep hands soft.",
      description: "Dettol Original Liquid Handwash pH-balanced formula protects against 100 illness-causing germs while keeping skin moisturized.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Vim Dishwash Gel Lemon 750ml Bottle",
      slug: "vim-dishwash-gel-lemon-750ml",
      sku: "SKU-VIM-GEL-750ML",
      brand: "Vim",
      price: 199,
      discountPrice: 155,
      stock: 110,
      categorySlug: "cleaning-household",
      subcategorySlug: "dishwash-cleaners",
      thumbnail: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Concentrated gel with power of 100 lemons cleans grease in a single spoon.",
      description: "Vim Dishwash Gel gives spotless, shiny utensils without leaving behind any white residue or scratches on expensive cookware.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      isFlashSale: false,
    },
    {
      name: "Haldirams Nagpur Aloo Bhujia 400g",
      slug: "haldirams-nagpur-aloo-bhujia-400g",
      sku: "SKU-HALDIRAM-ALOO-400G",
      brand: "Haldiram's",
      price: 140,
      discountPrice: 115,
      stock: 95,
      categorySlug: "packaged-foods",
      subcategorySlug: "namkeen-munchies",
      thumbnail: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
      shortDescription: "Crispy minty potato sev blended with select spices for snacking.",
      description: "Haldiram's famous Nagpur Aloo Bhujia made with crispy potatoes, tepary bean flour, and a touch of red chili and mint.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isFlashSale: false,
    },
    {
      name: "Classmate Pulse Spiral Notebook Pack of 3",
      slug: "classmate-pulse-spiral-notebook-pack-3",
      sku: "SKU-CLASSMATE-PULSE-3PK",
      brand: "Classmate",
      price: 360,
      discountPrice: 290,
      stock: 70,
      categorySlug: "stationery-office",
      subcategorySlug: "notebooks-pens",
      thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      shortDescription: "300 pages single line notebooks with ozone-treated elemental chlorine-free paper.",
      description: "Classmate Pulse spiral bound notebooks feature ultra-smooth paper for seamless writing, sturdy polypropylene covers and micro-perforated pages.",
      isTrending: false,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isFlashSale: false,
    },
  ];

  for (const prod of productsList) {
    const cat = categoryMap.get(prod.categorySlug);
    const sub = subcategoryMap.get(prod.subcategorySlug);

    const existingProduct = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (!existingProduct) {
      await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku,
          brand: prod.brand,
          price: prod.price,
          discountPrice: prod.discountPrice,
          stock: prod.stock,
          categoryId: cat.id,
          subcategoryId: sub ? sub.id : null,
          thumbnail: prod.thumbnail,
          shortDescription: prod.shortDescription,
          description: prod.description,
          isTrending: prod.isTrending,
          isFeatured: prod.isFeatured,
          isNewArrival: prod.isNewArrival,
          isBestSeller: prod.isBestSeller,
          isFlashSale: prod.isFlashSale,
          isActive: true,
          isDeleted: false,
        },
      });
      console.log(`Created Product: ${prod.name}`);
    }
  }

  console.log("✅ SW Hub Grocery Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
