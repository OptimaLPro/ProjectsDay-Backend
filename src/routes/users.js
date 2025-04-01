import { Router } from "express";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/usersController.js";
// import { ensureUserMiddleware } from "../middlewares/ensureUser";

const router = Router();

// router.use(ensureUserMiddleware);

router.get("/favorites", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites", removeFavorite);

export default router;
