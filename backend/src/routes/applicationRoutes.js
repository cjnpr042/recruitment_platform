import express from "express";
import {
  applyJob,
  getMyApplications,
  getApplicationById,
  deleteApplication,
  getApplicationsByJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Application
 *   description: Job application APIs
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Apply to a job (candidate)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application created
 */
// candidate
router.post("/", protect, authorize("candidate"), applyJob);
/**
 * @swagger
 * /applications/me:
 *   get:
 *     summary: Get my applications (candidate)
 *     tags: [Application]
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
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get("/me", protect, authorize("candidate"), getMyApplications);
/**
 * @swagger
 * /applications/{applicationId}:
 *   get:
 *     summary: Get application detail (candidate)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application detail
 *       404:
 *         description: Not found
 */
router.get(
  "/:applicationId",
  protect,
  authorize("candidate"),
  getApplicationById,
);
/**
 * @swagger
 * /applications/{applicationId}:
 *   delete:
 *     summary: Withdraw application (candidate)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application withdrawn
 */

router.delete(
  "/:applicationId",
  protect,
  authorize("candidate"),
  deleteApplication,
);
/**
 * @swagger
 * /applications/jobs/{jobId}:
 *   get:
 *     summary: Get applications by job (recruiter)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
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
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of applications for job
 */

// recruiter
router.get(
  "/jobs/:jobId",
  protect,
  authorize("recruiter"),
  getApplicationsByJob,
);

/**
 * @swagger
 * /applications/{applicationId}/status:
 *   patch:
 *     summary: Update application status (recruiter)
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
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
 *                 enum: [pending, reviewed, accepted, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 */

router.patch(
  "/:applicationId/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus,
);

export default router;
