import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  // Fetching from API for doctors list
  const getDoctorsData = async () => {
    try {
      setDoctorsLoading(true);

      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      // console.log(error);
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Fetching from API to get user profile data
  const getUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
        setLoadingUser(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      // console.log(error);
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      setLoadingUser(true);
      getUserProfileData();
    } else {
      setUserData(false);
      setLoadingUser(false);
    }
  }, [token]);

  const value = {
    doctors,
    doctorsLoading,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    loadingUser,
    setUserData,
    getDoctorsData,
    getUserProfileData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
