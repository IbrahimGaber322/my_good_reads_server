import Category from "../models/category.js";
import Book from "../models/book.js";

export const createCategory = async (req, res) =>{
  console.log(req.body);
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export const getAllCategories = async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

      const categories = await Category.find().limit(limit)
      .skip(skip);;
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