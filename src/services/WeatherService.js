import { DateTime } from "luxon";

const API_KEY = "09e24ff3e4c2627b0369649b04398a19";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Function to fetch weather data based on the type (weather or onecall)
const getWeatherData = (infoType, searchParams) => {
	const url = new URL(BASE_URL + "/" + infoType);
	url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

	return fetch(url).then((res) => res.json());
};

// Format the 7-day forecast data from the One Call API
const formatForecastWeather = (data) => {
	let { timezone, daily } = data; // Extract the daily forecast and timezone
	daily = daily.map((d) => {
		return {
			title: formatToLocalTime(d.dt, timezone, "ccc"), // Format the day
			temp: d.temp.day, // Daily temperature
			icon: d.weather[0].icon, // Weather icon
			description: d.weather[0].description, // Description of the weather
		};
	});
	return { timezone, daily };
};

// Fetch and format current weather and 7-day forecast
const getFormattedWeatherData = async (searchParams) => {
	const formattedCurrentWeather = await getWeatherData("weather", searchParams).then((data) => {
		const {
			coord: { lat, lon },
			main: { temp, feels_like, temp_min, temp_max, humidity },
			name,
			dt,
			sys: { country, sunrise, sunset },
			weather,
			wind: { speed },
		} = data;

		const { main: details, icon } = weather[0];

		return {
			lat,
			lon,
			temp,
			feels_like,
			temp_min,
			temp_max,
			humidity,
			name,
			dt,
			country,
			sunrise,
			sunset,
			details,
			icon,
			speed,
		};
	});

	const { lat, lon } = formattedCurrentWeather;

	// Fetch the 7-day forecast from the One Call API
	const formattedForecastWeather = await getWeatherData("onecall", {
		lat,
		lon,
		exclude: "minutely,hourly,current,alerts",
		units: searchParams.units,
	}).then(formatForecastWeather);

	return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

// Function to format timestamps into human-readable formats
const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") =>
	DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

// Function to get the icon URL from the code
const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime, iconUrlFromCode };
