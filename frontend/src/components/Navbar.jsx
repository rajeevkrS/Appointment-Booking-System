import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const { token, setToken } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  const handleStickyNavbar = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      navRef.current.classList.add("sticky_nav");
    } else {
      navRef.current.classList.remove("sticky_nav");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);

    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Disable scroll on body when mobile menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showMenu]);

  return (
    <div
      className="header flex items-center justify-between text-sm p-2 mb-5 border-b border-b-gray-400"
      ref={navRef}
    >
      <img
        className="w-40 md:w-44 cursor-pointer"
        src={assets.logo}
        alt=""
        onClick={() => navigate("/")}
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to={"/"}>
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to={"/doctors"}>
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to={"/about"}>
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <NavLink to={"/contact"}>
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>

                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointment
                </p>

                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-3 py-2 rounded-full font-semibold"
          >
            Create Account
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          src={assets.menu_icon}
          alt=""
          className="w-6 md:hidden cursor-pointer"
        />

        {/* ------Mobile Menu----- */}
        <div
          className={`${
            showMenu ? "fixed w-full h-screen" : "hidden"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} alt="" className="w-36 cursor-pointer" />
            <img
              src={assets.cross_icon}
              alt=""
              onClick={() => setShowMenu(false)}
              className="w-7 cursor-pointer"
            />
          </div>

          <ul className="flex flex-col items-center gap-2 mt-2 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to={"/"}>
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to={"/doctors"}>
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to={"/about"}>
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to={"/contact"}>
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
