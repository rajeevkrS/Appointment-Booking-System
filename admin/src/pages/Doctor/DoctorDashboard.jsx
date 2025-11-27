import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const {
    drToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
    loadingDash,
  } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);
  const [loading, setLoading] = useState(null);

  // useEffect to call getDashData function when drToken changes
  useEffect(() => {
    if (drToken) {
      getDashData();
    }
  }, [drToken]);

  // Show loading state
  if (loadingDash) {
    return (
      <p className="m-5 text-center text-gray-500">Loading dashboard...</p>
    );
  }

  // Handle Complete Appointment
  const handleComplete = async (appointmentId) => {
    setLoading(appointmentId); // set loading for this appointment
    await completeAppointment(appointmentId); // call API
    await getDashData(); // refresh dashboard
    setLoading(null); // reset loading
  };

  // Handle Cancel Appointment
  const handleCancel = async (appointmentId) => {
    setLoading(appointmentId); // set loading for this appointment
    await cancelAppointment(appointmentId); // call API
    await getDashData(); // refresh dashboard
    setLoading(null); // reset loading
  };

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bgwhite p-4 rounded shadow-md border-gray-200 cursor-pointer hover:scale-105 transition-all ">
            <img className="w-14" src={assets.earning_icon} alt="" />

            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency}
                {dashData.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
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
                  src={item.userData.image}
                  alt=""
                />

                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>

                {/* if appointment gets cancelled then displaying Cancelled text if not cancelled then checking completed or not, if completed then displaying Completed text if not then displaying buttons img */}
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : loading === item._id ? (
                  // Spinner while action is happening
                  <div className="relative w-6 h-6 animate-spin">
                    <div className="absolute w-2 h-2 bg-gray-500 rounded-full top-0 left-0"></div>
                    <div className="absolute w-2 h-2 bg-gray-500 rounded-full top-0 right-0"></div>
                    <div className="absolute w-2 h-2 bg-gray-500 rounded-full bottom-0 left-0"></div>
                    <div className="absolute w-2 h-2 bg-gray-500 rounded-full bottom-0 right-0"></div>
                  </div>
                ) : (
                  // Action buttons
                  <div className="flex">
                    <img
                      onClick={() => handleCancel(item._id)}
                      src={assets.cancel_icon}
                      className="w-10 cursor-pointer"
                      alt="Cancel"
                    />
                    <img
                      onClick={() => handleComplete(item._id)}
                      src={assets.tick_icon}
                      className="w-10 cursor-pointer"
                      alt="Complete"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
