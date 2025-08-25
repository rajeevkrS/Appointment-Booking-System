import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { adminToken, appointments, getAllAppointments, appointmentCancel } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [loading, setLoading] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetching all appointments when the component loads
  useEffect(() => {
    if (adminToken) {
      getAllAppointments();
    }
  }, [adminToken]);

  // Handle Cancel Appointment
  const handleCancel = async (appointmentId) => {
    setLoading(appointmentId);
    await appointmentCancel(appointmentId);
    setLoading(null);
  };

  // Reverse order (latest first)
  const reversedAppointments = [...appointments].reverse();

  // Pagination logic
  const totalPages = Math.ceil(reversedAppointments.length / itemsPerPage);
  const currentAppointments = reversedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b">
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {/* Appointments list */}
        {currentAppointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">
              {(currentPage - 1) * itemsPerPage + index + 1}
            </p>

            {/* Patient Info */}
            <div className="flex items-center gap-2">
              <img
                src={item.userData.image}
                alt=""
                className="w-8 rounded-full max-sm:hidden"
              />
              <p>{item.userData.name}</p>
            </div>

            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* Doctor Info */}
            <div className="flex items-center gap-2">
              <img
                src={item.docData.image}
                alt=""
                className="w-8 rounded-full bg-gray-200 max-sm:hidden"
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
                alt="cancel"
                className="w-10 cursor-pointer"
              />
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls - Only if more than 10 */}
      {appointments.length > itemsPerPage && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
