import React from "react";
import { assets } from "../assets/assets";
import { RiFacebookFill, RiLinkedinFill } from "react-icons/ri";
import { AiFillInstagram } from "react-icons/ai";

const socialLinks = [
  {
    icon: <RiFacebookFill className="group-hover:text-white w-4 h-5" />,
  },
  {
    icon: <RiLinkedinFill className="group-hover:text-white w-4 h-5" />,
  },
  {
    icon: <AiFillInstagram className="group-hover:text-white w-4 h-5" />,
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* -------Left Section--------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Vaishnavi Tech Park, 3rd & 4th Floor Sarjapur Main Road, Ghitorni
            New Delhi - 110030
          </p>

          <div className="flex items-center gap-3 mt-4">
            {socialLinks.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer w-9 h-9 border border-slid border-[#181a1e] rounded-full flex items-center justify-center group hover:bg-primary hover:border-none"
              >
                {item.icon}
              </div>
            ))}
          </div>
        </div>

        {/* -------Middle Section--------- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>

          <ul className="flex flex-col gap-2 text-gray-600 font-semibold">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* -------Right Section--------- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>

          <ul className="flex flex-col gap-2 text-gray-600 font-semibold">
            <li>+1-000-000-1080</li>
            <li>rajeevkumarsudhansu@gamil.com</li>
          </ul>
        </div>
      </div>

      {/* -----------Copyright Text------------ */}
      <div>
        <hr />
        <p className="text-center py-5 text-sm">
          Copyright © {year} AppointMed - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
