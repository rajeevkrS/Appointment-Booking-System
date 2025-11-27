import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState(null); // Track canceling appointment
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const itemsPerPage = 10; // Number of appointments per page
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const navigate = useNavigate();
  const [loadingAppointmentId, setLoadingAppointmentId] = useState(null);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");

    return (
      dateArray[0] +
      " " +
      months[parseInt(dateArray[1], 10) - 1] +
      " " +
      dateArray[2]
    );
  };

  // Fetching the API to get all appointments of users
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Fetching the API to cancel an appointments of users
  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      setCancellingAppointmentId(appointmentId);

      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments(); // updating the user's appointments data
        getDoctorsData(); // updating the doctors data like slot time
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
      setCancellingAppointmentId(null);
    }
  };

  // Function initializes the Razorpay payment gateway and handles the payment process.
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      method: {
        card: true, // Enable card payments
        netbanking: false,
        wallet: false,
        upi: false,
        emi: false,
        paylater: false,
      },
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            { headers: { token } }
          );

          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
            toast.success("Payment Successful!");
          }
        } catch (error) {
          toast.error(error.message);
          console.log(error);
        } finally {
          setLoading(false);
          setLoadingAppointmentId(null);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Fetching the API to make the payment using Razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      setLoading(true);
      setLoadingAppointmentId(appointmentId);

      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // Pagination logic
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const currentAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>

      {appointments.length === 0 ? (
        <p className="mt-5 text-center text-zinc-500">
          No appointments available!
        </p>
      ) : (
        <>
          <div>
            {currentAppointments.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              >
                <div>
                  <img
                    src={item.docData.image}
                    alt=""
                    className="w-32 bg-indigo-50"
                  />
                </div>
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold">
                    {item.docData.name}
                  </p>
                  <p>{item.docData.speciality}</p>
                  <p className="text-zinc-700 font-medium mt-1">Address:</p>
                  <p className="text-xs">{item.docData.address.line1}</p>
                  <p className="text-xs">{item.docData.address.line2}</p>
                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Date & Time:
                    </span>
                    <span> </span>
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  {!item.cancelled && !item.payment && !item.isCompleted && (
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      disabled={loading && loadingAppointmentId === item._id}
                      className={`text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded transition-all duration-300 ${
                        loading && loadingAppointmentId === item._id
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "hover:bg-primary hover:text-white"
                      }`}
                    >
                      {loading && loadingAppointmentId === item._id
                        ? "Processing..."
                        : "Pay Online"}
                    </button>
                  )}

                  {!item.cancelled && item.payment && !item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border text-stone-500 rounded bg-indigo-50">
                      Paid
                    </button>
                  )}

                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      disabled={loading && cancellingAppointmentId === item._id}
                      className={`text-sm text-center sm:min-w-48 py-2 border rounded transition-all duration-300 ${
                        loading && cancellingAppointmentId === item._id
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "hover:bg-red-600 hover:text-white text-stone-500"
                      }`}
                    >
                      {loading && cancellingAppointmentId === item._id
                        ? "Cancelling..."
                        : "Cancel Appointment"}
                    </button>
                  )}

                  {item.cancelled && !item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                      Appointment Cancelled
                    </button>
                  )}

                  {item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                      Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls - Display only if there are more than 10 appointments */}
          {appointments.length > 10 && (
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
        </>
      )}
    </div>
  );
};

export default MyAppointments;
