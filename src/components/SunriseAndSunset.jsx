import React from "react";
import { TbSunHigh, TbSunLow } from "react-icons/tb";

const calculateDailyTemperatures = (forecastData) => {
  const temps = forecastData.map((entry) => (entry.temp_min + entry.temp_max) / 2);
  const temp_min = Math.min(...forecastData.map((entry) => entry.temp_min));
  const temp_max = Math.max(...forecastData.map((entry) => entry.temp_max));
  const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;

  return {
    minTemp: temp_min,
    maxTemp: temp_max,
    avgTemp,
  };
};

const SunriseAndSunset = ({ data }) => {
  const dailyTemps = calculateDailyTemperatures(data);

  if (!dailyTemps) {
    return <p className="text-white">No data available.</p>;
  }

  const { minTemp, maxTemp, avgTemp } = dailyTemps;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-lg shadow-md text-white max-w-sm mx-auto"> {/* Added background color and compact card size */}
      <div className="flex justify-around items-center">
        <div>
          <TbSunHigh size={40} className="text-yellow-400 mx-auto mb-1" /> {/* Adjusted icon size and color */}
          <p className="text-xl font-semibold">High</p> {/* Larger text size */}
          <p className="text-2xl font-bold">{Math.round(maxTemp)}&deg;</p> {/* Larger temperature display */}
        </div>

        <div>
          <TbSunLow size={40} className="text-yellow-400 mx-auto mb-1" /> {/* Adjusted icon size and color */}
          <p className="text-xl font-semibold">Low</p>
          <p className="text-2xl font-bold">{Math.round(minTemp)}&deg;</p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xl font-semibold">Average</p>
        <p className="text-3xl font-extrabold">{Math.round(avgTemp)}&deg;</p> {/* Larger text size for emphasis */}
      </div>
    </div>
  );
};

export default SunriseAndSunset;
