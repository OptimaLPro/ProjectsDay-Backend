import { Router } from "express";
import { getInternships } from "../controllers/internshipsController.js";

const router = Router();

router.get("/", getInternships);

export default router;
