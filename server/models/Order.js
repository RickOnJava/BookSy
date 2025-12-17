import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ebookId: { type: mongoose.Schema.Types.ObjectId, ref: "EBook" },
  amount: Number,
  currency: String,
  paymentId: String,
  orderId: String,
  status: { type: String, enum: ["pending", "paid", "failed"] }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
