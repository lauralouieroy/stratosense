import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HeroWeather from "./components/HeroWeather";
import CurrentStats from "./components/CurrentStats";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";

import { getWeather } from "./services/weatherApi";
import { getWeatherTheme } from "./utils/weatherTheme";

import logo from "./assets/statosense-logo.png";

function App() {
  const [preloadTheme, setPreloadTheme] = useState("");
  const [city, setCity] = useState("Imus");
  const [weather, setWeather] = useState(null);

  const [theme, setTheme] = useState({
    gradient: "from-blue-400 to-indigo-500",
    overlay: "",
  });

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // 🌤 PRELOADER
  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);

        setTimeout(async () => {
        await fetchWeather(city);
        setLoading(false);
      }, 600);
      } else {
        setProgress(current);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async (cityName) => {
    try {
      setError("");

      const data = await getWeather(cityName);

      const formatted = {
        location: `${data.name}, ${data.sys.country}`,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].description,
        main: data.weather[0].main,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        pressure: data.main.pressure,
      };

      // ✅ IMPORTANT FIX
      setWeather(formatted);

      const weatherMain = data.weather[0].main;

setTheme(getWeatherTheme(weatherMain));
setPreloadTheme(getWeatherTheme(weatherMain)); // 🔥 change this

      // normalize to lowercase safely
      setPreloadTheme((data.weather[0].main || "clear").toLowerCase());

    } catch (err) {
      setError("City not found");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <>
      {/* 🌤 PRELOADER */}
      {loading ? (
        <div className={`preloader-weather ${preloadTheme || "clear"}`}>

          {/* SKY (optional, keep for animation only) */}
          <div className="sky-bg"></div>

          {/* OVERLAY */}
          <div className="sky-overlay"></div>

          {/* CONTENT */}
          <div className="preloader-content">

            {/* LOGO */}
            <div className="logo-wrapper">
              <div className="logo-glow"></div>

              <div className="logo-box">
                <img src={logo} alt="StratoSense" />
              </div>
            </div>

            {/* TEXT */}
            <h1 className="app-name">StratoSense</h1>
            <p className="app-sub">Real-time weather intelligence</p>

            {/* PROGRESS */}
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="progress-text">Loading... {progress}%</p>
            </div>

          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-100">

          <Navbar
            city={city}
            setCity={setCity}
            onSearch={handleSearch}
            loading={false}
          />

          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
              {error}
            </div>
          )}

          {weather && (
            <>
              <HeroWeather weather={weather} theme={theme} />

              <main className="fade-up max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <CurrentStats weather={weather} />
                  <HourlyForecast />
                </div>

                <WeeklyForecast />

              </main>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;