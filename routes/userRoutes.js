import express from 'express';
import * as userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', userController.getUsers);
router.patch('/me', userController.updateMe);
router.delete('/:id', userController.deleteUser);

export default router;
