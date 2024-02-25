import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
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
  clicks: Number,
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
