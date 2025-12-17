import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleEBook } from "../api/ebook.api";
import { createStripeSession } from "../api/payment.api";
import { motion } from "framer-motion";

import { getReviews, addReview } from "../api/review.api";
import { useAuth } from "../context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      const res = await getSingleEBook(id);
      setBook(res.data.ebook);
      setUser(res.data.user);
    };
    fetchBook();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    getReviews(id).then((res) => setReviews(res.data));
  }, [id]);

  const handleBuy = async () => {
    try {
      const res = await createStripeSession(book._id);
      window.location.href = res.data.url; // Redirect to Stripe
    } catch (err) {
      alert("Payment failed");
    }
  };

  // submit review
  const submitReview = async () => {
    try {
      await addReview({ ebookId: id, rating, comment });
      const res = await getReviews(id);
      setReviews(res.data);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    }
  };

  if (!book) return null;

  const isPurchased = user?.purchasedBooks?.includes(book._id);

  return (
  <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6"
    >
      {/* ===== BOOK SECTION ===== */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full md:w-1/3 h-80 object-cover rounded-xl"
        />

        <div className="flex-1">
          <h2 className="text-3xl font-bold">{book.title}</h2>
          <p className="text-gray-600 mt-1">by {book.author}</p>

          <p className="mt-4 text-gray-700">{book.description}</p>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-2xl font-bold text-indigo-600">
              ₹{book.price}
            </span>

            {isPurchased ? (
              <button
                onClick={() => navigate(`/ebooks/${book._id}/read`)}
                className="px-6 py-3 bg-green-600 text-white rounded-xl"
              >
                Read Now
              </button>
            ) : (
              <button
                onClick={handleBuy}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
              >
                {loading ? "Processing..." : "Buy & Read"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== REVIEWS SECTION (FULL WIDTH BELOW) ===== */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>

        {isPurchased && (
          <div className="mb-6 bg-gray-100 p-4 rounded-xl">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mb-2 p-2 rounded w-32"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ⭐
                </option>
              ))}
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-3 rounded mb-2"
            />

            <button
              onClick={submitReview}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Submit Review
            </button>
          </div>
        )}

        {reviews.length === 0 && <p>No reviews yet</p>}

        {reviews.map((r) => (
          <div key={r._id} className="border-b py-3">
            <p className="font-semibold">{r.user.name}</p>
            <p>{"⭐".repeat(r.rating)}</p>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

}
