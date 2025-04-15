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
} from "../controllers/authController.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.post("/bulk-register", bulkRegister);
router.put("/users/:id", upload.single("image"), updateUser);
router.delete("/users/:id", deleteUser);
router.get("/users/by-emails", getUsersByEmails);
router.get("/emails", getAllUserEmails);
router.get("/users/:id", getUserById);

export default router;
