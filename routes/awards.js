import express from "express";
import multer from "multer";
import {
  getAwards,
  createAward,
  updateAward,
  deleteAward,
} from "../controllers/awardsController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * /api/awards:
 *   get:
 *     summary: Get all awards
 *     tags: [Awards]
 *     responses:
 *       200:
 *         description: List of awards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Award'
 */
router.get("/", getAwards);

/**
 * @swagger
 * /api/awards:
 *   post:
 *     summary: Create a new award
 *     tags: [Awards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Award created successfully
 */
router.post("/", upload.single("image"), createAward);

/**
 * @swagger
 * /api/awards/{id}:
 *   put:
 *     summary: Update an award
 *     tags: [Awards]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Award updated successfully
 */
router.put("/:id", upload.single("image"), updateAward);

/**
 * @swagger
 * /api/awards/{id}:
 *   delete:
 *     summary: Delete an award
 *     tags: [Awards]
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
 *         description: Award deleted successfully
 */
router.delete("/:id", deleteAward);

export default router;
