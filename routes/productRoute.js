/*
  product router
*/

import { Router } from "express";
import productController from "../controllers/products";
const router = Router();

router.post(
  "/",
  productController.validateRequest,
  productController.createProduct
);
router.get("/", productController.getProducts);
router.get(
  "/:productId",
  productController.validateObjectId,
  productController.getProductById
);
router.put(
  "/:productId",
  productController.validateObjectId,
  productController.updateProduct
);
router.delete(
  "/:productId",
  productController.validateObjectId,
  productController.deleteProduct
);

router.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

export default router;
