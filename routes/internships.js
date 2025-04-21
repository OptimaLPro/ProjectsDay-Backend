import { Router } from "express";
import {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship,
} from "../controllers/internshipsController.js";

const router = Router();

/**
 * @swagger
 * /api/internships:
 *   get:
 *     summary: Get all internships
 *     tags: [Internships]
 *     responses:
 *       200:
 *         description: List of internships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Internship'
 */
router.get("/", getInternships);

/**
 * @swagger
 * /api/internships:
 *   post:
 *     summary: Create a new internship
 *     tags: [Internships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Internship created successfully
 */
router.post("/", createInternship);

/**
 * @swagger
 * /api/internships/{id}:
 *   put:
 *     summary: Update an internship
 *     tags: [Internships]
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
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Internship updated successfully
 */
router.put("/:id", updateInternship);

/**
 * @swagger
 * /api/internships/{id}:
 *   delete:
 *     summary: Delete an internship
 *     tags: [Internships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Internship deleted successfully
 */
router.delete("/:id", deleteInternship);

export default router;
