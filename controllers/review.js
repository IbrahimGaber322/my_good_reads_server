import Review from "../models/review.js";
import mongoose from "mongoose";
import Book from "../models/book.js";

export const addReview = async (req, res) => {
  const { user } = req;
  const bookId = req.params.bookId;
  const { text } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Invalid Book ID");
    }
    const review = await Review.create({
      text,
      author: new mongoose.Types.ObjectId(user._id),
    });

    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }
    book.reviews.push(review._id);
    await book.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("Invalid review ID");
    }

    const updatedFields = req.body;

    const book = await Book.findOne({ reviews: reviewId });

    if (!book) {
      throw new Error("Book containing the review not found");
    }

    const reviewIndex = book.reviews.indexOf(reviewId);
    if (reviewIndex === -1) {
      throw new Error("Review not found in the book");
    }

    const reviewToUpdate = book.reviews[reviewIndex];
    Object.assign(reviewToUpdate, updatedFields);

    await book.save();

    res.json(reviewToUpdate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("Invalid review ID");
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      throw new Error("Review not found");
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new Error("Invalid review ID");
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReviewsByBookId = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Invalid book ID");
    }

    const reviews = await Review.find({ book: bookId });

    res.json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
