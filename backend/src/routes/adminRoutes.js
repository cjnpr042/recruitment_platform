import express from "express";
import {
  blockUser,
  unblockUser,
  getUsers,
  getUserById,
  getJobsAdmin,
  getJobByIdAdmin,
  deleteJobAdmin,
  getDashboard,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

/* DASHBOARD */
router.get("/dashboard", protect, authorize("admin"), getDashboard);

/* USER */
router.get("/users", protect, authorize("admin"), getUsers);
router.put("/users/:userId/block", protect, authorize("admin"), blockUser);
router.put("/users/:userId/unblock", protect, authorize("admin"), unblockUser);
router.get("/users/:userId", protect, authorize("admin"), getUserById);

/* JOB */
router.get("/jobs", protect, authorize("admin"), getJobsAdmin);
router.get("/jobs/:jobId", protect, authorize("admin"), getJobByIdAdmin);
router.delete("/jobs/:jobId", protect, authorize("admin"), deleteJobAdmin);

export default router;
