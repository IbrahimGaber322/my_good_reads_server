import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.js";
const user = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json(403);
        } else {
          req.userId = decoded?.id;
          next();
        }
      });
    } else {
      res.json(403);
    }
  } catch (error) {
    console.log(error);
  }
};

export default user;
