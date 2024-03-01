import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Book from "../models/book.js";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONT_URL = process.env.FRONT_URL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const signUp = async (req, res) => {
  const user = req.body;
  const { filePath } = req;
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser?.confirmed)
      return res.status(409).json({ message: "This email is already used." });

    if (filePath) {
      user.image = filePath;
    }

    let newUser = {};
    if (existingUser) {
      newUser = existingUser;
    } else {
      newUser = await User.create({
        ...user,
        admin: false,
        confirmed: false,
      });
    }
    console.log(newUser);
    const name = newUser.firstName + " " + newUser.lastName;
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "10min",
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: newUser.email,
      subject: "Confirm your account",
      html: `<p>Hi ${name},</p><p>Thank you for signing up to our service. Please click on the link below to confirm your account:</p><a href="${FRONT_URL}/confirm/${token}">Confirm your account</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json("need confirm");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const id = decodedToken.id;
    await User.findOneAndUpdate({ _id: id }, { confirmed: true });
    const newToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: "14d" });

    res.json({ token: newToken, message: "Successfuly confirmed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const user = req.body;

  try {
    const foundUser = await User.findOne({ email: user.email });
    if (!foundUser)
      return res.status(404).json({ message: "Email or password are not correct." });

    if (!foundUser.confirmed) {
      const name = newUser.firstName + " " + newUser.lastName;
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "10min",
      });

      const mailOptions = {
        from: EMAIL_USER,
        to: newUser.email,
        subject: "Confirm your account",
        html: `<p>Hi ${name},</p><p>Thank you for signing up to our service. Please click on the link below to confirm your account:</p><a href="${FRONT_URL}/confirm/${token}">Confirm your account</a>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.status(401).json(`Your email needs to be confirmed, confirmation email sent to ${user.email}`);
    }

    const valid = await foundUser.verifyPassword(user.password);
    if (!valid) return res.status(403).json({ message: "Email or password are not correct." });
    const token = jwt.sign({ id: foundUser._id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserData = async (req, res) => {
  const { user } = req;
  try {
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserBooks = async (req, res) => {
  const { user } = req;
  const { page, limit, shelve } = req.query;

  try {
    const Page = Math.max(Number(page) || 1, 1);
    const Limit = Math.max(Number(limit) || 10, 1);
    const Skip = (Page - 1) * Limit;
    const booksCount = user.books.length;
    if (Skip >= booksCount) {
      return res.status(404).json({ message: "this page doesnt exist" });
    }
    const userData = await User.findById(user._id, {
      books: { $slice: [Skip, Limit] },
    }).populate({
      path: "books.bookId",
      populate: {
        path: "author",
        model: "Author",
        select: "firstName lastName",
      },
    });
    if (shelve) {
      userData.books = userData.books.filter((book) => book.shelve === shelve);
    }
    res.json({ books: userData.books, booksCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserBook = async (req, res) => {
  const { user } = req;
  const { books } = user;
  const { bookId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book doesn't exist" });
    if (books.some((book) => book.bookId == bookId))
      return res.status(403).json({ message: "Book already added" });

    user.books.push({ bookId: new mongoose.Types.ObjectId(bookId) });
    await user.save();
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserBooks = async (req, res) => {
  const { user } = req;
  const { books } = user;
  const { bookId, status } = req.body;
  try {
    const bookIndex = books
      .map((book) => book._id.toString())
      .findIndex((id) => {
        return id == bookId.toString();
      });
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found collection" });
    }
    if (status) user.books[bookIndex].shelve = status;

    await user.save();

    res.status(200).json({ messgae: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editProfile = async (req, res) => {
  const { user } = req;
  const { firstName, lastName, image } = req.body;
  try {
    const updatedUser = new User({ ...user, firstName, lastName, image });
    await updatedUser.save();
    res.json(updatedUser.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { userEmail } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user)
      return res.status(400).json({ message: "no user with this email" });
    const { name, email, _id } = user;
    const token = jwt.sign({ _id: _id }, JWT_SECRET, { expiresIn: "5min" });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `<p>Hi ${name}, Please click on the link below to reset your password:</p><a href="${FRONT_URL}/resetpassword/${token}">Reset your password</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { password, token } = req.body;

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const _id = decodedToken._id;
    const user = await User.findById(_id);

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(_id, { password: hashedPassword });
    res.status(200).json({ message: "Password updated successfuly." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  const { userId, admin } = req.body;
  try {
    if (typeof admin !== "boolean")
      return res.status(422).json({ message: "Wrong data type for admin." });
    const user = await User.findByIdAndUpdate({ _id: userId }, { admin });
    if (!user) res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: `User ${user.email} is now an admin` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const Page = Math.max(Number(page) || 1, 1);
    const Limit = Math.max(Number(limit) || 10, 1);
    const Skip = (Page - 1) * Limit;
    const users = await User.find({});
    const usersCount = await User.countDocuments();
    if (Skip >= usersCount) {
      return res.status(404).json({ message: "this page doesnt exist" });
    }
    res.json({ users, usersCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
