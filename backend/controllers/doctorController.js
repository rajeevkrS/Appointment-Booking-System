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
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctor.id;

    // finding appointments of particular doctor using docId
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark appontment as completed
const appointmentComplete = async (req, res) => {
  try {
    // doctor id from authDoctor middleware
    const docId = req.doctor.id;

    const { appointmentId } = req.body;

    // finding appointment using appointmentId and docId and updating status to completed
    const appointmentData = await appointmentModel.findById(appointmentId);

    // checking appointment is present or not and appointment is of same doctor or not before updating status to completed
    if (appointmentData && appointmentData.docId === docId) {
      // marking appointment as completed by setting cancelled field to true
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed!" });
    } else {
      return res.json({ success: false, message: "Mark Failed!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cnacel appontment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    // doctor id from authDoctor middleware
    const docId = req.doctor.id;

    const { appointmentId } = req.body;

    // finding appointment using appointmentId and docId and updating status to completed
    const appointmentData = await appointmentModel.findById(appointmentId);

    // if appointment is present and appointment is of same doctor then only updating cancelled status to true
    if (appointmentData && appointmentData.docId === docId) {
      // marking cancelled true if appointment is cancelled by doctor
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled!" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
};
