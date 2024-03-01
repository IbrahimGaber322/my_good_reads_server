import express from "express";
import userRoutes from "./user.js";
import bookRoutes from "./book.js";
import categoryRoutes from "./category.js";
import authorRoutes from "./author.js";
import reviewsRoutes from "./reviewsRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/books", bookRoutes); 
router.use("/categories", categoryRoutes); 
router.use("/authors", authorRoutes);
router.use("/reviews", reviewsRoutes);

export default router;
