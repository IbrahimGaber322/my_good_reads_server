import express from "express";
import {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} from "../controllers/author.js";
import user from "../middleware/user.js";
import admin from "../middleware/admin.js";
import { upload, uploadMiddleware } from "../middleware/upload.js";


const router = express.Router();

router.post("/", user, admin, upload.single('image'), uploadMiddleware, createAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.patch("/:id", user, admin, upload.single('image'), uploadMiddleware, updateAuthor);
router.delete("/:id", user, admin, deleteAuthor);

export default router;
