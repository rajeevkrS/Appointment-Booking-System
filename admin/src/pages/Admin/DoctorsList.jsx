import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const {
    doctors,
    adminToken,
    getAllDoctors,
    changeAvailability,
    loadingDoctors,
  } = useContext(AdminContext);

  useEffect(() => {
    if (adminToken) {
      getAllDoctors();
    }
  }, [adminToken]);

  // Show loading state
  if (loadingDoctors) {
    return <p className="m-5 text-center text-gray-500">Loading doctors...</p>;
  }

  // Another way to show loading state
  // if (loadingDoctors) {
  //   return (
  //     <div className="m-5">
  //       <div className="flex flex-wrap gap-4">
  //         {[...Array(6)].map((_, i) => (
  //           <div
  //             key={i}
  //             className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
  //           >
  //             <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
  //             <div className="p-4">
  //               <div className="h-5 bg-gray-200 animate-pulse mb-2 rounded"></div>
  //               <div className="h-4 bg-gray-200 animate-pulse mb-4 rounded"></div>
  //               <div className="h-4 bg-gray-200 animate-pulse w-20 rounded"></div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={index}
          >
            <img
              src={item.image}
              alt=""
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
            />

            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>

              <p className="text-zinc-600 text-sm font-medium">
                {item.speciality}
              </p>

              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
