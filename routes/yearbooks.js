import { Router } from "express";
import { getYearbooks, getActiveYearbook, updateYearbook, createYearbook } from "../controllers/yearbooksController.js";
const router = Router();

/**
 * @swagger
 * /api/yearbooks:
 *   get:
 *     summary: Get all yearbooks
 *     tags: [Yearbooks]
 *     responses:
 *       200:
 *         description: List of yearbooks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Yearbook'
 */
router.get("/", getYearbooks); // Get all yearbooks

/**
 * @swagger
 * /api/yearbooks/active:
 *   get:
 *     summary: Get the active yearbook
 *     tags: [Yearbooks]
 *     responses:
 *       200:
 *         description: The active yearbook
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Yearbook'
 */
router.get("/active", getActiveYearbook); // Get the active yearbook

/**
 * @swagger
 * /api/yearbooks:
 *   post:
 *     summary: Create a new yearbook
 *     tags: [Yearbooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *             properties:
 *               year:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Yearbook created successfully
 */
router.post("/", createYearbook); // Create a new yearbook

/**
 * @swagger
 * /api/yearbooks/{id}:
 *   put:
 *     summary: Update a yearbook
 *     tags: [Yearbooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yearbook updated successfully
 */
router.put("/:id", updateYearbook); // Update a yearbook by ID

export default router;
