import Swap from "../models/Swap.js";
import Item from "../models/Item.js";

export const requestSwap = async (req, res) => {
  const { itemOffered, itemRequested } = req.body;

  try {
    const requestedItem = await Item.findById(itemRequested);
    if (!requestedItem)
      return res.status(404).json({ message: "Requested item not found" });

    const swap = new Swap({
      itemOffered,
      itemRequested,
      requester: req.user._id,
      receiver: requestedItem.uploader,
    });

    await swap.save();
    res.status(201).json({ message: "Swap request sent", swap });
  } catch (err) {
    res.status(500).json({ message: "Error sending swap request", error: err });
  }
};

export const acceptSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap)
      return res.status(404).json({ message: "Swap request not found" });

    if (swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    swap.status = "accepted";

    await Item.findByIdAndUpdate(swap.itemOffered, { status: "swapped" });
    await Item.findByIdAndUpdate(swap.itemRequested, { status: "swapped" });

    await swap.save();
    res.json({ message: "Swap accepted", swap });
  } catch (err) {
    res.status(500).json({ message: "Error accepting swap", error: err });
  }
};

export const rejectSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap)
      return res.status(404).json({ message: "Swap request not found" });

    if (swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    swap.status = "rejected";
    await swap.save();
    res.json({ message: "Swap rejected", swap });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting swap", error: err });
  }
};
