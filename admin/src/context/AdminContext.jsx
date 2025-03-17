import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetching from API get all doctors list
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {}, // not sending anything thats why empty object
        { headers: { adminToken } }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Fetching from API for Available Status
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { adminToken } }
      );

      if (data.success) {
        toast.success(data.message);

        // after changing the status then updating the doctors data
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Fetching from API to get all appointments list
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { adminToken },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Fetching from API to cancel appointments
  const appointmentCancel = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { adminToken } }
      );

      if (data.success) {
        toast.success(data.message);

        // after cancelling the appointment then updating the appointments data
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log;
    }
  };

  const value = {
    adminToken,
    setAdminToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    appointmentCancel,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
