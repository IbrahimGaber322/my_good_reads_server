import User from "../models/user.js";
const admin = async (req, res, next) => {
  try {
    console.log("admin")
    const user = await User.findById(req.userId);
    console.log(req.body);
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
