import User from "../models/User.js";

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

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
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
