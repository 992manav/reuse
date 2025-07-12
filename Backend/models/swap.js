import mongoose from "mongoose";

const swapSchema = new mongoose.Schema(
  {
    itemOffered: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemRequested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Swap", swapSchema);
