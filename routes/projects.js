import { Router } from "express";
import {
  assignProject,
  createProject,
  deleteProject,
  getAllProjects,
  getMyProject,
  getProjectById,
  getProjects,
  getProjectsByInternship,
  unassignProject,
  updateProject,
  upload,
} from "../controllers/projectsController.js";
import { ensureUserMiddleware } from "../middlewares/ensureUserMiddleware.js";

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get("/", getProjects);

/**
 * @swagger
 * /api/projects/all:
 *   get:
 *     summary: Get all projects (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get("/all", getAllProjects);

/**
 * @swagger
 * /api/projects/by-internship/{internshipId}:
 *   get:
 *     summary: Get all projects by internship ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: internshipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of projects in the given internship
 */
router.get("/by-internship/:internshipId", getProjectsByInternship);

/**
 * @swagger
 * /api/projects/mine/check:
 *   get:
 *     summary: Get my assigned project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's assigned project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.get("/mine/check", ensureUserMiddleware, getMyProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
router.get("/:id", getProjectById);

/**
 * @swagger
 * /api/projects/create:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
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
 *               newGalleryFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post(
  "/create",
  ensureUserMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "newGalleryFiles", maxCount: 10 },
  ]),
  createProject
);

/**
 * @swagger
 * /api/projects/unassign:
 *   put:
 *     summary: Unassign from a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully unassigned from project
 */
router.put("/unassign", ensureUserMiddleware, unassignProject);

/**
 * @swagger
 * /api/projects/{id}/assign:
 *   put:
 *     summary: Assign to a project
 *     tags: [Projects]
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
 *         description: Successfully assigned to project
 */
router.put("/:id/assign", ensureUserMiddleware, assignProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
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
 *               newGalleryFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put(
  "/:id",
  ensureUserMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "newGalleryFiles", maxCount: 10 },
  ]),
  updateProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 */
router.delete("/:id", ensureUserMiddleware, deleteProject);

export default router;
