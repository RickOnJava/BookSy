import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { getAdminAnalytics } from "../controller/admin.controller.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getAdminAnalytics);

export default router;
