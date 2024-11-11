import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);

  const { setAdminToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAdminToken(data.token);
        } else {
          toast.error(data.message);
        }
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
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="w-full">
          <p className="font-semibold">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#dadada] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p className="font-semibold">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#dadada] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button
          onClick={onSubmitHandler}
          disabled={loading}
          className={`bg-primary text-white w-full py-2 rounded-md text-base mt-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {state === "Admin" ? (
          <p className="font-medium">
            Doctor Login?
            <span> </span>
            <span
              onClick={() => setState("Doctor")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="font-medium">
            Admin Login?
            <span> </span>
            <span
              onClick={() => setState("Admin")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
