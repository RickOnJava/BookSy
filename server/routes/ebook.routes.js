import express from "express";
import {
  createEBook,
  updateEBook,
  deleteEBook,
  toggleEBook,
  getAllEBooks,
  getSingleEBook,
  streamEBook,
  getStreamToken,
  getMyInventory,
  getRecommendedEBooks,
  getReadingProgress,
} from "../controller/ebook.controller.js";

import upload from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

/* ===== USER ===== */
router.get("/",protect, getAllEBooks);
router.get("/my-books", protect, getMyInventory);

router.get("/progress", protect, getReadingProgress);

//============ Admin Route ==============
router.get("/recommended", protect, getRecommendedEBooks);

// ================== User =====================
router.get("/:id",protect, getSingleEBook);

router.get("/:id/stream-token", protect, getStreamToken);

router.get("/:id/stream", streamEBook);



/* ===== ADMIN ===== */

router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createEBook
);


router.put("/:id", protect, adminOnly, updateEBook);
router.delete("/:id", protect, adminOnly, deleteEBook);
router.patch("/:id/toggle", protect, adminOnly, toggleEBook);



export default router;
