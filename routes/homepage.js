import express from "express";
import {
  createHomepage,
  getHomepage,
  updateHomepage,
} from "../controllers/homepageController.js";
import { ensureAdminMiddleware } from "../middlewares/ensureAdminMiddleware.js";
import { ensureUserMiddleware } from "../middlewares/ensureUserMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/homepage:
 *   get:
 *     summary: Get all homepage records
 *     responses:
 *       200:
 *         description: List of homepage records
 */
router.get("/", getHomepage);

/**
 * @swagger
 * /api/homepage:
 *   post:
 *     summary: Create a homepage record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [youtube, herotext]
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", ensureUserMiddleware, ensureAdminMiddleware, createHomepage);

/**
 * @swagger
 * /api/homepage/{type}:
 *   put:
 *     summary: Update a homepage record by type
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [youtube, herotext]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.put(
  "/:type",
  ensureUserMiddleware,
  ensureAdminMiddleware,
  updateHomepage
);

export default router;
