import User from "../models/user.js";
const admin = async (req, res, next) => {
  try {
    const { user } = req;
    
    if (user.admin) {
      next();
    } else {
      res.json(403);
    }
  } catch (error) {
    console.log(error);
  }
};

export default admin;
