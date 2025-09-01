import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // State to store drToken from localStorage if present else empty string
  const [drToken, setDrToken] = useState(
    localStorage.getItem("drToken") ? localStorage.getItem("drToken") : ""
  );

  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      // API call to get appointments for doctor panel
      const { data } = await axios.get(
        backendURL + "/api/doctor/appointments",
        {
          headers: { drToken },
        }
      );

      // if success true then set appointments in state in reverse order to show latest appointment first
      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to mark appointment as completed
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { drToken } }
      );

      if (data.success) {
        toast.success(data.message);
        // calling getAppointments function to get all updated appointments
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to mark appointment as Cancelled
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { drToken } }
      );

      if (data.success) {
        toast.success(data.message);
        // calling getAppointments function to get all updated appointments
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    backendURL,
    drToken,
    setDrToken,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
