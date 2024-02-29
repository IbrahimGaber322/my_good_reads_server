import mongoose from "mongoose";
import counterSchema from "./counter.js";

const nameValidator = (value) => {
  return /^[a-zA-Z]+$/.test(value);
};

const categorySchema = mongoose.Schema({
  id: { type: Number, unique: true },
  name: {
    type: String,
    require: true,
    min: [3, "Min length 3 chars."],
    max: [50, "Max length 50 chars."],
  },
});

const CategoryCounter = mongoose.model("CategoryCounter", counterSchema);
categorySchema.pre("save", function (next) {
  const doc = this;
  CategoryCounter.findByIdAndUpdate(
    { _id: "categoryId" },
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

const Category = mongoose.model("Category", categorySchema);

export default Category;
