import { Router } from "express";
import {
  getProjectById,
  getProjects,
  createProject,
  upload,
  getMyProject,
} from "../controllers/projectsController.js";
import { ensureUserMiddleware } from "../middlewares/ensureUserMiddleware.js";

const router = Router();

// router.use(ensureUserMiddleware);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/create", upload.single("image"), createProject);
router.get("/mine/check", ensureUserMiddleware, getMyProject);

export default router;
