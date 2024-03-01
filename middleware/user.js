import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.js";
import User from "../models/user.js";
const user = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          res.status(401).json({ message: "Must be logged in." });
        } else {
          try {
            const foundUser = await User.findById(decoded?.id);
            if (!foundUser)
              return res.status(404).json({ message: "User not found." });
            req.user = foundUser;
            next();
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        }
      });
    } else {
      res.status(401).json({ message: "Token missing." });
    }
  } catch (error) {
    res.status(500).json({ message: "Database error, try again later." });
  }
};

export default user;
