import Item from "../models/Item.js";
import User from "../models/User.js";
import Redeem from "../models/Redeem.js";

export const redeemItem = async (req, res) => {
  const { itemId } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item || item.status !== "available") {
      return res.status(400).json({ message: "Item not available" });
    }

    const user = await User.findById(req.user._id);

    if (user.points < item.redeemPoints) {
      return res.status(400).json({ message: "Not enough points" });
    }

    const redeem = new Redeem({
      user: user._id,
      item: item._id,
      pointsUsed: item.redeemPoints,
    });

    user.points -= item.redeemPoints;
    item.status = "redeemed";

    await redeem.save();
    await user.save();
    await item.save();

    res.status(201).json({ message: "Item redeemed successfully", redeem });
  } catch (err) {
    res.status(500).json({ message: "Error redeeming item", error: err });
  }
};
