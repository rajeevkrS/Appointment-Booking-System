import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { admintoken } = req.headers;

    if (!admintoken) {
      return res.json({
        succes: false,
        message: "Not authorized, Login again!",
      });
    }

    // Verifying the token
    const token_decode = jwt.verify(admintoken, process.env.JWT_SECRET);

    // check
    if (token_decode != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        succes: false,
        message: "Not authorized, Login again!",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: error.message });
  }
};

export default authAdmin;
