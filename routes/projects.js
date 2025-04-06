import { Router } from "express";
import {
  getProjectById,
  getProjects,
  createProject,
  upload,
  getMyProject,
  updateProject,
  deleteProject,
  getAllProjects,
} from "../controllers/projectsController.js";
import { ensureUserMiddleware } from "../middlewares/ensureUserMiddleware.js";

const router = Router();

// router.use(ensureUserMiddleware);

router.get("/", getProjects);
router.get("/all", getAllProjects);
router.get("/:id", getProjectById);
router.post("/create", upload.single("image"), createProject);
router.get("/mine/check", ensureUserMiddleware, getMyProject);
router.put("/:id", ensureUserMiddleware, upload.single("image"), updateProject);
router.delete("/:id", ensureUserMiddleware, deleteProject);

export default router;
