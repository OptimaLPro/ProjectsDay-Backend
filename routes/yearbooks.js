import { Router } from "express";
import { getYearbooks, getActiveYearbook, updateYearbook, createYearbook } from "../controllers/yearbooksController.js";
const router = Router();

router.get("/", getYearbooks); // Get all yearbooks
router.get("/active", getActiveYearbook); // Get the active yearbook
router.post("/", createYearbook); // Create a new yearbook
router.put("/:id", updateYearbook); // Update a yearbook by ID


export default router;
