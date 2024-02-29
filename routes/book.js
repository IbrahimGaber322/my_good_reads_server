import express from 'express';
import { getAllBooks, addBook, getBookById, editBook, deleteBook } from '../controllers/book.js';
import user from '../middleware/user.js';
import admin from '../middleware/admin.js';
import upload from '../middleware/upload.js';
const router = express.Router();


router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/',user,admin,upload.single('image'), addBook);
router.patch('/:id',user,admin,upload.single('image'), editBook);
router.delete('/:id',user, admin, deleteBook);

export default router;
