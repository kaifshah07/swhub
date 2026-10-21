import { prisma } from "../config/database";
import { env } from "../config/env";
import { OrderService } from "../modules/order/order.service";
import { PaymentService } from "../modules/payment/payment.service";
import crypto from "crypto";

// Minimal assertion helper
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("SW HUB — ORDER & PAYMENT LIFECYCLE TEST SUITE");
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

  // Find or create test customer & test category
  let testCustomer = await prisma.customer.findFirst({
    where: { email: "order_test_customer@swhub.internal" },
  });

  if (!testCustomer) {
    testCustomer = await prisma.customer.create({
      data: {
        email: "order_test_customer@swhub.internal",
        name: "Test Customer",
        phone: "9999999999",
        password: "hashedpassword",
        isVerified: true,
      },
    });
  }

  let testCategory = await prisma.category.findFirst({
    where: { slug: "test-category" },
  });

  if (!testCategory) {
    testCategory = await prisma.category.create({
      data: {
        name: "Test Category",
        slug: "test-category",
      },
    });
  }

  // Create isolated test product
  const testProductSku = `TEST-PROD-${Date.now()}`;
  const testProduct = await prisma.product.create({
    data: {
      name: "Audit Test Product",
      slug: `audit-test-product-${Date.now()}`,
      sku: testProductSku,
      price: 200,
      discountPrice: 180,
      stock: 500,
      isActive: true,
      categoryId: testCategory.id,
    },
  });

  try {
    // ----------------------------------------------------
    // 1. CART AND CHECKOUT VALIDATIONS
    // ----------------------------------------------------

    await test("Empty cart rejection", async () => {
      try {
        await OrderService.create({
          customerId: testCustomer.id,
          address: "Test Address",
          paymentMethod: "COD",
          items: [],
        });
        assert(false, "Should have thrown for empty cart");
      } catch (err: any) {
        assert(err.message.includes("at least one product"), "Expected empty cart error message");
      }
    });

    await test("Non-existent product rejection", async () => {
      try {
        await OrderService.create({
          customerId: testCustomer.id,
          address: "Test Address",
          paymentMethod: "COD",
          items: [{ productId: 9999999, quantity: 1 }],
        });
        assert(false, "Should have thrown for non-existent product");
      } catch (err: any) {
        assert(err.message.includes("not found"), "Expected product not found error");
      }
    });

    await test("Stock shortage rejection", async () => {
      try {
        await OrderService.create({
          customerId: testCustomer.id,
          address: "Test Address",
          paymentMethod: "COD",
          items: [{ productId: testProduct.id, quantity: 999 }],
        });
        assert(false, "Should have thrown for stock shortage");
      } catch (err: any) {
        assert(err.message.includes("items left") || err.message.includes("Insufficient stock"), "Expected stock shortage error");
      }
    });

    let createdOrder: any;

    await test("Order creation calculates server-side price & shipping fee correctly", async () => {
      // 1 item * ₹180 = ₹180. Since ₹180 < ₹499, ₹40 shipping fee must be added = ₹220 total.
      const initialStock = (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock || 0;

      createdOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "123 Market Street, Aurangabad, Maharashtra - 431001",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });
      assert(createdOrder.orderNumber.startsWith("ORD-"), "Order number format check");
      assert(Number(createdOrder.totalAmount) === 220, `Expected totalAmount 220 (180 item + 40 shipping), got ${createdOrder.totalAmount}`);
      assert(createdOrder.paymentStatus === "PENDING", "Initial payment status must be PENDING");
      assert(createdOrder.orderStatus === "PENDING", "Initial order status must be PENDING");

      // Verify stock was decremented by 1
      const updatedProduct = await prisma.product.findUnique({ where: { id: testProduct.id } });
      assert(updatedProduct?.stock === initialStock - 1, `Expected stock to be ${initialStock - 1}, got ${updatedProduct?.stock}`);
    });

    // ----------------------------------------------------
    // 2. PAYMENT CREATION & RETRY AMOUNT IN PAISE
    // ----------------------------------------------------

    let paymentData: any;

    await test("createPayment returns amount in PAISE on initial creation", async () => {
      paymentData = await PaymentService.createPayment(createdOrder.id, testCustomer.id);
      assert(paymentData.amount === 22000, `Expected 22000 paise for ₹220 order, got ${paymentData.amount}`);
      assert(paymentData.currency === "INR", "Expected currency INR");
      assert(paymentData.razorpayOrderId.startsWith("order_"), "Expected Razorpay order ID");
    });

    await test("createPayment returns amount in PAISE on RETRY for existing payment", async () => {
      // Calling createPayment again on the same order must return 22000 paise (NOT ₹220!)
      const retryPaymentData = await PaymentService.createPayment(createdOrder.id, testCustomer.id);
      assert(
        retryPaymentData.amount === 22000,
        `CRITICAL RETRY BUG CHECK: Expected 22000 paise, got ${retryPaymentData.amount}`
      );
      assert(retryPaymentData.razorpayOrderId === paymentData.razorpayOrderId, "Expected same Razorpay order ID on retry");
    });

    // ----------------------------------------------------
    // 3. PAYMENT VERIFICATION & SECURITY CHECKS
    // ----------------------------------------------------

    await test("verifyPayment rejects forgery / invalid HMAC signature", async () => {
      try {
        await PaymentService.verifyPayment(
          paymentData.paymentId,
          "pay_fake12345",
          paymentData.razorpayOrderId,
          "invalid_signature_hex",
          testCustomer.id
        );
        assert(false, "Should have thrown for invalid signature");
      } catch (err: any) {
        assert(err.message.includes("Invalid payment signature"), "Expected invalid signature error");
      }
    });

    await test("verifyPayment rejects verification by unauthorized customer", async () => {
      try {
        await PaymentService.verifyPayment(
          paymentData.paymentId,
          "pay_fake12345",
          paymentData.razorpayOrderId,
          "any_signature",
          999999 // Different customer
        );
        assert(false, "Should have rejected unauthorized customer");
      } catch (err: any) {
        assert(err.message.includes("Unauthorized payment verification"), "Expected unauthorized error");
      }
    });

    await test("verifyPayment accepts valid HMAC signature and updates order to CONFIRMED and PAID", async () => {
      const mockPaymentId = `pay_test_${Date.now()}`;
      const payloadToSign = `${paymentData.razorpayOrderId}|${mockPaymentId}`;
      const validSignature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(payloadToSign)
        .digest("hex");

      const verified = await PaymentService.verifyPayment(
        paymentData.paymentId,
        mockPaymentId,
        paymentData.razorpayOrderId,
        validSignature,
        testCustomer.id
      );

      assert(verified.paymentStatus === "PAID", "Payment status must be PAID");
      assert(verified.razorpayPaymentId === mockPaymentId, "Razorpay payment ID must match");

      const updatedOrder = await prisma.order.findUnique({ where: { id: createdOrder.id } });
      assert(updatedOrder?.paymentStatus === "PAID", "Order paymentStatus must be PAID");
      assert(updatedOrder?.orderStatus === "CONFIRMED", "Order orderStatus must be CONFIRMED");
    });

    await test("verifyPayment is IDEMPOTENT (duplicate verification succeeds without error)", async () => {
      const existingPayment = await prisma.payment.findUnique({ where: { paymentId: paymentData.paymentId } });
      const duplicateResult = await PaymentService.verifyPayment(
        paymentData.paymentId,
        existingPayment?.razorpayPaymentId!,
        paymentData.razorpayOrderId,
        existingPayment?.razorpaySignature!,
        testCustomer.id
      );
      assert(duplicateResult.paymentStatus === "PAID", "Idempotent response must be PAID");
    });

    // ----------------------------------------------------
    // 4. RAZORPAY WEBHOOK SECURITY & EVENT PROCESSING
    // ----------------------------------------------------

    const testWebhookSecret = "test_webhook_secret_123";
    env.RAZORPAY_WEBHOOK_SECRET = testWebhookSecret;

    await test("handleWebhook rejects forged webhook signature", async () => {
      const fakeBody = JSON.stringify({ event: "order.paid", payload: {} });
      try {
        await PaymentService.handleWebhook(fakeBody, "bad_signature");
        assert(false, "Should have rejected bad webhook signature");
      } catch (err: any) {
        assert(err.message.includes("Invalid Razorpay webhook signature"), "Expected webhook signature error");
      }
    });

    await test("handleWebhook processes order.paid idempotently with valid signature", async () => {
      const webhookPayload = JSON.stringify({
        event: "order.paid",
        payload: {
          order: {
            entity: {
              id: paymentData.razorpayOrderId,
              amount: 22000,
            },
          },
          payment: {
            entity: {
              id: `pay_webhook_${Date.now()}`,
              order_id: paymentData.razorpayOrderId,
              amount: 22000,
            },
          },
        },
      });

      const validWebhookSignature = crypto
        .createHmac("sha256", testWebhookSecret)
        .update(webhookPayload)
        .digest("hex");

      const webhookResult = await PaymentService.handleWebhook(webhookPayload, validWebhookSignature);
      assert(webhookResult.processed === true, "Webhook must be processed successfully");
    });

    // ----------------------------------------------------
    // 5. ORDER STATUS TRANSITIONS & CANCELLATION RESTORATION
    // ----------------------------------------------------

    await test("updateStatus rejects invalid transition status", async () => {
      try {
        await OrderService.updateStatus(createdOrder.id, "INVALID_STATUS_FOO");
        assert(false, "Should have rejected invalid status");
      } catch (err: any) {
        assert(err.message.includes("Invalid order status"), "Expected invalid status error");
      }
    });

    await test("updateStatus transitions valid stages: CONFIRMED -> PACKED -> SHIPPED -> DELIVERED", async () => {
      const packed = await OrderService.updateStatus(createdOrder.id, "PACKED");
      assert(packed.orderStatus === "PACKED", "Expected status PACKED");

      const shipped = await OrderService.updateStatus(createdOrder.id, "SHIPPED");
      assert(shipped.orderStatus === "SHIPPED", "Expected status SHIPPED");

      const delivered = await OrderService.updateStatus(createdOrder.id, "DELIVERED");
      assert(delivered.orderStatus === "DELIVERED", "Expected status DELIVERED");
    });

    await test("Delivered order CANNOT be cancelled directly", async () => {
      try {
        await OrderService.cancelOrder(createdOrder.id);
        assert(false, "Should not cancel delivered order");
      } catch (err: any) {
        assert(err.message.includes("Delivered orders cannot be cancelled"), "Expected delivered cancel error");
      }
    });

    // ----------------------------------------------------
    // 6. CUSTOMER CANCELLATION & STOCK RESTORATION TEST
    // ----------------------------------------------------

    let cancelTestOrder: any;

    await test("Customer cancel pending order restores stock exactly once", async () => {
      const stockBefore = (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock || 0;

      // Create a pending order
      cancelTestOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Cancellation Test Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 2 }],
      });

      const stockAfterOrder = (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock || 0;
      assert(stockAfterOrder === stockBefore - 2, "Stock must be decremented by 2 upon order creation");

      // Cancel the order as customer
      await OrderService.cancelCustomerOrder(cancelTestOrder.id, testCustomer.id);

      const stockAfterCancel = (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock || 0;
      assert(stockAfterCancel === stockBefore, `Stock must be restored to ${stockBefore}, got ${stockAfterCancel}`);

      const cancelledOrder = await prisma.order.findUnique({ where: { id: cancelTestOrder.id } });
      assert(cancelledOrder?.orderStatus === "CANCELLED", "Order status must be CANCELLED");
    });

    await test("Repeated cancellation is rejected and does NOT duplicate stock restoration", async () => {
      const stockBeforeRepeat = (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock || 0;
      try {
        await OrderService.cancelCustomerOrder(cancelTestOrder.id, testCustomer.id);
        assert(false, "Should have thrown for already cancelled order");
      } catch (err: any) {
        assert(err.message.includes("already cancelled"), "Expected already cancelled error");
      }

      const stockAfterRepeat = (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock || 0;
      assert(stockAfterRepeat === stockBeforeRepeat, "Stock must NOT be restored again on repeated cancellation");
    });

    await test("Admin status update to CANCELLED delegates to cancelOrder and restores stock", async () => {
      const stockBefore = (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock || 0;

      const adminCancelOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Admin Cancellation Test Address",
        paymentMethod: "COD",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });

      assert(
        (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock === stockBefore - 1,
        "Stock decremented by 1"
      );

      // Admin selects CANCELLED via updateStatus dropdown
      await OrderService.updateStatus(adminCancelOrder.id, "CANCELLED");

      const stockRestored = (await prisma.product.findUnique({ where: { id: testProduct.id } }))?.stock || 0;
      assert(stockRestored === stockBefore, "Admin updateStatus to CANCELLED must restore stock");
    });

    // ----------------------------------------------------
    // 7. SECOND-PASS PAYMENT SECURITY & LIFECYCLE TESTS
    // ----------------------------------------------------

    let unpaidOnlineOrder: any;

    await test("Unpaid online order CANNOT be transitioned to SHIPPED or DELIVERED", async () => {
      unpaidOnlineOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Security Test Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });

      assert(unpaidOnlineOrder.paymentStatus === "PENDING", "Order starts as PENDING");

      try {
        await OrderService.updateStatus(unpaidOnlineOrder.id, "SHIPPED");
        assert(false, "Should have rejected SHIPPED transition for unpaid online order");
      } catch (err: any) {
        assert(err.message.includes("unpaid online order"), `Expected unpaid error, got: ${err.message}`);
      }

      try {
        await OrderService.updateStatus(unpaidOnlineOrder.id, "DELIVERED");
        assert(false, "Should have rejected DELIVERED transition for unpaid online order");
      } catch (err: any) {
        assert(err.message.includes("unpaid online order"), `Expected unpaid error, got: ${err.message}`);
      }
    });

    await test("Admin CANNOT manually mark an unpaid ONLINE order as PAID", async () => {
      try {
        await OrderService.updatePaymentStatus(unpaidOnlineOrder.id, "PAID");
        assert(false, "Should have rejected manual PAID update on online order");
      } catch (err: any) {
        assert(
          err.message.includes("Cannot manually mark an ONLINE payment order as PAID"),
          `Expected manual online rejection, got: ${err.message}`
        );
      }
    });

    await test("Admin CAN mark a COD order as PAID upon cash collection", async () => {
      const codOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "COD Test Address",
        paymentMethod: "COD",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });

      const updated = await OrderService.updatePaymentStatus(codOrder.id, "PAID");
      assert(updated.paymentStatus === "PAID", "COD order payment status should be updated to PAID");

      // Verify associated Payment record was also synced
      const syncedPayment = await prisma.payment.findFirst({ where: { orderId: codOrder.id } });
      if (syncedPayment) {
        assert(syncedPayment.paymentStatus === "PAID", "Associated Payment record must sync with Order");
      }
    });

    await test("Late webhook arrival for CANCELLED order preserves CANCELLED status (no resurrection)", async () => {
      // Create and cancel an online order
      const cancelledOnlineOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Late Webhook Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });

      const paymentInfo = await PaymentService.createPayment(cancelledOnlineOrder.id, testCustomer.id);
      await OrderService.cancelCustomerOrder(cancelledOnlineOrder.id, testCustomer.id);

      const beforeWebhook = await prisma.order.findUnique({ where: { id: cancelledOnlineOrder.id } });
      assert(beforeWebhook?.orderStatus === "CANCELLED", "Order must be CANCELLED before webhook");

      // Now late order.paid webhook arrives
      const lateWebhookPayload = JSON.stringify({
        event: "order.paid",
        payload: {
          order: {
            entity: {
              id: paymentInfo.razorpayOrderId,
              amount: 22000,
            },
          },
          payment: {
            entity: {
              id: `pay_late_${Date.now()}`,
              order_id: paymentInfo.razorpayOrderId,
              amount: 22000,
            },
          },
        },
      });

      const lateSig = crypto
        .createHmac("sha256", testWebhookSecret)
        .update(lateWebhookPayload)
        .digest("hex");

      const webhookRes = await PaymentService.handleWebhook(lateWebhookPayload, lateSig);
      assert(webhookRes.processed === true, "Webhook must be processed");

      const afterWebhook = await prisma.order.findUnique({ where: { id: cancelledOnlineOrder.id } });
      assert(afterWebhook?.paymentStatus === "PAID", "Payment status should record payment was received");
      assert(
        afterWebhook?.orderStatus === "CANCELLED",
        `CRITICAL RESURRECTION GUARD: Order status must remain CANCELLED, got: ${afterWebhook?.orderStatus}`
      );
    });

    await test("Webhook payment.failed syncs both Payment and Order status to FAILED", async () => {
      const failOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Failed Payment Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });

      const failPaymentInfo = await PaymentService.createPayment(failOrder.id, testCustomer.id);

      const failPayload = JSON.stringify({
        event: "payment.failed",
        payload: {
          payment: {
            entity: {
              id: `pay_fail_${Date.now()}`,
              order_id: failPaymentInfo.razorpayOrderId,
            },
          },
        },
      });

      const failSig = crypto
        .createHmac("sha256", testWebhookSecret)
        .update(failPayload)
        .digest("hex");

      await PaymentService.handleWebhook(failPayload, failSig);

      const failedOrder = await prisma.order.findUnique({ where: { id: failOrder.id } });
      const failedPayment = await prisma.payment.findFirst({ where: { orderId: failOrder.id } });

      assert(failedOrder?.paymentStatus === "FAILED", "Order paymentStatus must be FAILED");
      assert(failedPayment?.paymentStatus === "FAILED", "Payment paymentStatus must be FAILED");
    });

    await test("Partial refund, over-refund protection, and full refund reconciliation", async () => {
      // Create and pay for an order
      const refundOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Refund Test Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });

      const refPaymentInfo = await PaymentService.createPayment(refundOrder.id, testCustomer.id);
      
      // Simulate successful payment capture
      const dbPayment = await prisma.payment.findFirst({ where: { orderId: refundOrder.id } });
      assert(dbPayment !== null, "Payment record must exist");

      await prisma.payment.update({
        where: { id: dbPayment!.id },
        data: {
          paymentStatus: "PAID",
          razorpayPaymentId: `pay_refund_test_${Date.now()}`,
        },
      });
      await prisma.order.update({
        where: { id: refundOrder.id },
        data: { paymentStatus: "PAID", orderStatus: "CONFIRMED" },
      });

      const totalOrderAmount = Number(refundOrder.totalAmount); // e.g. 220

      // Step 1: Partial refund of ₹50
      const partial1 = await PaymentService.refund(dbPayment!.id, 50);
      assert(Number(partial1.refundAmount) === 50, `Expected refundAmount 50, got ${partial1.refundAmount}`);
      assert(partial1.refunded === false, "Partial refund must not set refunded to true");
      assert(partial1.paymentStatus === "PAID", "Partial refund should keep paymentStatus as PAID");

      // Step 2: Over-refund rejection (requesting ₹9999 when only ₹170 remains)
      try {
        await PaymentService.refund(dbPayment!.id, 9999);
        assert(false, "Should have thrown for refund exceeding balance");
      } catch (err: any) {
        assert(err.message.includes("exceeds remaining refundable balance"), `Expected balance error, got: ${err.message}`);
      }

      // Step 3: Refund remaining balance (totalOrderAmount - 50 = ₹170)
      const remainingBalance = totalOrderAmount - 50;
      const fullRefund = await PaymentService.refund(dbPayment!.id, remainingBalance);
      assert(Number(fullRefund.refundAmount) === totalOrderAmount, `Expected full refundAmount ${totalOrderAmount}, got ${fullRefund.refundAmount}`);
      assert(fullRefund.refunded === true, "Full refund must set refunded to true");
      assert(fullRefund.paymentStatus === "REFUNDED", "Full refund must set paymentStatus to REFUNDED");

      const finalOrder = await prisma.order.findUnique({ where: { id: refundOrder.id } });
      assert(finalOrder?.paymentStatus === "REFUNDED", "Order paymentStatus must be REFUNDED");

      // Step 4: Re-refunding already fully refunded payment throws error
      try {
        await PaymentService.refund(dbPayment!.id, 10);
        assert(false, "Should have thrown for already refunded payment");
      } catch (err: any) {
        assert(err.message.includes("already been fully refunded"), `Expected already refunded error, got: ${err.message}`);
      }
    });

    // ----------------------------------------------------
    // 8. FINAL HIGH-RISK PAYMENT EDGE-CASE TESTS
    // ----------------------------------------------------

    await test("Valid signature for Order A CANNOT confirm Order B (cross-order tampering rejected)", async () => {
      // Create Order A
      const orderA = await OrderService.create({
        customerId: testCustomer.id,
        address: "Cross Order A Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });
      const paymentDataA = await PaymentService.createPayment(orderA.id, testCustomer.id);

      // Create Order B
      const orderB = await OrderService.create({
        customerId: testCustomer.id,
        address: "Cross Order B Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });
      const paymentDataB = await PaymentService.createPayment(orderB.id, testCustomer.id);

      // Generate a valid signature for Order A
      const mockPayIdA = `pay_cross_test_${Date.now()}`;
      const payloadA = `${paymentDataA.razorpayOrderId}|${mockPayIdA}`;
      const validSigA = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(payloadA)
        .digest("hex");

      // Attacker attempts to confirm Order B using Order A's razorpayOrderId and valid signature
      try {
        await PaymentService.verifyPayment(
          paymentDataB.paymentId,
          mockPayIdA,
          paymentDataA.razorpayOrderId, // Wrong Razorpay Order ID for paymentDataB!
          validSigA,
          testCustomer.id
        );
        assert(false, "Should have rejected cross-order verification");
      } catch (err: any) {
        assert(err.message.includes("Invalid Razorpay order reference"), `Expected mismatch error, got: ${err.message}`);
      }

      // Confirm Order B was NOT marked paid
      const orderBCheck = await prisma.order.findUnique({ where: { id: orderB.id } });
      assert(orderBCheck?.paymentStatus === "PENDING", "Order B must remain PENDING");
      assert(orderBCheck?.orderStatus === "PENDING", "Order B must remain PENDING");
    });

    await test("verifyPayment rejects missing parameters without marking order paid", async () => {
      const missingParamOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Missing Param Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });
      const payInfo = await PaymentService.createPayment(missingParamOrder.id, testCustomer.id);

      try {
        await PaymentService.verifyPayment(
          payInfo.paymentId,
          "", // Missing paymentId
          payInfo.razorpayOrderId,
          "some_sig",
          testCustomer.id
        );
        assert(false, "Should have thrown for missing parameters");
      } catch (err: any) {
        assert(err.message.includes("Missing required payment verification parameters"), `Expected missing param error, got: ${err.message}`);
      }

      const orderCheck = await prisma.order.findUnique({ where: { id: missingParamOrder.id } });
      assert(orderCheck?.paymentStatus === "PENDING", "Order must remain PENDING");
    });

    await test("Delayed payment.failed webhook CANNOT downgrade a captured payment", async () => {
      // Create order and mark it PAID via webhook
      const captureOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Capture Then Fail Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });
      const payInfo = await PaymentService.createPayment(captureOrder.id, testCustomer.id);

      const capturedPayload = JSON.stringify({
        event: "payment.captured",
        payload: {
          order: { entity: { id: payInfo.razorpayOrderId, amount: 22000 } },
          payment: { entity: { id: `pay_cap_${Date.now()}`, order_id: payInfo.razorpayOrderId, amount: 22000 } },
        },
      });
      const capturedSig = crypto.createHmac("sha256", testWebhookSecret).update(capturedPayload).digest("hex");
      await PaymentService.handleWebhook(capturedPayload, capturedSig);

      const paidOrder = await prisma.order.findUnique({ where: { id: captureOrder.id } });
      assert(paidOrder?.paymentStatus === "PAID", "Order must be PAID");
      assert(paidOrder?.orderStatus === "CONFIRMED", "Order must be CONFIRMED");

      // Now out-of-order delayed payment.failed webhook arrives
      const failedPayload = JSON.stringify({
        event: "payment.failed",
        payload: {
          payment: { entity: { id: `pay_fail_late_${Date.now()}`, order_id: payInfo.razorpayOrderId } },
        },
      });
      const failedSig = crypto.createHmac("sha256", testWebhookSecret).update(failedPayload).digest("hex");
      const failRes = await PaymentService.handleWebhook(failedPayload, failedSig);
      assert(failRes.processed === true, "Webhook must be processed without throwing");

      // Verify payment was NOT downgraded to FAILED
      const afterDelayedFail = await prisma.order.findUnique({ where: { id: captureOrder.id } });
      const afterDelayedPay = await prisma.payment.findFirst({ where: { orderId: captureOrder.id } });
      assert(afterDelayedFail?.paymentStatus === "PAID", "Order paymentStatus must stay PAID");
      assert(afterDelayedFail?.orderStatus === "CONFIRMED", "Order orderStatus must stay CONFIRMED");
      assert(afterDelayedPay?.paymentStatus === "PAID", "Payment paymentStatus must stay PAID");
    });

    await test("Duplicate webhooks (payment.captured, order.paid, refund.processed) are idempotent", async () => {
      const dupOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Duplicate Webhook Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });
      const payInfo = await PaymentService.createPayment(dupOrder.id, testCustomer.id);
      const payId = `pay_dup_${Date.now()}`;

      const paidPayload = JSON.stringify({
        event: "order.paid",
        payload: {
          order: { entity: { id: payInfo.razorpayOrderId, amount: 22000 } },
          payment: { entity: { id: payId, order_id: payInfo.razorpayOrderId, amount: 22000 } },
        },
      });
      const paidSig = crypto.createHmac("sha256", testWebhookSecret).update(paidPayload).digest("hex");

      // First webhook
      const firstRes = await PaymentService.handleWebhook(paidPayload, paidSig);
      assert(firstRes.processed === true, "First event processed");

      // Duplicate webhook
      const dupRes = await PaymentService.handleWebhook(paidPayload, paidSig);
      assert(dupRes.processed === true, "Duplicate event processed");
      assert(Boolean(dupRes.message?.includes("idempotent")), "Duplicate response must indicate idempotent handling");

      // Duplicate refund.processed webhook test
      const rfndId = `rfnd_dup_${Date.now()}`;
      const refundPayload = JSON.stringify({
        event: "refund.processed",
        payload: {
          refund: { entity: { id: rfndId, payment_id: payId, amount: 22000 } },
        },
      });
      const refundSig = crypto.createHmac("sha256", testWebhookSecret).update(refundPayload).digest("hex");

      const firstRefundRes = await PaymentService.handleWebhook(refundPayload, refundSig);
      assert(firstRefundRes.processed === true, "First refund event processed");

      const dupRefundRes = await PaymentService.handleWebhook(refundPayload, refundSig);
      assert(dupRefundRes.processed === true, "Duplicate refund processed");
      assert(Boolean(dupRefundRes.message?.includes("idempotent")), "Duplicate refund must be idempotent");

      const dbPay = await prisma.payment.findFirst({ where: { orderId: dupOrder.id } });
      assert(Number(dbPay?.refundAmount) === 220, `Refund amount must be exactly 220, got ${dbPay?.refundAmount}`);
    });

    await test("Forged webhook signature cannot mutate any database records", async () => {
      const forgedOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Forged Webhook Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });
      const payInfo = await PaymentService.createPayment(forgedOrder.id, testCustomer.id);

      const forgedPayload = JSON.stringify({
        event: "order.paid",
        payload: {
          order: { entity: { id: payInfo.razorpayOrderId, amount: 22000 } },
          payment: { entity: { id: "pay_forged", order_id: payInfo.razorpayOrderId, amount: 22000 } },
        },
      });

      try {
        await PaymentService.handleWebhook(forgedPayload, "forged_invalid_signature_hex");
        assert(false, "Should have thrown for forged signature");
      } catch (err: any) {
        assert(err.message.includes("Invalid Razorpay webhook signature"), "Expected signature rejection");
      }

      const unchangedOrder = await prisma.order.findUnique({ where: { id: forgedOrder.id } });
      const unchangedPayment = await prisma.payment.findFirst({ where: { orderId: forgedOrder.id } });
      assert(unchangedOrder?.paymentStatus === "PENDING", "Order must remain PENDING on forged webhook");
      assert(unchangedPayment?.paymentStatus === "PENDING", "Payment must remain PENDING on forged webhook");
    });

    await test("Refund retry recovery: reconciles state without duplicate charge", async () => {
      const recOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Recovery Test Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 1 }],
      });
      const recPayment = await PaymentService.createPayment(recOrder.id, testCustomer.id);

      const dbPay = await prisma.payment.findFirst({ where: { orderId: recOrder.id } });
      await prisma.payment.update({
        where: { id: dbPay!.id },
        data: {
          paymentStatus: "PAID",
          razorpayPaymentId: `pay_simulated_reconcile_${Date.now()}`,
        },
      });
      await prisma.order.update({
        where: { id: recOrder.id },
        data: { paymentStatus: "PAID", orderStatus: "CONFIRMED" },
      });

      // Execute refund with simulated reconciliation hook
      const refundedResult = await PaymentService.refund(dbPay!.id);
      assert(refundedResult.refunded === true, "Expected refunded true");
      assert(refundedResult.paymentStatus === "REFUNDED", "Expected status REFUNDED");
      assert(Number(refundedResult.refundAmount) === Number(recOrder.totalAmount), "Full amount refunded");

      const recOrderCheck = await prisma.order.findUnique({ where: { id: recOrder.id } });
      assert(recOrderCheck?.paymentStatus === "REFUNDED", "Order paymentStatus must be REFUNDED");
    });

    // ----------------------------------------------------
    // 9. SHIPPING THRESHOLD BOUNDARIES & MULTI-REFUND DEDUPLICATION
    // ----------------------------------------------------

    await test("Shipping fee threshold: ₹499 exact is free, >₹499 is free, <₹499 adds ₹40", async () => {
      // Create exact ₹499 product for boundary testing
      const exact499Prod = await prisma.product.create({
        data: {
          name: "Exact 499 Product",
          slug: `exact-499-prod-${Date.now()}`,
          sku: `SKU-499-${Date.now()}`,
          price: 499,
          stock: 50,
          isActive: true,
          categoryId: testCategory.id,
        },
      });

      try {
        // Order 1: Exactly ₹499 -> Shipping should be ₹0 (Free Delivery)
        const orderExact499 = await OrderService.create({
          customerId: testCustomer.id,
          address: "Threshold Address",
          paymentMethod: "COD",
          items: [{ productId: exact499Prod.id, quantity: 1 }],
        });
        assert(Number(orderExact499.totalAmount) === 499, `Exact ₹499 must have total ₹499, got ${orderExact499.totalAmount}`);

        // Order 2: > ₹499 (3 items * ₹180 = ₹540) -> Shipping should be ₹0 (Free Delivery)
        const orderOver499 = await OrderService.create({
          customerId: testCustomer.id,
          address: "Threshold Address",
          paymentMethod: "COD",
          items: [{ productId: testProduct.id, quantity: 3 }],
        });
        assert(Number(orderOver499.totalAmount) === 540, `₹540 order must have total ₹540, got ${orderOver499.totalAmount}`);

        // Order 3: < ₹499 (2 items * ₹180 = ₹360) -> Shipping should be ₹40 -> total = ₹400
        const orderUnder499 = await OrderService.create({
          customerId: testCustomer.id,
          address: "Threshold Address",
          paymentMethod: "COD",
          items: [{ productId: testProduct.id, quantity: 2 }],
        });
        assert(Number(orderUnder499.totalAmount) === 400, `₹360 order must add ₹40 shipping = ₹400, got ${orderUnder499.totalAmount}`);
      } finally {
        await prisma.orderItem.deleteMany({ where: { productId: exact499Prod.id } });
        await prisma.product.delete({ where: { id: exact499Prod.id } });
      }
    });

    await test("Distinct multiple partial refunds on single payment are ledgered and deduplicated individually", async () => {
      // Create order with 3 items * ₹180 = ₹540 (free shipping)
      const multiRefundOrder = await OrderService.create({
        customerId: testCustomer.id,
        address: "Multi Refund Address",
        paymentMethod: "ONLINE",
        items: [{ productId: testProduct.id, quantity: 3 }],
      });
      const multiPayInfo = await PaymentService.createPayment(multiRefundOrder.id, testCustomer.id);
      const multiPayId = `pay_multiref_${Date.now()}`;

      // Mark payment as captured
      const capturePayload = JSON.stringify({
        event: "payment.captured",
        payload: {
          payment: { entity: { id: multiPayId, order_id: multiPayInfo.razorpayOrderId, amount: 54000 } },
        },
      });
      const capSig = crypto.createHmac("sha256", testWebhookSecret).update(capturePayload).digest("hex");
      await PaymentService.handleWebhook(capturePayload, capSig);

      // Refund 1: First distinct refund of ₹100
      const rfnd1Id = `rfnd_first_${Date.now()}`;
      const rfnd1Payload = JSON.stringify({
        event: "refund.processed",
        payload: {
          refund: { entity: { id: rfnd1Id, payment_id: multiPayId, amount: 10000 } },
        },
      });
      const rfnd1Sig = crypto.createHmac("sha256", testWebhookSecret).update(rfnd1Payload).digest("hex");
      const res1 = await PaymentService.handleWebhook(rfnd1Payload, rfnd1Sig);
      assert(res1.processed === true, "First partial refund processed");

      // Verify DB after Refund 1
      let payRecord = await prisma.payment.findFirst({ where: { orderId: multiRefundOrder.id } });
      assert(Number(payRecord?.refundAmount) === 100, `Expected refundAmount 100, got ${payRecord?.refundAmount}`);
      assert(payRecord?.refunded === false, "Order not fully refunded yet");
      assert(Boolean(payRecord?.transactionId?.includes(rfnd1Id)), "TransactionId must ledger rfnd1Id");

      // Refund 2: Second distinct refund of ₹150 (distinct from Refund 1)
      const rfnd2Id = `rfnd_second_${Date.now()}`;
      const rfnd2Payload = JSON.stringify({
        event: "refund.processed",
        payload: {
          refund: { entity: { id: rfnd2Id, payment_id: multiPayId, amount: 15000 } },
        },
      });
      const rfnd2Sig = crypto.createHmac("sha256", testWebhookSecret).update(rfnd2Payload).digest("hex");
      const res2 = await PaymentService.handleWebhook(rfnd2Payload, rfnd2Sig);
      assert(res2.processed === true, "Second partial refund processed");

      // Verify cumulative total after Refund 2: ₹100 + ₹150 = ₹250
      payRecord = await prisma.payment.findFirst({ where: { orderId: multiRefundOrder.id } });
      assert(Number(payRecord?.refundAmount) === 250, `Expected cumulative 250, got ${payRecord?.refundAmount}`);
      assert(Boolean(payRecord?.transactionId?.includes(rfnd1Id)), "TransactionId must still ledger rfnd1Id");
      assert(Boolean(payRecord?.transactionId?.includes(rfnd2Id)), "TransactionId must also ledger rfnd2Id");

      // Redeliver Refund 1 webhook -> must be detected as duplicate without modifying refund amount!
      const dup1Res = await PaymentService.handleWebhook(rfnd1Payload, rfnd1Sig);
      assert(dup1Res.processed === true, "Duplicate rfnd1 processed idempotently");
      assert(Boolean(dup1Res.message?.includes("idempotent")), "Duplicate response must state idempotent");

      // Redeliver Refund 2 webhook -> must be detected as duplicate without modifying refund amount!
      const dup2Res = await PaymentService.handleWebhook(rfnd2Payload, rfnd2Sig);
      assert(dup2Res.processed === true, "Duplicate rfnd2 processed idempotently");
      assert(Boolean(dup2Res.message?.includes("idempotent")), "Duplicate response must state idempotent");

      // Confirm final amount remains exactly ₹250 (zero duplicate deductions)
      payRecord = await prisma.payment.findFirst({ where: { orderId: multiRefundOrder.id } });
      assert(Number(payRecord?.refundAmount) === 250, `Final refund amount must remain exactly 250, got ${payRecord?.refundAmount}`);
    });

    await test("Missing webhook secret configuration fails safely", async () => {
      const originalSecret = env.RAZORPAY_WEBHOOK_SECRET;
      try {
        (env as any).RAZORPAY_WEBHOOK_SECRET = "";
        await PaymentService.handleWebhook("{}", "some_signature");
        assert(false, "Should have thrown for missing webhook secret");
      } catch (err: any) {
        assert(err.message.includes("RAZORPAY_WEBHOOK_SECRET is not configured"), "Expected config error");
      } finally {
        (env as any).RAZORPAY_WEBHOOK_SECRET = originalSecret;
      }
    });

  } finally {
    // Clean up test product
    await prisma.orderItem.deleteMany({
      where: { productId: testProduct.id },
    });
    await prisma.product.delete({
      where: { id: testProduct.id },
    });
    console.log("🧹 Test product cleaned up successfully.");
  }

  console.log("\n=================================================");
  console.log(`TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal Test Runner Error:", err);
  process.exit(1);
});
