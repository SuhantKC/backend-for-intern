import express from 'express';
import * as authController from '../controllers/authController.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use('/users', userRoutes);
router.use('/products', productRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default router;
