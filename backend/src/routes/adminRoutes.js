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
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get system dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 */

router.get("/dashboard", protect, authorize("admin"), getDashboard);

/* USER */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", protect, authorize("admin"), getUsers);
/**
 * @swagger
 * /admin/users/{userId}/block:
 *   put:
 *     summary: Block user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User blocked
 */

router.put("/users/:userId/block", protect, authorize("admin"), blockUser);
/**
 * @swagger
 * /admin/users/{userId}/unblock:
 *   put:
 *     summary: Unblock user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unblocked
 */
router.put("/users/:userId/unblock", protect, authorize("admin"), unblockUser);
/**
 * @swagger
 * /admin/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User detail
 */
router.get("/users/:userId", protect, authorize("admin"), getUserById);

/* JOB */

/**
 * @swagger
 * /admin/jobs:
 *   get:
 *     summary: Get all jobs (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs
 */

router.get("/jobs", protect, authorize("admin"), getJobsAdmin);

/**
 * @swagger
 * /admin/jobs/{jobId}:
 *   get:
 *     summary: Get job detail (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job detail
 */

router.get("/jobs/:jobId", protect, authorize("admin"), getJobByIdAdmin);

/**
 * @swagger
 * /admin/jobs/{jobId}:
 *   delete:
 *     summary: Delete job (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted
 */

router.delete("/jobs/:jobId", protect, authorize("admin"), deleteJobAdmin);

export default router;
