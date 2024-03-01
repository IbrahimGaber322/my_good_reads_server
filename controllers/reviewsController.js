import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';
import Book from '../models/book.js';

export const addReview = catchAsync(async (req, res, next) => {
  const user = req
  const  bookId  = req.params.bookId; 
  const {text}=req.body
  
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return next(new AppError('Invalid Book ID', 400));
  }
  const review = await Review.create({text,author:user._id});

   const book = await Book.findById(bookId);
  if (!book) {
    return next(new AppError('Book not found', 404));
  }
  book.reviews.push(review._id); 
  await book.save();

  res.status(201).json(review);
});


export const editReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return next(new AppError('Invalid review ID', 400));
  }

  const updatedFields = req.body; 

  const book = await Book.findOne({ reviews: reviewId });

  if (!book) {
    return next(new AppError('Book containing the review not found', 404));
  }

  const reviewIndex = book.reviews.indexOf(reviewId);
  if (reviewIndex === -1) {
    return next(new AppError('Review not found in the book', 404));
  }

  const reviewToUpdate = book.reviews[reviewIndex];
  Object.assign(reviewToUpdate, updatedFields);

  await book.save(); 

  res.json(reviewToUpdate); 
});


export const deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id; 

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return next(new AppError('Invalid review ID', 400));
  }

  const deletedReview = await Review.findByIdAndDelete(reviewId);

  if (!deletedReview) {
    return next(new AppError('Review not found', 404));
  }

  res.json({ message: 'Review deleted successfully' });
});

export const getReviewById = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id; 

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return next(new AppError('Invalid review ID', 400));
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  res.json(review);
});

export const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.json(reviews);
});

export const getReviewsByBookId = catchAsync(async (req, res, next) => {
  const bookId = req.params.id; 

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return next(new AppError('Invalid book ID', 400));
  }

  const reviews = await Review.find({ book: bookId });

  res.json(reviews);
});


