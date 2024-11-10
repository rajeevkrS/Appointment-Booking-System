import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { adminToken, setAdminToken } = useContext(AdminContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    adminToken && setAdminToken(""); // clearing the token
    adminToken && localStorage.removeItem("aToken"); // removing the token from localStorage
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img src={assets.logo} alt="" className="w-36 sm:w-40 cursor-pointer" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 font-bold">
          {adminToken ? "Admin" : "Doctor"}
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
