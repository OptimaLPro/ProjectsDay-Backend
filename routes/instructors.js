import { Router } from "express";
import {
  getInstructors,
  createInstructor,
  updateInstructor,
} from "../controllers/instructorsController.js";

const router = Router();

router.get("/", getInstructors);
router.post("/", createInstructor);
router.put("/:id", updateInstructor);

export default router;
