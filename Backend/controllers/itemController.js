import Item from "../models/Item.js";

// CREATE a new item
export const createItem = async (req, res) => {
  const {
    title,
    description,
    category,
    type,
    size,
    condition,
    tags,
    images,
    pointValue,
    status,
    purchasePrice,
    purchaseAge,
  } = req.body;

  try {
    const uploader = req.user?._id || req.body.uploader; // fallback
    if (!uploader) return res.status(400).json({ message: "Missing uploader" });

    const item = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      images,
      redeemPoints: pointValue || 20,
      status: status || "available",
      purchasePrice,
      purchaseAge,
      uploader,
      approved: true, // default: visible after creation
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Create item error:", err);
    res.status(500).json({ message: "Failed to create item", error: err });
  }
};

// GET all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("Error retrieving items:", err);
    res.status(500).json({ message: "Error retrieving items", error: err });
  }
};

// GET item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving item", error: err });
  }
};

// UPDATE item by ID
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

// DELETE item
export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item", error: err });
  }
};

// FLAG an item
export const flagItem = async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.isFlagged)
      return res.status(400).json({ message: "Item already flagged" });

    const flaggedBy = req.user?._id || null;

    item.isFlagged = true;
    item.status = "flagged";
    item.flaggedBy = flaggedBy;

    await item.save();
    res.json({ message: "Item flagged", item });
  } catch (err) {
    res.status(500).json({ message: "Error flagging item", error: err });
  }
};
