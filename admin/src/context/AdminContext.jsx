import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    adminToken,
    setAdminToken,
    backendUrl,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
