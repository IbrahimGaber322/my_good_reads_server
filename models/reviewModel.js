import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number ,
  text: { type: String ,required: [true, "Please specify the text"]},
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
