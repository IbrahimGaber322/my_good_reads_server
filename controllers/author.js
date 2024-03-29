import Author from "../models/author.js";
import fs from "fs/promises";
export const createAuthor = async (req, res) => {
  const { filePath } = req;
  try {
    const author = new Author(req.body);
    if (filePath) {
      author.image = filePath;
    }
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAuthors = async (req, res) => {
  const { page, limit } = req.query;
  const { firstName } = req.query;
  try {
    const query = {};
    if (firstName) {
      query.firstName = new RegExp(firstName, "i");
    }
    const Page = Math.max(Number(page) || 1, 1);

    const Limit = Math.max(Number(limit) || 10, 1);

    const Skip = (Page - 1) * Limit;

    const authorsCount = await Author.countDocuments();
    if (Skip >= authorsCount) {
      return res.status(404).json({ message: "this page doesnt exist" });
    }
    const authors = await Author.find(query);
    res.status(200).json({ authors, authorsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }
    const imageUrl = deletedAuthor.image;
    if (imageUrl) {
      const parsedUrl = new URL(imageUrl);
      const pathAfterHostname = parsedUrl.pathname;
      await fs.unlink(pathAfterHostname.slice(1));
    }
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
