import User from "../models/User.js";
import Item from "../models/Item.js";
import Swap from "../models/Swap.js";
import Redeem from "../models/Redeem.js";

// Admin:
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Admin:
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Admin:
export const updateUserById = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    const updated = await user.save();
    res.json({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      points: updated.points,
      role: updated.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};

// Logged-in user:
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err });
  }
};

// Logged-in user:
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ uploader: req.user._id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items", error: err });
  }
};

// Logged-in user:
export const getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
    }).populate("itemOffered itemRequested");
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching swaps", error: err });
  }
};

// Logged-in user:
export const getMyRedeems = async (req, res) => {
  try {
    const redeems = await Redeem.find({ user: req.user._id }).populate("item");
    res.json(redeems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching redeems", error: err });
  }
};
