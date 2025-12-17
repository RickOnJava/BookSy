import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectDB from "./utils/db.js"

import authRoutes from "./routes/auth.routes.js";
import ebookRoutes from "./routes/ebook.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config({});

const app = express();

const port = process.env.PORT || 3000;
const frontend = process.env.FRONTEND_URL;

//! Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//! used to connect with frontend (react)
// const corsOptions = {
//     origin: frontend,  // react's port number
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }
 app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ebooks", ebookRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
    connectDB(); 
    console.log(`Server is running on port ${port}`);
});