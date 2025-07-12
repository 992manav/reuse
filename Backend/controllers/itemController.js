import Item from "../models/Item.js";

export const createItem = async (req, res) => {
  const {
    title,
    description,
    category,
    type,
    size,
    condition,
    tags,
    uploader,
  } = req.body;

  try {
    const item = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      uploader,
      status: "available",
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to create item", error: err });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving items", error: err });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving item", error: err });
  }
};

export const updateItem = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update item", error: err });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err });
  }
};

export const flagItem = async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.isFlagged)
      return res.status(400).json({ message: "Already flagged" });

    item.isFlagged = true;
    item.status = "flagged";
    item.flaggedBy = req.user._id;

    await item.save();
    res.json({ message: "Item flagged by admin" });
  } catch (err) {
    res.status(500).json({ message: "Error flagging item", error: err });
  }
};
