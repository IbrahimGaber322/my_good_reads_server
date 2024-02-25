import mongoose from "mongoose";

const nameValidator = (value) => {
  return /^[a-zA-Z]+$/.test(value);
};

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: [3, "Min length 3 chars."],
    validate: {
      validator: nameValidator,
      message: "Category name must contain only alphabetical characters",
    },
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
