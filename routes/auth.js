import { Router } from "express";
import multer from "multer";
import {
  bulkRegister,
  deleteUser,
  getAllUserEmails,
  getAllUsers,
  getUserById,
  getUsersByEmails,
  login,
  register,
  updateUser,
  deleteAllUsers,
} from "../controllers/authController.js";
import { ensureUserMiddleware } from "../middlewares/ensureUserMiddleware.js";
import { ensureAdminMiddleware } from "../middlewares/ensureAdminMiddleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, admin]
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Email already in use
 */
router.post("/register", ensureUserMiddleware, ensureAdminMiddleware, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", ensureUserMiddleware, ensureAdminMiddleware, getAllUsers);

/**
 * @swagger
 * /api/auth/bulk-register:
 *   post:
 *     summary: Register multiple users
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *     responses:
 *       201:
 *         description: Users created successfully
 */
router.post(
  "/bulk-register",
  ensureUserMiddleware,
  ensureAdminMiddleware,
  bulkRegister
);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
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
 *               image:
 *                 type: string
 *                 format: binary
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               github:
 *                 type: string
 *               website:
 *                 type: string
 *               about:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put(
  "/users/:id",
  ensureUserMiddleware,
  upload.single("image"),
  updateUser
);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
  "/users/:id",
  ensureUserMiddleware,
  ensureAdminMiddleware,
  deleteUser
);

/**
 * @swagger
 * /api/auth/users/by-emails:
 *   get:
 *     summary: Get users by emails
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: emails
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of emails
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/users/by-emails",
  ensureUserMiddleware,
  ensureAdminMiddleware,
  getUsersByEmails
);

/**
 * @swagger
 * /api/auth/emails:
 *   get:
 *     summary: Get all user emails
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user emails
 */
router.get("/emails", getAllUserEmails);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/users/:id", getUserById);

/**
 * @swagger
 * /api/auth/users:
 *  delete:
 *  summary: Delete all users
 *  tags: [Users]
 * security:
 *  - bearerAuth: []
 * responses:
 *  200:
 *   description: All users deleted successfully
 *  500:
 *  description: Server error
 */
router.delete(
  "/users",
  ensureUserMiddleware,
  ensureAdminMiddleware,
  deleteAllUsers
);

export default router;
