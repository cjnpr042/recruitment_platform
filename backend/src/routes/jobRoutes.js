import express from "express";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  updateJobStatus,
  getJobs,
  getSingleJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";
import { isJobOwner } from "../middleware/ownership.js";
const router = express.Router();

// public
router.get("", protect, authorize("recruiter"), getJobs);
router.get("/:id", getSingleJob);
// 🟡 RECRUITER
router.post("/", protect, authorize("recruiter"), createJob);
router.get("/my-jobs", protect, authorize("recruiter"), getMyJobs);

router.put("/:id", protect, authorize("recruiter"), isJobOwner, updateJob);

router.delete("/:id", protect, authorize("recruiter"), isJobOwner, deleteJob);

router.patch(
  "/:id/status",
  protect,
  authorize("recruiter"),
  isJobOwner,
  updateJobStatus,
);

export default router;
