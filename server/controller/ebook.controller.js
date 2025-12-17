import EBook from "../models/EBook.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import cloudinary from "../utils/cloudinary.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({});

/* ================= ADMIN ================= */

// Create ebook
export const createEBook = async (req, res) => {
  try {
    const { title, author, description, category, price } = req.body;

    // 1. Upload Cover Image
    const coverUpload = await cloudinary.uploader.upload(
      req.files.coverImage[0].path,
      { folder: "ebooks/covers" }
    );

    // 2. Upload PDF (RAW file)
    const pdfUpload = await cloudinary.uploader.upload(
      req.files.pdf[0].path,
      {
        folder: "ebooks/pdfs",
        resource_type: "raw"
      }
    );

    // 3. Save to DB
    const ebook = await EBook.create({
      title,
      author,
      description,
      category,
      price,
      coverImage: coverUpload.secure_url,
      pdfUrl: pdfUpload.secure_url,
      uploadedBy: req.user.id
    });

    res.status(201).json(ebook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ebook
export const updateEBook = async (req, res) => {
  const ebook = await EBook.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(ebook);
};

// Delete ebook
export const deleteEBook = async (req, res) => {
  await EBook.findByIdAndDelete(req.params.id);
  res.json({ message: "EBook deleted" });
};

// Toggle active/inactive
export const toggleEBook = async (req, res) => {
  const ebook = await EBook.findById(req.params.id);
  ebook.isActive = !ebook.isActive;
  await ebook.save();
  res.json(ebook);
};


/* ================= USER ================= */

// Get all ebooks
export const getAllEBooks = async (req, res) => {
  try {
    const ebooks = await EBook.aggregate([
      { $match: { isActive: true } },

      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "ebook",
          as: "reviews"
        }
      },

      {
        $addFields: {
          avgRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              0
            ]
          },
          totalReviews: { $size: "$reviews" }
        }
      },

      {
        $project: {
          pdfUrl: 0,
          reviews: 0
        }
      }
    ]);

    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ message: "Failed to load ebooks" });
  }
};

// Get single ebook
export const getSingleEBook = async (req, res) => {
  const user = await User.findById(req.user.id)
  const ebook = await EBook.findById(req.params.id)
    .select("-pdfUrl");
  res.json({ebook, user});
};

/* ================= SECURE STREAM ================= */
export const streamEBook = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.STREAM_SECRET);
    const ebookId = decoded.ebookId;

    const ebook = await EBook.findById(ebookId);
    if (!ebook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const response = await axios.get(ebook.pdfUrl, {
      responseType: "stream"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Accept-Ranges", "bytes");

    response.data.pipe(res);
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired stream token" });
  }
};

export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user?.id;
    const ebookId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasPurchased = user.purchasedBooks?.some(
      bookId => bookId.toString() === ebookId
    );

    if (!hasPurchased) {
      return res.status(403).json({ message: "Not purchased" });
    }

    const token = jwt.sign(
      { ebookId, userId },
      process.env.STREAM_SECRET,
      { expiresIn: "10m" }
    );

    res.json({ token });

  } catch (error) {
    console.error("STREAM TOKEN ERROR:", error.message);
    res.status(500).json({ message: "Failed to generate stream token" });
  }
};

export const getMyInventory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("purchasedBooks");

    const grouped = {};

    user.purchasedBooks.forEach((book) => {
      if (!grouped[book.category]) {
        grouped[book.category] = [];
      }
      grouped[book.category].push(book);
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: "Failed to load inventory" });
  }
};

// For new users (cold start) – beginner friendly [show only books that haveabove 4 star rating]
const getColdStartRecommendations = async () => {
  return await EBook.aggregate([
    // 1️⃣ Active books only
    { $match: { isActive: true } },

    // 2️⃣ Join reviews
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "ebook",
        as: "reviews"
      }
    },

    // 3️⃣ Calculate avg rating & total reviews
    {
      $addFields: {
        avgRating: {
          $cond: [
            { $gt: [{ $size: "$reviews" }, 0] },
            { $avg: "$reviews.rating" },
            0
          ]
        },
        totalReviews: { $size: "$reviews" }
      }
    },

    // ⭐ 4️⃣ Beginner rule: only highly rated books
    {
      $match: {
        avgRating: { $gte: 4 }
      }
    },

    // 🔥 5️⃣ Sort: best + popular + recent
    {
      $sort: {
        avgRating: -1,
        totalReviews: -1,
        createdAt: -1
      }
    },

    // 6️⃣ Limit results
    { $limit: 8 },

    // 7️⃣ Hide unnecessary fields
    {
      $project: {
        pdfUrl: 0,
        reviews: 0
      }
    }
  ]);
};

export const getRecommendedEBooks = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("purchasedBooks");

    // 🧊 Cold-start detection
    if (user.purchasedBooks.length === 0) {
      const coldStartBooks = await getColdStartRecommendations();
      return res.json(coldStartBooks);
    }

    // 🔥 Personalized recommendations
    const purchasedCategories = [
      ...new Set(user.purchasedBooks.map(b => b.category))
    ];

    const purchasedBookIds = user.purchasedBooks.map(b => b._id);

    const ebooks = await EBook.aggregate([
      {
        $match: {
          isActive: true,
          _id: { $nin: purchasedBookIds }
        }
      },

      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "ebook",
          as: "reviews"
        }
      },

      {
        $addFields: {
          avgRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              0
            ]
          },
          totalReviews: { $size: "$reviews" }
        }
      },

      {
        $addFields: {
          score: {
            $add: [
              { $cond: [{ $in: ["$category", purchasedCategories] }, 5, 0] },
              { $multiply: ["$avgRating", 1.5] },
              { $cond: [{ $gt: ["$totalReviews", 5] }, 2, 0] }
            ]
          }
        }
      },

      { $sort: { score: -1, createdAt: -1 } },
      { $limit: 8 },

      {
        $project: {
          pdfUrl: 0,
          reviews: 0,
          score: 0
        }
      }
    ]);

    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ message: "Failed to load recommendations" });
  }
};

// get per category
export const getReadingProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("purchasedBooks", "category");

    const progress = {};

    user.purchasedBooks.forEach((book) => {
      if (!progress[book.category]) {
        progress[book.category] = 0;
      }
      progress[book.category]++;
    });

    // Convert to array (frontend-friendly)
    const result = Object.entries(progress).map(
      ([category, count]) => ({
        category,
        count
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to load progress" });
  }
};

