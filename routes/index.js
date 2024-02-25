import express from "express";
import userRoutes from "./user.js";
import bookRoutes from "./book.js";
import categoryRoutes from "./category.js";
import authorRoutes from "./author.js";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/books", bookRoutes); 
router.use("/categories", categoryRoutes); 
router.use("/authors", authorRoutes);

export default router;
