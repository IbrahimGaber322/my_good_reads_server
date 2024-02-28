import express from "express";
import { confirmEmail, login, signUp,getUserData,getUserBooks,updateUserBooks } from "../controllers/user.js";
import user from "../middleware/user.js";
const router = express.Router();

/* ------------ */
/* router.get("/", getAllUsers);
router.get("/:id", getUser); */
/* ------------ */

router.post("/", signUp);
router.post("/login", login);
router.get("/me", user ,getUserData);
/* router.patch("/users",middleware, editProfile ); */

/* router.delete("/users/:id", middlware, deleteUser); */

 router.get("/books",user, getUserBooks); 
 router.patch('/books', user,updateUserBooks);


router.get("/confirm/:token", confirmEmail);

export default router;
