import { prisma } from "../config/database";
import { ProductService } from "../modules/product/product.service";
import { CategoryService } from "../modules/category/category.service";
import { SubCategoryService } from "../modules/subcategory/subcategory.service";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("SW HUB — PRODUCT & ADMIN VERIFICATION TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // Set up isolated test category & subcategory
  const testCategory = await prisma.category.create({
    data: {
      name: `Test Admin Category ${Date.now()}`,
      slug: `test-admin-category-${Date.now()}`,
      description: "Isolated test category for admin verification",
    },
  });

  const testSubcategory = await prisma.subcategory.create({
    data: {
      name: `Test Admin Subcategory ${Date.now()}`,
      slug: `test-admin-subcat-${Date.now()}`,
      categoryId: testCategory.id,
      isActive: true,
      displayOrder: 1,
    },
  });

  const foreignCategory = await prisma.category.create({
    data: {
      name: `Foreign Category ${Date.now()}`,
      slug: `foreign-cat-${Date.now()}`,
      description: "Another isolated category",
    },
  });

  let createdProductIds: number[] = [];

  try {
    // ----------------------------------------------------
    // 1. INPUT VALIDATION & HIERARCHY
    // ----------------------------------------------------
    await test("Reject product creation with non-existent category", async () => {
      try {
        await ProductService.create({
          name: "Invalid Category Product",
          price: 199,
          stock: 10,
          categoryId: 99999999,
        });
        assert(false, "Should have thrown for non-existent category");
      } catch (err: any) {
        assert(err.message.includes("Category not found"), `Expected 'Category not found', got: ${err.message}`);
      }
    });

    await test("Reject product creation when subcategory does not belong to category", async () => {
      try {
        await ProductService.create({
          name: "Mismatched Subcategory Product",
          price: 299,
          stock: 10,
          categoryId: foreignCategory.id, // Mismatched category
          subcategoryId: testSubcategory.id, // Subcategory belongs to testCategory, not foreignCategory!
        });
        assert(false, "Should have thrown for mismatched subcategory");
      } catch (err: any) {
        assert(
          err.message.includes("does not belong to the selected category"),
          `Expected mismatch error, got: ${err.message}`
        );
      }
    });

    // ----------------------------------------------------
    // 2. PRODUCT CREATION WITH DAILY NEEDS DATA & SWH- SKU
    // ----------------------------------------------------
    let createdProduct: any = null;

    await test("Create product with full daily-needs specifications, pricing, and SWH- SKU", async () => {
      createdProduct = await ProductService.create({
        name: "SW Hub Organic Toor Dal 1kg",
        brand: "SW Hub Staples",
        price: "249.00",
        discountPrice: "199.00",
        franchisePrice: "169.00",
        stock: "75",
        categoryId: testCategory.id,
        subcategoryId: testSubcategory.id,
        ageGroup: "Daily Groceries", // Repurposed daily-needs curated tag
        shortDescription: "Premium unpolished high-protein toor dal",
        description: "Naturally farm-grown, unpolished pulses with rich natural aroma and authentic taste.",
        isFeatured: "true",
        isTrending: "true",
        isNewArrival: "true",
        isFlashSale: "true",
        isBestSeller: "true",
        isActive: "true",
      });

      createdProductIds.push(createdProduct.id);

      assert(createdProduct.name === "SW Hub Organic Toor Dal 1kg", "Name mismatch");
      assert(createdProduct.brand === "SW Hub Staples", "Brand mismatch");
      assert(Number(createdProduct.price) === 249, "MRP mismatch");
      assert(Number(createdProduct.discountPrice) === 199, "Discount price mismatch");
      assert(Number(createdProduct.franchisePrice) === 169, "Franchise price mismatch");
      assert(Number(createdProduct.stock) === 75, "Stock mismatch");
      assert(createdProduct.ageGroup === "Daily Groceries", "Aisle tag mismatch");
      assert(createdProduct.sku.startsWith("SWH-"), `SKU must start with SWH-, got: ${createdProduct.sku}`);
      assert(createdProduct.isFeatured === true, "isFeatured should be true");
      assert(createdProduct.isTrending === true, "isTrending should be true");
      assert(createdProduct.isNewArrival === true, "isNewArrival should be true");
      assert(createdProduct.isFlashSale === true, "isFlashSale should be true");
      assert(createdProduct.isBestSeller === true, "isBestSeller should be true");
      assert(createdProduct.isActive === true, "isActive should be true");
    });

    // ----------------------------------------------------
    // 3. LIVE DISCOUNT CALCULATION ACCURACY
    // ----------------------------------------------------
    await test("Verify discount mathematical calculations match frontend live calculator", async () => {
      const numPrice = Number(createdProduct.price);
      const numDiscountPrice = Number(createdProduct.discountPrice);
      const hasDiscount = numDiscountPrice > 0 && numPrice > 0 && numDiscountPrice < numPrice;
      const savingsAmount = hasDiscount ? numPrice - numDiscountPrice : 0;
      const savingsPercent = hasDiscount ? Math.round((savingsAmount / numPrice) * 100) : 0;

      assert(hasDiscount === true, "hasDiscount must be true");
      assert(savingsAmount === 50, `Expected savings ₹50, got ₹${savingsAmount}`);
      assert(savingsPercent === 20, `Expected 20% discount, got ${savingsPercent}%`);
    });

    // ----------------------------------------------------
    // 4. EDIT & UPDATE WORKFLOW PRESERVATION
    // ----------------------------------------------------
    await test("Update product fields, pricing, and toggle visibility controls", async () => {
      const updated = await ProductService.update(createdProduct.id, {
        name: "SW Hub Organic Toor Dal 1kg (Updated Edition)",
        price: 260.0,
        discountPrice: 220.0,
        franchisePrice: 180.0,
        stock: 120,
        ageGroup: "Family Saver Pack", // Changed curated tag
        isFeatured: false,
        isFlashSale: false,
        isTrending: true,
        isNewArrival: true,
        isBestSeller: true,
        isActive: true,
      });

      assert(updated.name === "SW Hub Organic Toor Dal 1kg (Updated Edition)", "Updated name mismatch");
      assert(Number(updated.price) === 260, "Updated price mismatch");
      assert(Number(updated.discountPrice) === 220, "Updated discount price mismatch");
      assert(Number(updated.franchisePrice) === 180, "Updated franchise price mismatch");
      assert(Number(updated.stock) === 120, "Updated stock mismatch");
      assert(updated.ageGroup === "Family Saver Pack", "Updated tag mismatch");
      assert(updated.isFeatured === false, "isFeatured should have toggled to false");
      assert(updated.isFlashSale === false, "isFlashSale should have toggled to false");
      assert(updated.isTrending === true, "isTrending should remain true");
      assert(updated.sku.startsWith("SWH-"), "SKU prefix must remain SWH-");
    });

    // ----------------------------------------------------
    // 5. AGEGROUP QUERY COMPATIBILITY & NULL TOLERANCE
    // ----------------------------------------------------
    await test("Filter products by curated aisle tag via contains query", async () => {
      // Query by tag "Family Saver"
      const result = await ProductService.getPublicProducts({
        ageGroup: "Family Saver",
      });

      const found = result.some((p: any) => p.id === createdProduct.id);
      assert(found === true, "Product must be found by contains search on ageGroup tag");
    });

    await test("Unfiltered query returns all products including null ageGroup records", async () => {
      const result = await ProductService.getPublicProducts({});
      assert(Array.isArray(result), "Result data must be an array");
      assert(result.length >= 1, "Must return products");
      
      // Verify null ageGroup products do not cause issues
      const hasNullOrValid = result.every((p: any) => p.ageGroup === null || typeof p.ageGroup === "string");
      assert(hasNullOrValid === true, "All ageGroup values must be null or string");
    });

    // ----------------------------------------------------
    // 6. CATEGORY MANAGEMENT & FK PROTECTION
    // ----------------------------------------------------
    await test("Category FK protection: cannot delete category with linked products", async () => {
      try {
        await CategoryService.delete(testCategory.id);
        assert(false, "Should have thrown FK constraint error");
      } catch (err: any) {
        assert(
          err.code === "P2003" || err.message.includes("Foreign key") || err.message.includes("constraint"),
          `Expected foreign key constraint error, got: ${err.message}`
        );
      }
    });

  } finally {
    // ----------------------------------------------------
    // CLEANUP TEST RECORDS (ZERO POLLUTION IN PRODUCTION)
    // ----------------------------------------------------
    for (const pid of createdProductIds) {
      await prisma.product.deleteMany({ where: { id: pid } });
    }
    await prisma.subcategory.deleteMany({ where: { id: testSubcategory.id } });
    await prisma.category.deleteMany({ where: { id: testCategory.id } });
    await prisma.category.deleteMany({ where: { id: foreignCategory.id } });
    console.log("🧹 Test products and categories cleaned up successfully.");
  }

  console.log("\n=================================================");
  console.log(`TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .then(() => {
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.error("Test runner crashed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
