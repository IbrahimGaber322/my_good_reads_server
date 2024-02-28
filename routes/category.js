import express from 'express';
import { getAllCategories, getCategoryById, createCategory } from '../controllers/category.js';
import user from '../middleware/user.js';
import admin from '../middleware/admin.js';

const router = express.Router();
router.post('/',user,admin, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

export default router;
