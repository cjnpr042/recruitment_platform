import express from "express";
import {
  upsertProfile,
  getMyProfile,
  getPublicProfile,
} from "../controllers/candidateController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Candidate
 *   description: Candidate profile APIs
 */
/**
 * @swagger
 * /candidates/me:
 *   get:
 *     summary: Get my candidate profile
 *     tags: [Candidate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate profile
 */

// candidate
router.get("/me", protect, authorize("candidate"), getMyProfile);
/**
 * @swagger
 * /candidates/me:
 *   put:
 *     summary: Create or update candidate profile
 *     tags: [Candidate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: string
 *               workHistory:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile saved
 */
router.put("/me", protect, authorize("candidate"), upsertProfile);

/**
 * @swagger
 * /candidates/{userId}:
 *   get:
 *     summary: Get public candidate profile by userId
 *     tags: [Candidate]
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
 *         description: Public profile data
 *       404:
 *         description: Profile not found
 */

// public
router.get("/:userId", protect, getPublicProfile);

export default router;
