import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { adminToken, setAdminToken } = useContext(AdminContext);
  const { drToken, setDrToken } = useContext(DoctorContext);
  const [loading, setLoading] = useState(false);
  const navRef = useRef(null);

  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true); // Start loading
    try {
      // Clear admin token
      adminToken && setAdminToken("");
      adminToken && localStorage.removeItem("aToken");

      // Clear doctor token
      drToken && setDrToken("");
      drToken && localStorage.removeItem("drToken");

      // Display toast message
      toast.success("Logout successful!");

      // Navigate to home page
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout failed:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleStickyNavbar = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      navRef.current.classList.add("sticky_nav");
    } else {
      navRef.current.classList.remove("sticky_nav");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);

    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  return (
    <div
      className="header flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white"
      ref={navRef}
    >
      <div className="flex items-center gap-2 text-xs">
        <img src={assets.logo} alt="" className="w-36 sm:w-40 cursor-pointer" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 font-bold">
          {adminToken ? "Admin" : "Doctor"}
        </p>
      </div>

      <button
        onClick={logout}
        disabled={loading}
        className={`bg-primary text-white text-sm px-7 p md:px-10 py-2 rounded-full font-semibold ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default Navbar;
