import { Router } from "express";
import { getInstructors } from "../controllers/instructorsController.js";
const router = Router();

router.get("/", getInstructors);

export default router;
