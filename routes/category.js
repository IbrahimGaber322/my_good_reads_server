import express from 'express';
import { getAllCategories, getCategoryById } from '../controllers/category.js';
import user from '../middleware/user.js';
import admin from '../middleware/admin.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

export default router;
