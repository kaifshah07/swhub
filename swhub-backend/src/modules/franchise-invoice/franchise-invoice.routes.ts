import { Router } from "express";
import { FranchiseInvoiceController } from "./franchise-invoice.controller";
import { authenticateFranchise } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticateFranchise);

router.post("/", FranchiseInvoiceController.generate);
router.get("/me", FranchiseInvoiceController.getMyInvoices);

export default router;
