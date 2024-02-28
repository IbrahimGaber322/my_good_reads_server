  import dotenv from "dotenv";
  dotenv.config();
  import User from "../models/user.js";
  import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";
  import nodemailer from "nodemailer";

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
    try {
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser)
        return res.status(409).json({ message: "This email is already used." });

      const newUser = await User.create({
        ...user,
        admin: false,
        confirmed: false,
      });
      //nodemailer
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

      res.json({ token: newToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const login = async (req, res) => {
    const user = req.body;

    try {
      const foundUser = await User.findOne({ email: user.email });
      if (!foundUser) {
        res.status(404).json({ message: "User doesn't exist." });
      } else {
        const valid = await foundUser.verifyPassword(user.password);
        if (!valid) return res.json(403);
        const token = jwt.sign({ id: foundUser._id }, JWT_SECRET, {
          expiresIn: "24h",
        });
        res.json({ token });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  export const getUserData = async (req, res) => {
    const { userId } = req;
    try {
      const user = await User.findById(userId);
      if (!user) return res.json(404);
      console.log(user.toJSON());
      res.json(user.toJSON());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const getUserBooks = async (req, res) => {
    const { userId } = req;
    try {
      const user = await User.findById(userId).populate({
        path: 'books',
        populate: {
          path: 'author',
          select: 'firstName lastName',
        },
      })
      if (!user) return res.json(404);
      res.json(user.toJSON());
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const updateUserBooks = async (req, res) => {
    const { userId } = req;
    const { bookId, newStatus } = req.body;
    try {
      const user = await User.findById(userId);
  

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const bookIndex = user.books.findIndex((book) => book.equals(bookId));
  
      if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found in user\'s collection' });
      }
      user.books[bookIndex].shelve = newStatus;

      await user.save();
      
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  export const editProfile = async (req, res) => {
    const user = req.body;
    const { token, userEmail } = req;

    try {
      if (user?.email === userEmail) {
        const editedUser = await User.findOneAndUpdate(
          { email: user.email },
          user,
          {
            new: true,
          }
        );

        const {
          name,
          picture,
          email,
          firstName,
          lastName,
          friends,
          requests,
          cover,
          about,
        } = editedUser;
        res.status(200).json({
          token,
          name,
          picture,
          email,
          firstName,
          lastName,
          friends,
          requests,
          cover,
          about,
        });
      } else {
        res.json("Unauthinticated");
      }
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
      const token = jwt.sign({ _id: _id }, "test", { expiresIn: "5min" });

      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: "Reset your password",
        html: `<p>Hi ${name}, Please click on the link below to reset your password:</p><a href="https://webweave.onrender.com/resetpassword/${token}">Reset your password</a>`,
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
      const decodedToken = jwt.verify(token, "test");
      const _id = decodedToken._id;
      const user = await User.findById(_id);

      const hashedPassword = await bcrypt.hash(password, 12);
      await User.findByIdAndUpdate(_id, { password: hashedPassword });
      res.status(200).json({ message: "success" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
