import mongoose from "mongoose";
import counterSchema from "./counter.js";

const authorSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  bio: {
    type: String,
  },
  image: String,
});

const AuthorCounter = mongoose.model("AuthorCounter", counterSchema);
authorSchema.pre("save", function (next) {
  const doc = this;
  AuthorCounter.findByIdAndUpdate(
    { _id: "authorId" },
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

const Author = mongoose.model("Author", authorSchema);

export default Author;
