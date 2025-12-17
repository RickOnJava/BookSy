import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function BookCard({ book }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <img
        src={book.coverImage}
        alt={book.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold">{book.title}</h3>
        <p className="text-sm text-gray-600">by {book.author}</p>

        {/* ⭐ RATING */}
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.round(book.avgRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}

          <span className="ml-1 text-sm text-gray-600">
            {book.avgRating.toFixed(1)} ({book.totalReviews})
          </span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-indigo-600 font-semibold">
            ₹{book.price}
          </span>

          <button
            onClick={() => navigate(`/book/${book._id}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            More Info
          </button>
        </div>
      </div>
    </motion.div>
  );
}