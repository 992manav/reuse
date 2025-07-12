import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
