import Category from "../models/category.js";
import Book from "../models/book.js";
export const getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const books = await Book.find({ category: req.params.id }).populate({path: 'author',select: 'firstName lastName',})
      .select('name,image');
      
      res.json({category,books});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };