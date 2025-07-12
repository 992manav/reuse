import express from "express";
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItemById);

router.post("/", verifyToken, createItem);
router.put("/:id", verifyToken, updateItem);
router.delete("/:id", verifyToken, isAdmin, deleteItem);

export default router;
