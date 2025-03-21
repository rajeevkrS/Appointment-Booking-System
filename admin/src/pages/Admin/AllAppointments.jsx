import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { adminToken, appointments, getAllAppointments, appointmentCancel } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [loading, setLoading] = useState(null);

  // Fetching all appointments when the component loads
  useEffect(() => {
    if (adminToken) {
      getAllAppointments();
    }
  }, [adminToken]);

  // Handle Cancel Appointment
  const handleCancel = async (appointmentId) => {
    setLoading(appointmentId); // Set loading state

    await appointmentCancel(appointmentId); // Call API

    setLoading(null); // Reset loading state
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rouded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {appointments
          .slice()
          .reverse()
          .map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            >
              <p className="max-sm:hidden">{index + 1}</p>

              <div className="flex items-center gap-2">
                <img
                  src={item.userData.image}
                  alt=""
                  className="w-8 rounded-full"
                />

                <p>{item.userData.name}</p>
              </div>

              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              <div className="flex items-center gap-2">
                <img
                  src={item.docData.image}
                  alt=""
                  className="w-8 rounded-full bg-gray-200"
                />

                <p>{item.docData.name}</p>
              </div>

              <p>
                {currency}
                {item.amount}
              </p>

              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : loading === item._id ? (
                <div className="relative w-6 h-6 animate-spin">
                  <div className="absolute w-2 h-2 bg-gray-500 rounded-full top-0 left-0"></div>
                  <div className="absolute w-2 h-2 bg-gray-500 rounded-full top-0 right-0"></div>
                  <div className="absolute w-2 h-2 bg-gray-500 rounded-full bottom-0 left-0"></div>
                  <div className="absolute w-2 h-2 bg-gray-500 rounded-full bottom-0 right-0"></div>
                </div>
              ) : (
                <img
                  onClick={() => handleCancel(item._id)}
                  src={assets.cancel_icon}
                  alt=""
                  className="w-10 cursor-pointer"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllAppointments;
