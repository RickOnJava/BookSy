import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  category: String,
  price: Number,
  coverImage: String,
  pdfUrl: String,
  isActive: { type: Boolean, default: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("EBook", ebookSchema);
