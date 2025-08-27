import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// API for Available Status
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    // changing the availablity status using findByIdAndUpdate()
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Availability Changed!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all doctor list for frontend
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-email", "-password"]);

    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for doctor login
const loginDoctor = async (req, res) => {
  try {
    // getting email and password from req.body
    const { email, password } = req.body;

    // finding doctor using email
    const doctor = await doctorModel.findOne({ email });

    // If doctor not found
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // If find any doctor with given email then checking password form req.body is matching with DB or not
    const isMatch = await bcrypt.compare(password, doctor.password);

    // If password is matched then generating JWT token for doctor and sending success response to frontend with token otherwise sending invalid credentials
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (res, req) => {
  try {
    const { docId } = req.body;

    // finding appointments of particular doctor using docId
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor };
