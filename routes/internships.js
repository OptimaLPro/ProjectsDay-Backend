import { Router } from "express";
import {
  getInternships,
  createInternship,
  updateInternship,
} from "../controllers/internshipsController.js";

const router = Router();

router.get("/", getInternships);
router.post("/", createInternship);
router.put("/:id", updateInternship);

export default router;
