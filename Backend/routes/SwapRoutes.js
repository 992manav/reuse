import express from "express";
import {
  requestSwap,
  acceptSwap,
  rejectSwap,
} from "../controllers/swapController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, requestSwap);
router.put("/:id/accept", verifyToken, acceptSwap);
router.put("/:id/reject", verifyToken, rejectSwap);

export default router;
