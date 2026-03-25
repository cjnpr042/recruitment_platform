import express from "express";
import {
  upsertProfile,
  getMyProfile,
  getPublicProfile,
} from "../controllers/recruiterController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// recruiter only
router.get("/me", protect, authorize("recruiter"), getMyProfile);
router.put("/me", protect, authorize("recruiter"), upsertProfile);

// public
router.get("/:userId", protect, getPublicProfile);

export default router;
