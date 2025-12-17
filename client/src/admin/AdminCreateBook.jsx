import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminCreateBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    price: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) =>
        formData.append(key, form[key])
      );

      formData.append("coverImage", coverImage);
      formData.append("pdf", pdf);

      await api.post("/ebooks", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("EBook created successfully 🎉");
      navigate("/");
      setForm({
        title: "",
        author: "",
        description: "",
        category: "",
        price: "",
      });
    } catch (err) {
      alert("Failed to create ebook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          📘 Create New E-Book
        </h2>

        <input name="title" placeholder="Title" onChange={handleChange} className="input" required />
        <input name="author" placeholder="Author" onChange={handleChange} className="input" required />
        <input name="category" placeholder="Category (cs, programming...)" onChange={handleChange} className="input" required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} className="input" required />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="input h-24"
        />

        <label className="block">
          Cover Image
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} required />
        </label>

        <label className="block">
          PDF File
          <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} required />
        </label>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:opacity-80"
        >
          {loading ? "Uploading..." : "Create Ebook"}
        </button>
      </motion.form>
    </div>
  );
}
