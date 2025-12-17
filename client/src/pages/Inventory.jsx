import { useEffect, useState } from "react";
import { getMyBooks, getReadingProgress } from "../api/ebook.api";
import { useNavigate } from "react-router-dom";
import { addReview } from "../api/review.api";

export default function Inventory() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const [activeBook, setActiveBook] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [progress, setProgress] = useState([]);

  // Get all category wise count (cs-4, ai-2 ....)
  useEffect(() => {
    getMyBooks().then((res) => setData(res.data));
    getReadingProgress().then((res) => setProgress(res.data));
  }, []);

  // Get my books category wise
  useEffect(() => {
    getMyBooks().then((res) => setData(res.data));
  }, []);

  const submitReview = async (bookId, rating, comment) => {
    await addReview({ ebookId: bookId, rating, comment });
    alert("Review saved");
    setActiveBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex w-full justify-between">
        <h2 className="text-3xl font-bold mb-6">📦 My Inventory</h2>
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Home
        </button>
      </div>

      {/* 🎮 Reading Progress */}
      <div className="mb-10 bg-white p-6 rounded-xl shadow max-w-xs">
        <h3 className="text-xl font-bold mb-4">📊 Your Reading Progress</h3>

        {progress.map((item) => (
          <div key={item.category} className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="capitalize">{item.category}</span>
              <span>{item.count} books</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min(item.count * 20, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {Object.keys(data).map((category) => (
        <div key={category} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">
            {category}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data[category].map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <h4 className="font-bold">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/ebooks/${book._id}/read`)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Read
                    </button>

                    <button
                      onClick={() => {
                        setActiveBook(book._id);
                        setRating(book.myReview?.rating || 5);
                        setComment(book.myReview?.comment || "");
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Review
                    </button>
                  </div>

                  {/* 📝 Review Form */}
                  {activeBook === book._id && (
                    <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="mb-2 w-full p-2 rounded"
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
                        className="w-full p-2 rounded mb-2"
                      />

                      <button
                        onClick={() => submitReview(book._id, rating, comment)}
                        className="w-full bg-indigo-600 text-white py-2 rounded"
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
