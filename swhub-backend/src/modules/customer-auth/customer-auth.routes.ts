import { Router } from "express";

import {
  CustomerAuthController,
} from "./customer-auth.controller";

import validateRequest from "../../middleware/validateRequest";

import {
  registerCustomerSchema,
  loginCustomerSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from "./customer-auth.validation";

import {
  authenticateCustomer,
} from "./customer-auth.middleware";

const router = Router();


// REGISTER

router.post(
  "/register",
  validateRequest(registerCustomerSchema),
  CustomerAuthController.register
);


// VERIFY OTP

router.post(
  "/verify-otp",
  validateRequest(verifyOtpSchema),
  CustomerAuthController.verifyOtp
);


// RESEND OTP

router.post(
  "/resend-otp",
  validateRequest(resendOtpSchema),
  CustomerAuthController.resendOtp
);


// LOGIN

router.post(
  "/login",
  validateRequest(loginCustomerSchema),
  CustomerAuthController.login
);


// CURRENT CUSTOMER

router.get(
  "/me",
  authenticateCustomer,
  CustomerAuthController.me
);


export default router;