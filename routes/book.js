import express from 'express';
import { getAllBooks, addBook, getBookById, editBook, deleteBook, addRating } from '../controllers/book.js';
import user from '../middleware/user.js';
import admin from '../middleware/admin.js';
import { upload, uploadMiddleware } from '../middleware/upload.js';
const router = express.Router();


router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/',user,admin,upload.single('image'), uploadMiddleware, addBook);
router.patch('/:id',user,admin,upload.single('image'), uploadMiddleware, editBook);
router.patch('/rating/:id', user, addRating);
router.delete('/:id',user, admin, deleteBook);

export default router;
