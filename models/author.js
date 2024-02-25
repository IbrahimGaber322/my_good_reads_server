import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
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
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
    validate: {
      validator: function (v) {
        try {
          return Buffer.from(v, 'base64').toString('base64') === v;
        } catch (e) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid base64 string!`
    },
  },
});

const Author = mongoose.model("Author", authorSchema);

export default Author;
