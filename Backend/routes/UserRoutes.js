import express from "express";
import {
  getUserById,
  updateUserById,
  getAllUsers,
  getUserProfile,
  getMyItems,
  getMySwaps,
  getMyRedeems,
} from "../controllers/userController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, isAdmin, getUserById);
router.put("/:id", verifyToken, isAdmin, updateUserById);

router.get("/profile/me", verifyToken, getUserProfile);
router.get("/profile/items", verifyToken, getMyItems);
router.get("/profile/swaps", verifyToken, getMySwaps);
router.get("/profile/redeems", verifyToken, getMyRedeems);

export default router;
