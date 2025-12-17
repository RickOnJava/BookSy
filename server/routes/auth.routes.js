import express from "express";
import { grantBookAccess, login, register } from "../controller/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/grant-access", protect, grantBookAccess);

export default router;
