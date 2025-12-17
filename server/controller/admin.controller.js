import User from "../models/User.js";
import EBook from "../models/EBook.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBooks,
      totalOrders,
      revenueResult,
      ratingResult,
      categoryStats,
      topSelling,
      topRated
    ] = await Promise.all([
      User.countDocuments(),
      EBook.countDocuments(),
      Order.countDocuments({ status: "paid" }),

      Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),

      Review.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } }
      ]),

      EBook.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]),

      Order.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: "$ebookId",
            sales: { $sum: 1 }
          }
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "ebooks",
            localField: "_id",
            foreignField: "_id",
            as: "book"
          }
        },
        { $unwind: "$book" }
      ]),

      Review.aggregate([
        {
          $group: {
            _id: "$ebook",
            avgRating: { $avg: "$rating" }
          }
        },
        { $sort: { avgRating: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "ebooks",
            localField: "_id",
            foreignField: "_id",
            as: "book"
          }
        },
        { $unwind: "$book" }
      ])
    ]);

    res.json({
      stats: {
        totalUsers,
        totalBooks,
        totalOrders,
        totalRevenue: revenueResult[0]?.total || 0,
        avgRating: ratingResult[0]?.avg || 0
      },
      categoryStats,
      topSelling,
      topRated
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load analytics" });
  }
};
