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
  assignProject,
  unassignProject,
} from "../controllers/projectsController.js";
import { ensureUserMiddleware } from "../middlewares/ensureUserMiddleware.js";

const router = Router();

router.get("/", getProjects);
router.get("/all", getAllProjects);
router.get("/mine/check", ensureUserMiddleware, getMyProject);
router.get("/:id", getProjectById);

router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "newGalleryFiles", maxCount: 10 },
  ]),
  createProject
);

router.put("/unassign", ensureUserMiddleware, unassignProject);
router.put("/:id/assign", ensureUserMiddleware, assignProject);

router.put(
  "/:id",
  ensureUserMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },          // Added to allow the "image" field
    { name: "newGalleryFiles", maxCount: 10 },
  ]),
  updateProject
);

router.delete("/:id", ensureUserMiddleware, deleteProject);

export default router;
