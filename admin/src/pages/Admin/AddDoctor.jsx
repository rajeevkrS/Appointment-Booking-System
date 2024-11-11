import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fee, setFee] = useState("");
  const [about, setAbout] = useState(
    "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies."
  );
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("MBBS");
  const [address1, setAddress1] = useState("47th Cross, Richmond");
  const [address2, setAddress2] = useState("Circle, Ring Road, London");

  const { adminToken, backendUrl } = useContext(AdminContext);
  const [loading, setloading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      if (!docImg) {
        return toast.error("Please select an image!");
      }

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("degree", degree);
      formData.append("fee", Number(fee));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // formData.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });

      // Add Doctor API
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { adminToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        // setAbout("");
        // setAddress1("");
        // setAddress2("");
        setFee("");
        // setDegree("");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl mx-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              // displays the selected image
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
            />
          </label>

          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="font-medium">
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-medium">Doctor name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-medium">Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-medium">Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-medium">Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-2"
                name=""
                id=""
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-medium">Fees</p>
              <input
                onChange={(e) => setFee(e.target.value)}
                value={fee}
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-medium">Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-3 py-2"
                name=""
                id=""
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-medium">Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Education"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-medium">Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 2"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <p className="mt-4 mb-2 font-medium">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-3 pt-2 border rounded"
            type="text"
            placeholder="Write about doctor..."
            required
            rows={5}
          />
        </div>

        <button
          type="submit"
          onClick={onSubmitHandler}
          disabled={loading}
          className={`bg-primary px-7 py-2 md:px-10 md:py-3 mt-4 text-white rounded font-medium ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding Doctor..." : "Add Doctor"}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
