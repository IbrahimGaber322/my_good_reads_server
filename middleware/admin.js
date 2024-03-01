import User from "../models/user.js";
const admin = async (req, res, next) => {
  const { user } = req;
  if (user.admin) {
    next();
  } else {
    res.status(401).json({ message: "Must be admin." });
  }
};

export default admin;
