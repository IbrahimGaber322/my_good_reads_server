import mongoose from "mongoose";

const nameValidator = (value) => {
  return /^[a-zA-Z]+$/.test(value);
};

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: [3, "Min length 3 chars."],
    max: [50,  "Max length 50 chars."]
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
