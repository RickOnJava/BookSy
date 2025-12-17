import express from "express";
import { addReview, getBookReviews } from "../controller/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:id", getBookReviews); // ebookId

export default router;
