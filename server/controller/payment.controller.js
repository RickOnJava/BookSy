import Order from "../models/Order.js";
import EBook from "../models/EBook.js";
import stripe from "../utils/stripe.js";


export const createStripeSession = async (req, res) => {
  const { ebookId } = req.body;

  const ebook = await EBook.findById(ebookId);
  if (!ebook) return res.status(404).json({ message: "Book not found" });

  // ✅ CREATE PENDING ORDER
  const order = await Order.create({
    userId: req.user.id,
    ebookId,
    amount: ebook.price,
    currency: "INR",
    status: "pending"
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: ebook.title,
            description: ebook.author
          },
          unit_amount: ebook.price * 100
        },
        quantity: 1
      }
    ],

    // 👇 send orderId to frontend
    success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`
  });

  res.json({ url: session.url });
};
