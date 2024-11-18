import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, getUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateUserProfileData = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      // if user want to update its image or not
      image && formData.append("image", image);

      // Fetching the API to update the user profile
      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await getUserProfileData();
        setIsEdit(false);
        setImage(false);
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

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label className="w-40" htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
                className="w-36 rounded opacity-85"
              />

              <img
                src={image ? "" : assets.upload_icon}
                alt=""
                className="w-19 absolute bottom-6 right-6 bg-slate-500 opacity-80 hover:opacity-90 rounded"
              />
            </div>

            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img src={userData.image} alt="" className="w-36 rounded" />
        )}

        {isEdit ? (
          <input
            type="text"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={userData.name}
            className="bg-gray-50 rounded text-3xl font-medium max-w-60 mt-4"
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />

        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>

          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.email}</p>

            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                value={userData.phone}
                className="bg-gray-100 rounded max-w-52"
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <p>
                <input
                  type="text"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={userData.address.line1}
                  className="bg-gray-50 rounded"
                />

                <br />

                <input
                  type="text"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={userData.address.line2}
                  className="bg-gray-50 rounded"
                />
              </p>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1} <br /> {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>

          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                value={userData.gender}
                className="max-w-20 bg-gray-100 rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-500">{userData.gender}</p>
            )}

            <p className="font-medium">Date Of Birth</p>
            {isEdit ? (
              <input
                type="date"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={userData.dob}
                className="max-w-28 bg-gray-100 rounded"
              />
            ) : (
              <p className="text-gray-500">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          {isEdit ? (
            <>
              {/* Save Information Button */}
              <button
                type="button"
                disabled={loading}
                onClick={updateUserProfileData}
                className={`border border-primary px-8 py-2 rounded-full transition-all 
            ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary hover:text-white"
            }`}
              >
                {loading ? "Saving..." : "Save Information"}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => {
                  setIsEdit(false);
                  setImage(false); // Reset any selected image
                }}
                className="border border-red-500 px-8 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
