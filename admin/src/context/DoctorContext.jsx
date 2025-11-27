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
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // Function to get all appointments for doctor panel
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
        // console.log(data.appointments);
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
        getDashData();
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
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to get dashboard data for doctor panel
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/doctor/dashboard", {
        headers: { drToken },
      });

      if (data.success) {
        setDashData(data.dashData);
        // console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to get profile data for doctor panel
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/doctor/profile", {
        headers: { drToken },
      });

      if (data.success) {
        setProfileData(data.profileData);
        // console.log(data.profileData);
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
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
