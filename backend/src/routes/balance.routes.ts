import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { addBalance, debitBalance } from "../controllers/balance.controller";

const router = Router();

router.use(authMiddleware);

router.post("/add", addBalance);
router.post("/deduct", debitBalance);

export default router;