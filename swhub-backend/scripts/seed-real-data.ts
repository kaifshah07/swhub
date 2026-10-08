import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  console.log('Seeding categories...');
  const catBoys = await prisma.category.create({
    data: { name: 'Boys Fashion', slug: 'boys-fashion', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop' },
  });
  const catGirls = await prisma.category.create({
    data: { name: 'Girls Fashion', slug: 'girls-fashion', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop' },
  });
  const catInfant = await prisma.category.create({
    data: { name: 'Infant & Baby', slug: 'infant-baby', image: 'https://images.unsplash.com/photo-1522771930-78848d926c56?q=80&w=800&auto=format&fit=crop' },
  });
  const catToys = await prisma.category.create({
    data: { name: 'Toys & Games', slug: 'toys-games', image: 'https://images.unsplash.com/photo-1558066118-bf8bf8b849fb?q=80&w=800&auto=format&fit=crop' },
  });
  const catFootwear = await prisma.category.create({
    data: { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop' },
  });

  console.log('Seeding subcategories...');
  const subBoysTShirts = await prisma.subcategory.create({ data: { name: 'T-Shirts & Shirts', slug: 'boys-tshirts', categoryId: catBoys.id } });
  const subBoysPants = await prisma.subcategory.create({ data: { name: 'Jeans & Trousers', slug: 'boys-jeans', categoryId: catBoys.id } });
  
  const subGirlsDresses = await prisma.subcategory.create({ data: { name: 'Dresses & Frocks', slug: 'girls-dresses', categoryId: catGirls.id } });
  const subGirlsTops = await prisma.subcategory.create({ data: { name: 'Tops & Tees', slug: 'girls-tops', categoryId: catGirls.id } });

  const subInfantRompers = await prisma.subcategory.create({ data: { name: 'Rompers & Onesies', slug: 'infant-rompers', categoryId: catInfant.id } });
  
  const subToysAction = await prisma.subcategory.create({ data: { name: 'Action Figures', slug: 'toys-action', categoryId: catToys.id } });
  const subToysEducational = await prisma.subcategory.create({ data: { name: 'Educational Toys', slug: 'toys-educational', categoryId: catToys.id } });

  const subFootwearSneakers = await prisma.subcategory.create({ data: { name: 'Sneakers', slug: 'footwear-sneakers', categoryId: catFootwear.id } });

  console.log('Seeding products...');
  
  const products = [
    {
      name: "Classic Denim Jacket for Boys",
      slug: "classic-denim-jacket-boys",
      description: "Stylish and comfortable denim jacket perfect for any season. Features metal buttons and twin flap pockets.",
      price: 1299,
      mrp: 2499,
      stock: 50,
      categoryId: catBoys.id,
      subcategoryId: subBoysTShirts.id,
      images: [
        "https://images.unsplash.com/photo-1519238263530-99abad672f77?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop"
      ],
      isTrending: true,
      ageGroup: "5-8Y"
    },
    {
      name: "Boys Casual Graphic Print T-Shirt",
      slug: "boys-casual-graphic-tshirt",
      description: "100% cotton crew neck t-shirt with a cool graphic print on the front.",
      price: 499,
      mrp: 999,
      stock: 120,
      categoryId: catBoys.id,
      subcategoryId: subBoysTShirts.id,
      images: [
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop"
      ],
      isBestSeller: true,
      ageGroup: "3-5Y"
    },
    {
      name: "Floral Print Summer Party Dress",
      slug: "floral-print-summer-dress-girls",
      description: "Beautiful floral A-line dress for girls. Perfect for parties and summer outings.",
      price: 1499,
      mrp: 2999,
      stock: 45,
      categoryId: catGirls.id,
      subcategoryId: subGirlsDresses.id,
      images: [
        "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=800&auto=format&fit=crop"
      ],
      isFeatured: true,
      ageGroup: "5-8Y"
    },
    {
      name: "Girls Pink Embellished Top",
      slug: "girls-pink-embellished-top",
      description: "Cute pink top with sequin details and ruffle sleeves.",
      price: 699,
      mrp: 1299,
      stock: 80,
      categoryId: catGirls.id,
      subcategoryId: subGirlsTops.id,
      images: [
        "https://images.unsplash.com/photo-1622519407650-3cb98d73b22e?q=80&w=800&auto=format&fit=crop"
      ],
      isNewArrival: true,
      ageGroup: "3-5Y"
    },
    {
      name: "Organic Cotton Baby Romper Set",
      slug: "organic-cotton-baby-romper",
      description: "Set of 3 ultra-soft organic cotton rompers with snap closures.",
      price: 899,
      mrp: 1599,
      stock: 150,
      categoryId: catInfant.id,
      subcategoryId: subInfantRompers.id,
      images: [
        "https://images.unsplash.com/photo-1522771930-78848d926c56?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop"
      ],
      isBestSeller: true,
      ageGroup: "0-6M"
    },
    {
      name: "Interactive Wooden Learning Blocks",
      slug: "wooden-learning-blocks-toys",
      description: "Non-toxic wooden blocks with numbers and alphabets. Promotes early learning.",
      price: 599,
      mrp: 999,
      stock: 200,
      categoryId: catToys.id,
      subcategoryId: subToysEducational.id,
      images: [
        "https://images.unsplash.com/photo-1558066118-bf8bf8b849fb?q=80&w=800&auto=format&fit=crop"
      ],
      isTrending: true,
      ageGroup: "1-3Y"
    },
    {
      name: "Superhero Action Figure Deluxe Set",
      slug: "superhero-action-figure-set",
      description: "Set of 5 durable superhero action figures with movable joints.",
      price: 1199,
      mrp: 1999,
      stock: 60,
      categoryId: catToys.id,
      subcategoryId: subToysAction.id,
      images: [
        "https://images.unsplash.com/photo-1537233267595-5eb154563a6e?q=80&w=800&auto=format&fit=crop"
      ],
      isFeatured: true,
      ageGroup: "5-8Y"
    },
    {
      name: "Kids Light-Up Velcro Sneakers",
      slug: "kids-light-up-velcro-sneakers",
      description: "Comfortable and fun sneakers with LED lights in the sole. Easy velcro fastening.",
      price: 1599,
      mrp: 2999,
      stock: 90,
      categoryId: catFootwear.id,
      subcategoryId: subFootwearSneakers.id,
      images: [
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop"
      ],
      isNewArrival: true,
      ageGroup: "3-5Y"
    },
    {
      name: "Boys Solid Color Joggers",
      slug: "boys-solid-color-joggers",
      description: "Comfortable cotton joggers with elastic waistband and pockets.",
      price: 799,
      mrp: 1499,
      stock: 100,
      categoryId: catBoys.id,
      subcategoryId: subBoysPants.id,
      images: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop"
      ],
      isFlashSale: true,
      ageGroup: "8-12Y"
    },
    {
      name: "Baby Girl Ruffle Sock Set",
      slug: "baby-girl-ruffle-sock-set",
      description: "Pack of 5 adorable ruffle socks in pastel colors.",
      price: 399,
      mrp: 699,
      stock: 300,
      categoryId: catGirls.id,
      images: [
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"
      ],
      isFlashSale: true,
      ageGroup: "6-12M"
    }
  ];

  for (const prodData of products) {
    const { images, mrp, price, ...data } = prodData;
    const sku = `SKU-${Math.floor(Math.random() * 1000000)}`;
    const product = await prisma.product.create({
      data: {
        ...data,
        price: mrp,
        discountPrice: price,
        sku,
        thumbnail: images[0]
      }
    });

    for (const imgUrl of images) {
      await prisma.productImage.create({
        data: {
          image: imgUrl,
          productId: product.id
        }
      });
    }
    console.log(`Created product: ${product.name}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
