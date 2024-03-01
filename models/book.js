import mongoose from "mongoose";
import counterSchema from "./counter.js";

const bookSchema = mongoose.Schema({
  id: { type: Number, unique: true },
  name: {
    type: String,
    require: true,
  },
  author: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  category: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  rating: [
    {
      rating: { type: Number, min: 0, max: 5, validate: Number.isInteger },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  description: String,
  status: {
    type: String,
    enum: ["Want to read", "Read", "Currently Reading"],
    default: "Want to read",
  },
  image: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  clicks: { type: Number, default: 0 },
});

const BookCounter = mongoose.model("BookCounter", counterSchema);
bookSchema.pre("save", function (next) {
  const doc = this;
  BookCounter.findByIdAndUpdate(
    { _id: "bookId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
    .then(function (counter) {
      doc.id = counter.seq;
      next();
    })
    .catch(function (error) {
      console.error("Counter.findByIdAndUpdate error: ", error);
      throw error;
    });
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
