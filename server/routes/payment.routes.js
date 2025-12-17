import express from "express";
import {
  createStripeSession,
} from "../controller/payment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.post("/create-order", protect, createOrder);
// router.post("/verify", protect, verifyPayment);

router.post(
  "/stripe/create-session",
  protect,
  createStripeSession
);

export default router;
