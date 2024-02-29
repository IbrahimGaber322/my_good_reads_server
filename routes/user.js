import express from "express";
import {
  confirmEmail,
  login,
  signUp,
  getUserData,
  getUserBooks,
  updateUserBooks,
  addUserBook,
  editProfile,
  editUser,
  getUsers
} from "../controllers/user.js";
import user from "../middleware/user.js";
import admin from "../middleware/admin.js";
const router = express.Router();

/* ------------ */

/* router.get("/:id", getUser);  */
/* ------------ */
router.get("/", getUsers);  
router.post("/", signUp);
router.patch("/", user, admin, editUser);
router.post("/login", login);

router.get("/me", user, getUserData);
router.patch("/me", user, editProfile);




router.post("/books", user, addUserBook);
router.get("/books", user, getUserBooks);
router.patch("/books", user, updateUserBooks);

router.get("/confirm/:token", confirmEmail);

export default router;
