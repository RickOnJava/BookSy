import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import { getAllEBooks, getRecommendedBooks } from "../api/ebook.api";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    getRecommendedBooks().then((res) => {
      setRecommended(res.data);
    });
  }, []);

  console.log(recommended);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await getAllEBooks();
      setBooks(res.data);
    };
    fetchBooks();
  }, []);

  /* 🔹 Get unique categories */
  const categories = useMemo(() => {
    const cats = books.map((b) => b.category);
    return ["all", ...new Set(cats)];
  }, [books]);

  /* 🔹 Filter + Search + Sort */
  const filteredBooks = useMemo(() => {
    let data = [...books];

    // Category filter
    if (selectedCategory !== "all") {
      data = data.filter((b) => b.category === selectedCategory);
    }

    // Search
    if (search.trim()) {
      data = data.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "priceLow") {
      data.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "priceHigh") {
      data.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "title") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "latest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [books, search, selectedCategory, sortBy]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">
        {/* 🤖 AI RECOMMENDATIONS */}
        {recommended.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              🤖 Recommended for You
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {recommended.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </>
        )}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          📚 Available E-Books
        </motion.h1>

        {/* 🔍 FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border w-full md:w-1/3"
          />

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border w-full md:w-1/4"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border w-full md:w-1/4"
          >
            <option value="latest">Latest</option>
            <option value="title">Title (A-Z)</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
          </select>
        </div>

        {/* 📚 BOOK GRID */}
        {filteredBooks.length === 0 ? (
          <p className="text-gray-600">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
