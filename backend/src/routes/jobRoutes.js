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
/**
 * @swagger
 * tags:
 *   name: Job
 *   description: Job management APIs
 */
/**
 * @swagger
 * /jobs/me:
 *   get:
 *     summary: Get my jobs (recruiter)
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my jobs
 */
router.get("/me", protect, authorize("recruiter"), getMyJobs);
/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all public jobs
 *     tags: [Job]
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
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs
 */

router.get("", protect, getJobs);
/**
 * @swagger
 * /jobs/{jobId}:
 *   get:
 *     summary: Get single job detail
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job detail
 *       404:
 *         description: Job not found
 */

router.get("/:jobId", getSingleJob);
/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create new job (recruiter)
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               salary:
 *                 type: number
 *               jobType:
 *                 type: string
 *               requirement:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created
 */

router.post("/", protect, authorize("recruiter"), createJob);
/**
 * @swagger
 * /jobs/{jobId}:
 *   put:
 *     summary: Update job
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Job updated
 */

router.put("/:jobId", protect, authorize("recruiter"), isJobOwner, updateJob);
/**
 * @swagger
 * /jobs/{jobId}:
 *   delete:
 *     summary: Delete job
 *     tags: [Job]
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
router.delete(
  "/:jobId",
  protect,
  authorize("recruiter"),
  isJobOwner,
  deleteJob,
);
/**
 * @swagger
 * /jobs/{jobId}/status:
 *   patch:
 *     summary: Update job status (open/closed)
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, closed]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch(
  "/:jobId/status",
  protect,
  authorize("recruiter"),
  isJobOwner,
  updateJobStatus,
);

export default router;
