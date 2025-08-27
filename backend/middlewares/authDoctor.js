import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { drtoken } = req.headers;

    // If drtoken is not present
    if (!drtoken) {
      return res.json({
        succes: false,
        message: "Not authorized, Login again!",
      });
    }

    // Verifying the drtoken
    const drtoken_decode = jwt.verify(drtoken, process.env.JWT_SECRET);

    // got the doctor id from the drtoken and it will be added in the req.body
    req.doctor = { id: drtoken_decode.id };

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: error.message });
  }
};

export default authDoctor;
