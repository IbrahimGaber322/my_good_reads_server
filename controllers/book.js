import Book from "../models/book.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import Category from "../models/category.js";
// GET all books
export const getAllBooks = async (req, res) => {
  const keys = [
    "name",
    "author",
    "category",
    "clicks",
    "reviews",
    "status",
    "description",
    "rating",
  ];
  const { page, limit } = req.query;
  const queryKeys = Object.keys(req.query);
  try {
    const Page = Math.max(Number(page) || 1, 1);

    const Limit = Math.max(Number(limit) || 10, 1);

    const Skip = (Page - 1) * Limit;

    const query = {};
    queryKeys.forEach((key) => {
      if (keys.includes(key)) {
        query[key] = req.query[key];
      }
    });
    if (query.name) {
      query.name = new RegExp(query.name, "i");
    }

    const booksCount = await Book.countDocuments();
    if (Skip >= booksCount) {
      return res.status(404).json({ message: "this page doesnt exist" });
    }

    const books = await Book.find(query)
      .populate("category", "name")
      .populate("author", "firstName lastName")
      .limit(Limit)
      .skip(Skip);
    res.status(200).json({ books, booksCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new book (must be admin)
export const addBook = async (req, res) => {
  const data = req.body;
  const { filePath } = req;
  try {
    const book = new Book({
      ...data,
      author: new mongoose.Types.ObjectId(data.author),
      category: new mongoose.Types.ObjectId(data.category),
    });
    if (filePath) {
      book.image = filePath;
    }
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("category", "name")
      .populate("author", "firstName lastName")
      .populate({
        path: "reviews", 
        populate: {
        path: "author",
        select:"firstName lastName image"
        },
      }); 
    
      if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH (edit) book by ID (must be admin)
export const editBook = async (req, res) => {
  const data = req.body;
  const { filePath } = req;
  try {
    if (filePath) {
      data.image = filePath;
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
        author: new mongoose.Types.ObjectId(data.author),
        category: new mongoose.Types.ObjectId(data.category),
      },
      {
        new: true,
      }
    );
    console.log("updated book:", updatedBook);
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE book by ID (must be admin)
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    const imageUrl = deletedBook.image;
    if (imageUrl) {
      const parsedUrl = new URL(imageUrl);
      const pathAfterHostname = parsedUrl.pathname;
      await fs.unlink(pathAfterHostname.slice(1));
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getAllBooks, addBook, getBookById, editBook, deleteBook };
