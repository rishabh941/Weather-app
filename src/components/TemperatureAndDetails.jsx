import React from "react";
import { GoLocation } from "react-icons/go";
import { temp, wind, humid } from "../assets/images";

const TemperatureAndDetails = ({ data, tempUnit }) => {
  const displayTemp = (temp) => {
    if (tempUnit === "F" && data.unit === "C") {
      return Math.round((temp * 9) / 5 + 32);
    } else if (tempUnit === "C" && data.unit === "F") {
      return Math.round(((temp - 32) * 5) / 9);
    }
    return Math.round(temp);
  };

  const displayWindSpeed = (speed) => {
    return tempUnit === "F" ? `${speed} mph` : `${speed} m/s`;
  };

  return (
    <div className="bg-gradient-to-b from-blue-500 to-indigo-600 p-8 rounded-lg shadow-lg text-white">
      <div className="flex items-center justify-center mt-6 mb-4">
        <p className="flex items-center text-3xl font-semibold">
          <GoLocation size={24} className="mr-2" />
          {data.city}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <img
          src={`icons/${data.weather[0].icon}.svg`}
          alt="weather-icon"
          className="h-24 w-24"
        />
        <div className="text-center">
          <p className="text-7xl font-extrabold">
            {displayTemp(data.main.temp)}&deg;{tempUnit}
          </p>
          <p className="text-xl capitalize text-gray-200">
            {data.weather[0].description}
          </p>
        </div>
      </div>

      <hr className="border-gray-400 my-6" />

      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <img src={temp} alt="temperature icon" className="mx-auto h-10 w-10" />
          <p className="text-2xl font-semibold">
            {displayTemp(data.main.feels_like)}&deg;{tempUnit}
          </p>
          <p className="text-sm text-gray-300">Feels Like</p>
        </div>
        <div>
          <img src={humid} alt="humidity icon" className="mx-auto h-10 w-10" />
          <p className="text-2xl font-semibold">{data.main.humidity}%</p>
          <p className="text-sm text-gray-300">Humidity</p>
        </div>
        <div>
          <img src={wind} alt="wind icon" className="mx-auto h-10 w-10" />
          <p className="text-2xl font-semibold">{displayWindSpeed(data.wind.speed)}</p>
          <p className="text-sm text-gray-300">Wind Speed</p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureAndDetails;
