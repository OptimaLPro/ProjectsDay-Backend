import { Router } from "express";
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  getInstructorById,
} from "../controllers/instructorsController.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

const router = Router();

router.get("/", getInstructors);
router.post("/", createInstructor);
router.put("/:id", upload.single("image"), updateInstructor);
router.get("/:id", getInstructorById);

export default router;
