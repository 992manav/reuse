import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    type: String,
    size: String,
    condition: String,
    tags: [String],
    images: [String],
    status: {
      type: String,
      enum: ["available", "swapped", "redeemed", "flagged"],
      default: "available",
    },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    isFlagged: { type: Boolean, default: false },
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
