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

const router = express.Router();

router.post("/", user, admin, createAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.patch("/:id", user, admin, updateAuthor);
router.delete("/:id", user, admin, deleteAuthor);

export default router;
