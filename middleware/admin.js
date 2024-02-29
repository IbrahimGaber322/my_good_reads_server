import User from "../models/user.js";
const admin = async (req, res, next) => {
  try {
    const { user } = req;
    console.log(user);
    if (user.admin) {
      next();
    } else {
      res.status(401).json({ message: "Must be admin." });
    }
  } catch (error) {
    console.log(error);
  }
};

export default admin;
