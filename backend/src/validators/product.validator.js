const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Reuse the validate middleware from auth validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  next();
};

// Validation rules for creating a product
const createProductValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2 }).withMessage('Product name must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('image')
    .optional()
    .trim()
    .isURL().withMessage('Image must be a valid URL'),

  validate,
];

// Validation rules for updating a product (all fields optional)
const updateProductValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Product name must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('image')
    .optional()
    .trim()
    .isURL().withMessage('Image must be a valid URL'),

  validate,
];

// Validate MongoDB ObjectId in route parameters
const idParamValidator = [
  param('id')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid product ID');
      }
      return true;
    }),

  validate,
];

module.exports = { createProductValidator, updateProductValidator, idParamValidator };
