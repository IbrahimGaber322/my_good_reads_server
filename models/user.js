import mongoose from "mongoose";
import bcrypt from "bcrypt";

const nameValidator = (value) => {
  return /^[a-zA-Z]+$/.test(value);
};

const emailValidator = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: [3, "Min length 3 chars."],
      validate: {
        validator: nameValidator,
        message: "First name must contain only alphabetical characters",
      },
    },
    lastName: {
      type: String,
      required: true,
      min: [3, "Min length 3 chars."],
      validate: {
        validator: nameValidator,
        message: "Last name must contain only alphabetical characters",
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: emailValidator,
        message: "Must be a valid email",
      },
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    books: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        shelve: {
          type: String,
          default: "Want to read",
          enum: ["Want to read", "Read", "Currently Reading"],
        },
      },
    ],
    admin: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

userSchema.methods.verifyPassword = async function (password) {
  const valid = await bcrypt.compare(password, this.password);
  return valid;
};

async function encrypt(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
}

userSchema.pre("save", encrypt);
userSchema.pre("updateOne", encrypt);

const User = mongoose.model("User", userSchema);

export default User;

//sessionStorage
//noStandalone
