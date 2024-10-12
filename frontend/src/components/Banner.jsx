import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
      {/* ------Left Side-------- */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
        <button
          className="bg-white font-semibold text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6"
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
        >
          Create Account
        </button>
      </div>

      {/* ------Right Side-------- */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img
          src={assets.appointment_img}
          alt=""
          className="w-full absolute bottom-0 right-0 max-w-md"
        />
      </div>
    </div>
  );
};

export default Banner;