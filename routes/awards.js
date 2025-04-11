import express from "express";
import multer from "multer";
import {
  getAwards,
  createAward,
  updateAward,
  deleteAward,
} from "../controllers/awardsController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getAwards);
router.post("/", upload.single("image"), createAward);
router.put("/:id", upload.single("image"), updateAward);
router.delete("/:id", deleteAward);

export default router;
