import express from 'express';
import * as productController from '../controllers/productController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth to all Write routes as per requirement
router.post('/', auth, productController.createProduct);
router.patch('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

export default router;
