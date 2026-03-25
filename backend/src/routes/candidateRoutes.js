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
router.get("/me", protect, authorize("candidate"), getMyProfile);
router.put("/me", protect, authorize("candidate"), upsertProfile);

// public
router.get("/:userId", protect, getPublicProfile);

export default router;
