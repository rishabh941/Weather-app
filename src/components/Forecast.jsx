import React from "react";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const groupByDay = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    const date = new Date(item.date).toDateString();
    if (!groupedData[date]) {
      groupedData[date] = {
        temp_min: item.temp_min,
        temp_max: item.temp_max,
        icon: item.icon,
        description: item.description,
      };
    } else {
      groupedData[date].temp_min = Math.min(groupedData[date].temp_min, item.temp_min);
      groupedData[date].temp_max = Math.max(groupedData[date].temp_max, item.temp_max);
    }
  });
  return Object.keys(groupedData).map((date) => ({
    date,
    ...groupedData[date],
  }));
};

const Forecast = ({ data, title, tempUnit }) => {
  const dailyData = groupByDay(data.list).slice(0, 6); // Slicing to display 6 days
  const currentDay = new Date().getDay();
  const forecastDays = WEEK_DAYS.slice(currentDay, WEEK_DAYS.length).concat(WEEK_DAYS.slice(0, currentDay));

  return (
    <div className="text-white">
      <div className="text-center text-2xl font-bold mb-6">{title}</div>

      {/* Display the forecast in two rows of 3 cards each */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {dailyData.map((item, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-b from-blue-700 to-indigo-900 p-6 rounded-lg shadow-md text-center"
          >
            <p className="text-gray-300 text-sm mb-2">{forecastDays[idx]}</p>
            <img
              src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt="weather-icon"
              className="mx-auto w-16 h-16 mb-3"
            />
            <p className="text-lg font-bold">
              {Math.round(item.temp_max)}&deg;{tempUnit}
            </p>
            <p className="text-gray-300 text-sm">Min: {Math.round(item.temp_min)}&deg;{tempUnit}</p>
            <p className="capitalize text-sm mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
