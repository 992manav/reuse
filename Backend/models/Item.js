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

    purchasePrice: { type: Number },
    purchaseAge: {
      type: String,
      enum: [
        "Less than 3 months",
        "3–6 months",
        "6–12 months",
        "About 1 year",
        "Over 2 years",
        "Can't remember",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
