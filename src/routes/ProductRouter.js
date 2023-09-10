const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create", productController.createProduct);
router.put("/update/:id", authMiddleware, productController.updateProduct);
router.delete("/delete/:id", authMiddleware, productController.deleteProduct);
router.post("/delete-many", authMiddleware, productController.deleteManyProduct);
router.get("/get-detail/:id", productController.getDetailProduct);
router.get("/get-all", productController.getAllProduct);
router.get("/get-all-type", productController.getAllTypeProduct);

module.exports = router;
