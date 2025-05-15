import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import productRoutes from "./routes/product.route.js"; 
import disposalRoutes from "./routes/disposal.route.js"; 
import checkoutRoutes from "./routes/checkout.route.js"; 
import upcomingRoutes from "./routes/upcoming.route.js";
import supplyRoutes from "./routes/supply.route.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Define API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/product', productRoutes);
app.use('/api/supply', supplyRoutes);
app.use('/api/disposal', disposalRoutes);
app.use('/api/checkout', checkoutRoutes);  // New route for checkout
app.use('/api/upcoming', upcomingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message 
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});
