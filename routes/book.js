import express from 'express';
import { getAllBooks, addBook, getBookById, editBook, deleteBook } from '../controllers/book.js';
import user from '../middleware/user.js';
import admin from '../middleware/admin.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      const fileExtension = file.originalname.split('.').pop();
      const randomFilename = uuidv4() + '.' + fileExtension;
      req.fileName = randomFilename;
      cb(null, randomFilename);
    },
  });
  const upload = multer({ storage });
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/',user,admin,upload.single('image'), addBook);
router.patch('/:id',user,admin, editBook);
router.delete('/:id',user, admin, deleteBook);

export default router;
