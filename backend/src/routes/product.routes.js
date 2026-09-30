const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const {
  createProductValidator,
  updateProductValidator,
  idParamValidator,
} = require('../validators/product.validator');

// GET /api/products — Public (list all products, with optional search & pagination)
router.get('/', getProducts);

// GET /api/products/:id — Public (get single product)
router.get('/:id', idParamValidator, getProductById);

// POST /api/products — Admin only (create product)
router.post('/', authenticate, requireAdmin, createProductValidator, createProduct);

// PUT /api/products/:id — Admin only (update product)
router.put('/:id', authenticate, requireAdmin, idParamValidator, updateProductValidator, updateProduct);

// DELETE /api/products/:id — Admin only (delete product)
router.delete('/:id', authenticate, requireAdmin, idParamValidator, deleteProduct);

module.exports = router;
