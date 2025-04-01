import { Router } from "express";
import { getProjects } from "../controllers/projectsController.js";
// import { ensureUserMiddleware } from "../middlewares/ensureUser";

const router = Router();

// router.use(ensureUserMiddleware);

router.get("/", getProjects);

export default router;
