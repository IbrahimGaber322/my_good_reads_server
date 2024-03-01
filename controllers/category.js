import Category from "../models/category.js";
import Book from "../models/book.js";

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllCategories = async (req, res) => {
  const { page, limit } = req.query;
  const { name } = req.query;
  try {
    const query = {};
    if (name) {
      query.name = new RegExp(name, "i");
    }
    const Page = Math.max(Number(page) || 1, 1);

    const Limit = Math.max(Number(limit) || 10, 1);

    const Skip = (Page - 1) * Limit;
    const categoriesCount = await Category.countDocuments();

    if (Skip >= categoriesCount) {
      return res.status(404).json({ message: "this page doesnt exist" });
    }

    const categories = await Category.find(query).limit(Limit).skip(Skip);
    res.json({ categories, categoriesCount });
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
    const books = await Book.find({ category: req.params.id })
      .populate({ path: "author", select: "firstName lastName" })
      .select("name,image");

    res.json({ category, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
