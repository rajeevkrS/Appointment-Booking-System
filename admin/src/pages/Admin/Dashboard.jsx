import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { adminToken, dashData, getDashData, appointmentCancel } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const [loading, setLoading] = useState(null);

  // Fetching dashboard data
  useEffect(() => {
    if (adminToken) {
      getDashData();
    }
  }, [adminToken]);

  // Handle Cancel Appointment
  const handleCancel = async (appointmentId) => {
    setLoading(appointmentId); // Set loading state

    await appointmentCancel(appointmentId); // Call API to cancel appointment

    await getDashData(); // Fetch updated dashboard data

    setLoading(null); // Reset loading state
  };

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bgwhite p-4 rounded shadow-md border-gray-200 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.doctor_icon} alt="" />

            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bgwhite p-4 rounded shadow-md border-gray-200 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.appointments_icon} alt="" />

            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bgwhite p-4 rounded shadow-md border-gray-200 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.patients_icon} alt="" />

            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        <div className="bgwhite">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.docData.image}
                  alt=""
                />

                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>

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
      </div>
    )
  );
};

export default Dashboard;
