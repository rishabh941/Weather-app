import React, { useState, useEffect } from "react";
import {
  Forecast,
  Inputs,
  SunriseAndSunset,
  TemperatureAndDetails,
} from "../components";
import { WEATHER_API_URL, WEATHER_API_KEY } from "../components/Api";
import Navbar from "../components/Navbar";

const Home = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [tempUnit, setTempUnit] = useState("C");
  const [selectedCity, setSelectedCity] = useState({
    value: "12.9716 77.5946",
    label: "Bangalore",
  });
  const [alertConditions, setAlertConditions] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState("");
  const [previousCity, setPreviousCity] = useState(null);
  const [consecutiveUpdates, setConsecutiveUpdates] = useState(0);
  const [ignoreAlert, setIgnoreAlert] = useState(false);

  const checkForAlerts = (temp) => {
    if (ignoreAlert) {
      setIgnoreAlert(false);
      return;
    }

    const updatedConditions = [...alertConditions];

    if (temp > 20) {
      const recentCondition = updatedConditions[0] || { count: 0 };
      recentCondition.count += 1;
      updatedConditions[0] = recentCondition;

      if (recentCondition.count === 2) {
        alert("Temperature has been above 35°C for two consecutive updates!");
        recentCondition.count = 0;
      }
    } else {
      if (updatedConditions[0]) updatedConditions[0].count = 0;
    }

    setAlertConditions(updatedConditions);
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    const unit = tempUnit === "C" ? "metric" : "imperial";

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${unit}`
    );

    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${unit}`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        if (previousCity === searchData.label) {
          setConsecutiveUpdates(consecutiveUpdates + 1);
        } else {
          setPreviousCity(searchData.label);
          setConsecutiveUpdates(1);
          setAlertConditions([]);
        }

        setCurrentWeather({ city: searchData.label, ...weatherResponse });

        const forecastData = forecastResponse.list.map((entry) => ({
          date: new Date(entry.dt * 1000),
          temp_min: entry.main.temp_min,
          temp_max: entry.main.temp_max,
          icon: entry.weather[0].icon,
          description: entry.weather[0].description,
        }));

        if (consecutiveUpdates >= 2) {
          const currentTemp = weatherResponse.main.temp;
          checkForAlerts(currentTemp);
        }

        setForecast({ city: searchData.label, list: forecastData });
        setLastUpdateTime(new Date().toLocaleString());
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (selectedCity) {
      handleOnSearchChange(selectedCity);
    }

    const intervalId = setInterval(() => {
      handleOnSearchChange(selectedCity);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [tempUnit, selectedCity]);

  const handleTempUnitChange = (unit) => {
    if (tempUnit !== unit) {
      setTempUnit(unit);
      setIgnoreAlert(true);
    }
  };

  const handleCitySearchChange = (searchData) => {
    setSelectedCity(searchData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 via-blue-500 to-green-300 py-8 px-4"> {/* Calming gradient */}
      <Navbar tempUnit={tempUnit} setTempUnit={handleTempUnitChange} />
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Weather and Input */}
        <div className="p-4">
          <Inputs onSearchChange={handleCitySearchChange} />
          {currentWeather && (
            <div className="mt-4">
              <TemperatureAndDetails data={currentWeather} tempUnit={tempUnit} />
            </div>
          )}
          <div className="mt-4 text-gray-200">
            {lastUpdateTime && <p>Last updated: {lastUpdateTime}</p>}
          </div>
        </div>

        {/* Forecast and Sunrise/Sunset */}
        <div className="flex flex-col gap-6">
          {forecast && (
            <>
              <div className="p-4 text-gray-800">
                <SunriseAndSunset data={forecast.list} />
              </div>
              <div className="p-4 text-gray-800">
                <Forecast title="Daily Forecast" data={forecast} tempUnit={tempUnit} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
