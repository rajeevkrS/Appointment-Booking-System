import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";

// API to Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check for missing details
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details!" });
    }

    // check for validating the email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email!" });
    }

    // check for strong password
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Enter the strong password!",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // saving the data in DB
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // creating a token so that user can login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // finding user using email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    // if user found then matching the password
    const isMatch = await bcrypt.compare(password, user.password);

    // if password matches, generating a token for authentication
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    // get the user id from the req.body(handled in authUser.js)
    const { userId } = req.body;

    // find the user using id
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Update the user profile
const updateProfile = async (req, res) => {
  try {
    // user id will be added using the authUser middleware
    const { userId, name, phone, address, dob, gender } = req.body;

    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data missing!" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address), // convert into string
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to Book Appointment
const bookAppointment = async (req, res) => {
  try {
    // Taking these data from req
    const { userId, docId, slotDate, slotTime } = req.body;
    // const userId = req.user.id;

    // finding the doctor data using id
    const docData = await doctorModel.findById(docId).select("-password");

    // if Doctor not available, sending the res
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available!" });
    }

    // if available then storing the slots booked data into the variable
    let slots_booked = docData.slots_booked;

    // Check for slots availability
    if (slots_booked[slotDate]) {
      // If the selected time of that date is already booked, then return a failure response
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available!" });
      } else {
        // If the selected time is not booked, then book that slot by adding it to the slots_booked array
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      // If no slots are booked for the selected date, initialize the date with an empty array
      slots_booked[slotDate] = [];

      // Book the selected time by adding it to the slots_booked array for that date
      slots_booked[slotDate].push(slotTime);
    }

    // fetching the user data using id
    const userData = await userModel.findById(userId).select("-password");

    // Removing the slots_booked property from the doctor data to avoid saving redundant information
    delete docData.slots_booked;

    // Preparing appointment data with necessary information
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fee,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    // Create a new appointment record and save it to the database
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Updating the doctor's booked slots in the database with the new slots data
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments of users
const getAppointment = async (req, res) => {
  try {
    // Taking userId from req
    const { userId } = req.body;
    // const userId = req.user.id;

    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointments
const cancelAppointment = async (req, res) => {
  try {
    // Taking these data from req
    const { userId, appointmentId } = req.body;
    // const userId = req.user.id;

    // finding the appointment data using id
    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user | userId getting from auth middleware
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action!" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Removing the booked slot after cancellation

    // Taking these data from appointmentData
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    // Removes the cancelled slot from the doctor's slots_booked array
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment cancelled!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Razorpay API KEY
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment of appointment using Razorpay
const paymentRazorpay = async (req, res) => {
  try {
    // Taking these data from req
    const { appointmentId } = req.body;

    // finding the appointment data using the provided appointmentId
    const appointmentData = await appointmentModel.findById(appointmentId);

    // check if appointment is available or cancelled is true then return
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found!",
      });
    }

    // if not cancelled then Preparing Razorpay Order Options
    const options = {
      amount: appointmentData.amount * 100, // amount in paise
      currency: process.env.CURRENCY,
      receipt: appointmentId, // using the appointmentId as a unique identifier
    };

    // Creating a Razorpay Order
    // "razorpayInstance.orders.create(options)" sends the options to Razorpay's API to create a payment order
    // If successful, it returns an order object that includes details like the order ID, amount, currency, etc
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment of Razorpay
const verifyRazorpay = async (req, res) => {
  try {
    // Extract the Razorpay order ID from the request body
    const { razorpay_order_id } = req.body;

    // Fetch the order information from Razorpay using the order ID
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    // Check if the payment status is 'paid' then
    if (orderInfo.status === "paid") {
      // Update the corresponding appointment as 'paid' in the db
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true, // Mark payment as True(Completed)
      });

      res.json({ success: true, message: "Payment Successful!" });
    } else {
      res.json({ success: false, message: "Payment failed!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  getAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
