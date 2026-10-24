import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import HeroWeather from "./components/HeroWeather";
import CurrentStats from "./components/CurrentStats";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";

import { getCityReport, getCoordReport } from "./services/weatherApi";
import { formatReport } from "./utils/formatWeather";
import { getWeatherTheme } from "./utils/weatherTheme";
import WeatherAtmosphere from "./components/WeatherAtmosphere";

import Logo from "./components/Logo";
import Neighborhood from "./components/Neighborhood";

const STORAGE_KEY = "stratosense.city";

function storedCity() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "Imus";
  } catch {
    return "Imus";
  }
}

function rememberCity(city) {
  try {
    localStorage.setItem(STORAGE_KEY, city);
  } catch {
    // Storage can be blocked. The current visit still works.
  }
}

function App() {
  const [city, setCity] = useState(storedCity);
  const [weather, setWeather] = useState(null);
  const [theme, setTheme] = useState(getWeatherTheme("Clear"));
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [bootReady, setBootReady] = useState(false);
  const [progressDone, setProgressDone] = useState(false);
  const [error, setError] = useState("");
  const placeRef = useRef("");
  const requestRef = useRef(0);

  const applyReport = (report) => {
    placeRef.current = report.location;
    rememberCity(report.city);
    setCity(report.city);
    setWeather(report);
    setTheme(getWeatherTheme(report.main));
    setError("");
  };

  const failureMessage = (requestError, query) => {
    if (requestError?.code === "not-found") {
      return placeRef.current
        ? `No match for "${query}". Still showing ${placeRef.current}.`
        : `No match for "${query}".`;
    }
    return "Weather is unavailable right now.";
  };

  useEffect(() => {
    let alive = true;
    const startingCity = storedCity();
    getCityReport(startingCity)
      .then((payload) => {
        if (!alive) return;
        applyReport(formatReport(payload.current, payload.forecast));
      })
      .catch((requestError) => {
        if (!alive) return;
        setError(
          requestError?.code === "not-found"
            ? `No match for "${startingCity}".`
            : "Weather is unavailable right now."
        );
      })
      .finally(() => {
        if (alive) setBootReady(true);
      });

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        if (alive) setProgressDone(true);
      } else {
        setProgress(current);
      }
    }, 80);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!bootReady || !progressDone) return undefined;
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, [bootReady, progressDone]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const query = city.trim();

    if (!query) {
      setError("Enter a city name.");
      return;
    }

    const requestId = ++requestRef.current;
    setSearching(true);
    setLocating(false);
    setError("");

    try {
      const payload = await getCityReport(query);
      if (requestId !== requestRef.current) return;
      applyReport(formatReport(payload.current, payload.forecast));
    } catch (requestError) {
      if (requestId !== requestRef.current) return;
      setError(failureMessage(requestError, query));
    } finally {
      if (requestId === requestRef.current) setSearching(false);
    }
  };

  const handlePick = async (place) => {
    const requestId = ++requestRef.current;
    setCity(place.name);
    setSearching(true);
    setLocating(false);
    setError("");

    try {
      const payload = await getCoordReport(place.lat, place.lon);
      if (requestId !== requestRef.current) return;
      applyReport(formatReport(payload.current, payload.forecast));
    } catch (requestError) {
      if (requestId !== requestRef.current) return;
      setError(failureMessage(requestError, place.name));
    } finally {
      if (requestId === requestRef.current) setSearching(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError("This browser can't share your location.");
      return;
    }

    const requestId = ++requestRef.current;
    setLocating(true);
    setSearching(false);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (requestId !== requestRef.current) return;

        try {
          const payload = await getCoordReport(coords.latitude, coords.longitude);
          if (requestId !== requestRef.current) return;
          applyReport(formatReport(payload.current, payload.forecast));
        } catch {
          if (requestId !== requestRef.current) return;
          setError("Couldn't load weather for your location.");
        } finally {
          if (requestId === requestRef.current) setLocating(false);
        }
      },
      () => {
        if (requestId !== requestRef.current) return;
        setLocating(false);
        setError("Location permission was blocked. Search for a city instead.");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 }
    );
  };

  return (
    <>
      {loading ? (
        <div className={`preloader-weather scene scene-${theme.key}${weather?.isNight ? " is-night" : ""}`}>
          <WeatherAtmosphere
            condition={weather?.main}
            detail={weather?.condition}
            wind={weather?.wind || 0}
            isNight={!!weather?.isNight}
          />

          <div className="preloader-content">
            <div className="logo-wrapper">
              <div className="logo-glow"></div>
              <Logo decorative className="logo-mark-lg" />
            </div>

            <h1 className="app-name">StratoSense</h1>
            <p className="app-sub">Reading the atmosphere</p>

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

          <Neighborhood
            compact
            condition={weather?.main}
            isNight={!!weather?.isNight}
            wind={weather?.wind || 0}
            temp={weather?.temp ?? 20}
          />
        </div>
      ) : (
        <div className={`scene scene-${theme.key}${weather?.isNight ? " is-night" : ""}`}>
          <WeatherAtmosphere
            condition={weather?.main}
            detail={weather?.condition}
            wind={weather?.wind || 0}
            isNight={!!weather?.isNight}
          />

          <div className="scene-content">
            <Navbar
              city={city}
              setCity={setCity}
              onSearch={handleSearch}
              onPick={handlePick}
              onLocate={handleLocate}
              loading={searching}
              locating={locating}
            />

            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            {weather && (
              <>
                <HeroWeather weather={weather} />

                <main className="scene-main">
                  <div className="detail-board">
                    <CurrentStats weather={weather} />
                    <HourlyForecast hours={weather.hourly} />
                    <WeeklyForecast days={weather.daily} />
                  </div>
                </main>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
