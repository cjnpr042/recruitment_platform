import express from "express";
import {
  upsertProfile,
  getMyProfile,
  getPublicProfile,
} from "../controllers/recruiterController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Recruiter
 *   description: Recruiter profile APIs
 */

// recruiter only
/**
 * @swagger
 * /recruiters/me:
 *   get:
 *     summary: Get my recruiter profile
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recruiter profile
 */

router.get("/me", protect, authorize("recruiter"), getMyProfile);
/**
 * @swagger
 * /recruiters/me:
 *   put:
 *     summary: Create or update recruiter profile
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               companySize:
 *                 type: string
 *               industry:
 *                 type: string
 *               website:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile saved
 */

router.put("/me", protect, authorize("recruiter"), upsertProfile);

// public
/**
 * @swagger
 * /recruiters/{userId}:
 *   get:
 *     summary: Get public recruiter profile by userId
 *     tags: [Recruiter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Public recruiter profile
 *       404:
 *         description: Profile not found
 */

router.get("/:userId", protect, getPublicProfile);

export default router;
