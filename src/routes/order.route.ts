import { Router } from "express";
import * as OrderController from "../controllers/order.controller";

const router = Router();

router.post("/", OrderController.createOrder);
router.patch("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.cancelOrder);

export default router;
