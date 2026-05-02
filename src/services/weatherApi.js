const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function getWeather(city = "Imus") {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},PH&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("City not found");
  }

  return res.json();
}