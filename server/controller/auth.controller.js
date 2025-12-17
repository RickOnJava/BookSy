import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

export const register = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};


export const grantBookAccess = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.body;

  // 1️⃣ Get order
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // 2️⃣ Grant book access
  await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { purchasedBooks: order.ebookId }
    }
  );

  // 3️⃣ Mark order as PAID
  order.status = "paid";
  order.paymentId = "STRIPE_SUCCESS"; // dummy
  order.orderId = orderId;
  await order.save();

  res.json({ message: "Book access granted & order completed" });
};

