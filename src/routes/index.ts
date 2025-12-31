import express from "express";
import authRouter from "./auth.route";
import orderRouter from "./order.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/order", orderRouter);
export default router;
