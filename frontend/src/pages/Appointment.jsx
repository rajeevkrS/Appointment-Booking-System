import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, currencySymbol, getDoctorsData, backendUrl, token } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState({});
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);

  // This function calculates the available appointment slots for the next 7 days.
  const getAvailableSlots = async () => {
    setDocSlots([]);

    // getting current date
    let today = new Date();

    // Iterate Over the Next 7 Days
    for (let i = 0; i < 7; i++) {
      // Create a new date object for the current iteration day
      let currentDate = new Date(today);
      // Adjusting the date by adding i days
      currentDate.setDate(today.getDate() + i);

      // Set the end time for the current day at 9 PM (21:00)
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0); // endTime is set to 9 PM (21:00)

      // setting hours
      // If the current day (today) is the same as currentDate:
      if (today.getDate() === currentDate.getDate()) {
        // The time starts from one hour ahead of the current time, but not earlier than 10 AM.
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );

        // Minutes are adjusted to start at either 00 or 30.
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        // For future days, the available slots start at 10 AM with 00 minutes.
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      // Initialize an empty array to store time slots for the current day
      let timeSlots = [];

      // Generate time slots in 30-minute intervals until 9 PM.
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Extract the day, month, and year from the current date.
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
        let year = currentDate.getFullYear();

        // (e.g., '2_12_2024')
        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        // Check if the current slot is already booked.
        const isSlotAvailable =
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        // If the slot is available, add it to the timeSlots array.
        if (isSlotAvailable) {
          // These time slots are pushed into the timeSlots array with both dateTime (actual date object) and time (formatted string).
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment current time by 30mins
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Add the generated slots for the current day to the main docSlots state.
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  // Fetching the API for booking an appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment!");
      return navigate("/login");
    }

    // Ensure a time slot is selected
    if (!slotTime) {
      toast.warn("Please select a time slot before booking!");
      return;
    }

    try {
      setLoading(true);

      // Retrieve/Getting the selected date from the available slots
      const date = docSlots[slotIndex][0].dateTime;

      // Storing the date, month & year in separate var
      let day = date.getDate();
      let month = date.getMonth() + 1; // 1 - January
      let year = date.getFullYear();

      // format
      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData(); // Refresh doctors' data
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Finding the particular doctor from the doctors array using the docId
  const fetchDocInfo = async () => {
    const drInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(drInfo);
  };

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  return (
    docInfo && (
      <div>
        {/* ----------Doctors Details------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              src={docInfo.image}
              alt=""
              className="bg-primary w-full sm:max-w-72 rounded-lg"
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* --------Doc Info---------- */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img src={assets.verified_icon} alt="" className="w-5" />
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>

              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* ------- Doctor About ------- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment fee: <span></span>
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* --------Booking Slots-------- */}
        <div className="sm:ml-72 mt-5 sm:pl-4 font-medium text-gray-700">
          <p>Booking Slots</p>

          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full ${
                    item.length === 0
                      ? "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                      : slotIndex === index
                      ? "bg-primary text-white cursor-pointer"
                      : "border border-gray-300 cursor-pointer"
                  }`}
                  onClick={() => item.length > 0 && setSlotIndex(index)}
                >
                  {/* Display date and day, or "Fully Booked" if no slots */}
                  {item.length > 0 ? (
                    <>
                      <p>{daysOfWeek[item[0].dateTime.getDay()]}</p>
                      <p>{item[0].dateTime.getDate()}</p>
                    </>
                  ) : (
                    <p className="font-semibold">Fully Booked</p>
                  )}
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-600 border border-gray-300"
                  }`}
                  onClick={() => setSlotTime(item.time)}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button
            onClick={bookAppointment}
            disabled={loading}
            className={`bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Booking..." : "Book an appointment"}
          </button>
        </div>

        {/* ------Related Doctors------ */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
