import { Router } from "express";
import * as OrderController from "../controllers/order.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { validateCreateOrder, validateUpdateOrder } from "../validations/order.validation";

const router = Router();

router.use(verifyToken);

router.post("/", validateCreateOrder, OrderController.createOrder);
router.patch("/:id", validateUpdateOrder,  OrderController.updateOrder);
router.delete("/:id", OrderController.cancelOrder);

export default router;
