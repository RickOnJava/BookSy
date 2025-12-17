import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EBook",
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// One review per user per ebook
reviewSchema.index({ user: 1, ebook: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
