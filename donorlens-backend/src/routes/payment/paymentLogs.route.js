import { Router } from "express";
import { getAllPaymentLogs } from "../../controllers/payment/payment.controller.js";

const router = Router();

router.get("/", getAllPaymentLogs);

export default router;
