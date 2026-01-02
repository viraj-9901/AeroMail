import { Router } from "express";
import * as ReturnController from "../controllers/return.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { validateCreateReturn } from "../validations/return.validation";

const router = Router();

router.use(verifyToken);

router.post("/", validateCreateReturn, ReturnController.submitReturn);
router.post("/collect/:id", ReturnController.collectReturn);

export default router;