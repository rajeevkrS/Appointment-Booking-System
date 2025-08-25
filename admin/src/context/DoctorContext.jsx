import { useState } from "react";
import { createContext } from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [drToken, setDrToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );

  const value = {
    backendURL,
    drToken,
    setDrToken,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
