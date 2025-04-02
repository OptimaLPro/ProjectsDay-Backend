import { Router } from "express";
import {
  getProjectById,
  getProjects,
  createProject,
  upload,
} from "../controllers/projectsController.js";
// import { ensureUserMiddleware } from "../middlewares/ensureUser";

const router = Router();

// router.use(ensureUserMiddleware);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/create", upload.single("image"), createProject);

export default router;
