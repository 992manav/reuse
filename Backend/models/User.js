import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  points: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.model("User", userSchema);
