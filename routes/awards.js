import express from "express";
import {
  getAwards,
  createAward,
  deleteAward,
} from "../controllers/awardsController.js";

const router = express.Router();

router.get("/", getAwards);
router.post("/", createAward);
router.delete("/:id", deleteAward);

export default router;
