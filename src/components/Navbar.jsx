import React, { useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { logowhite, close, menu } from "../assets/images";


const Navbar = ({ tempUnit, setTempUnit }) => {
  const [toggle, setToggle] = useState(false);

  const handleTempChange = (unit) => {
    if (tempUnit !== unit) {
      setTempUnit(unit);
    }
  };

  return (
    <nav className="bg-blue-800 rounded-md text-white py-4 px-8 flex justify-between items-center shadow-md">
      {/* Logo with responsive width and height */}
      <img
        src={logowhite}
        alt="logo"
        className="w-40 h-12 sm:w-48 sm:h-14 cursor-pointer"  // Adjust the width and height for different screens
      />

      {/* Temperature Toggle Buttons */}
      <div className="hidden sm:flex items-center space-x-6">
        <button
          className={`text-lg ${tempUnit === "C" ? "font-bold" : "text-gray-300"}`}
          onClick={() => handleTempChange("C")}
        >
          °C
        </button>
        <button
          className={`text-lg ${tempUnit === "F" ? "font-bold" : "text-gray-300"}`}
          onClick={() => handleTempChange("F")}
        >
          °F
        </button>
        <BiUserCircle size={30} />
      </div>

      {/* Mobile Menu */}
      <button
        className="sm:hidden text-2xl"
        onClick={() => setToggle(!toggle)}
      >
        {toggle ? close : menu}
      </button>

      {/* Dropdown Menu for Mobile */}
      {toggle && (
        <div className="absolute top-16 right-4 bg-blue-700 p-4 rounded shadow-lg">
          <button
            className={`block text-lg mb-2 ${tempUnit === "C" ? "font-bold" : "text-gray-300"}`}
            onClick={() => handleTempChange("C")}
          >
            °C
          </button>
          <button
            className={`block text-lg ${tempUnit === "F" ? "font-bold" : "text-gray-300"}`}
            onClick={() => handleTempChange("F")}
          >
            °F
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
