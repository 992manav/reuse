import express from "express";
import {
  getUserById,
  updateUserById,
  getAllUsers,
} from "../controllers/userController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUserById);

export default router;
