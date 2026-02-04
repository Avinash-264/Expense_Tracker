import {Router} from "express";
import getUserInfo from "../controllers/getUserInfo.controllers";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.get("/me", getUserInfo);

export default router;
