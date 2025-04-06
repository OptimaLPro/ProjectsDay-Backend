import { Router } from "express";
import {
  register,
  login,
  bulkRegister,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers); // Route to get all users
router.post("/bulk-register", bulkRegister);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
