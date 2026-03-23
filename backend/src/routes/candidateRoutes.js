import express from "express";
import {
  upsertProfile,
  getMyProfile,
  getPublicProfile,
} from "../controllers/candidateController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// candidate
router.get("/profile", protect, authorize("candidate"), getMyProfile);
router.put("/profile", protect, authorize("candidate"), upsertProfile);

// public
router.get("/:userId", protect, getPublicProfile);

export default router;
