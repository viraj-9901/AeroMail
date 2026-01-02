import { Router } from "express";
import * as ProductController from "../controllers/product.controller";
import { verifyToken, verifyAdminToken } from "../middlewares/auth.middleware";
import { validateCreateProduct } from "../validations/product.validation";

const router = Router();

router.use(verifyToken);

router.post("/", verifyAdminToken, validateCreateProduct, ProductController.createProduct);
router.get("/", ProductController.listProducts);
router.delete("/:id", verifyAdminToken, ProductController.deleteProduct);

export default router;