import Review from "../models/Review.js";
import User from "../models/User.js";

/* ================= ADD REVIEW ================= */
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ebookId, rating, comment } = req.body;

    // 1. Check purchase
    const user = await User.findById(userId);
    if (!user.purchasedBooks.includes(ebookId)) {
      return res.status(403).json({ message: "Buy book to review" });
    }

    // 2. Create review
    const review = await Review.create({
      user: userId,
      ebook: ebookId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already reviewed" });
    }
    res.status(500).json({ message: "Failed to add review" });
  }
};

/* ================= GET REVIEWS ================= */
export const getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ ebook: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
