import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        succes: false,
        message: "Not authorized, Login again!",
      });
    }

    // Verifying the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // got the user id from the token and it will be added in the req.body
    req.body.userId = token_decode.id;
    // req.user = { id: token_decode.id };

    next();
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: error.message });
  }
};

export default authUser;
