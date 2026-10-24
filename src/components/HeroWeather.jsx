import WeatherIcon from "./WeatherIcon";
import Neighborhood from "./Neighborhood";

function getInsight(temp, feelsLike, humidity, wind) {
  if (feelsLike > temp + 1) return "The air feels warmer than the thermometer";
  if (humidity > 75) return "The air is heavy with moisture";
  if (wind > 20) return "The wind has a real push to it";
  return "Conditions are steady right now";
}

function HeroWeather({ weather }) {
  const insight = getInsight(
    weather.temp,
    weather.feelsLike,
    weather.humidity,
    weather.wind
  );

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="hero-place">{weather.location}</p>
        <WeatherIcon type={weather.main} />
        <h2 className="hero-temp">
          {weather.temp}
          <span className="hero-deg">°</span>
        </h2>
        <p className="hero-condition">{weather.condition}</p>
        <p className="hero-feels">Feels like {weather.feelsLike}°</p>
        <p className="hero-insight">{insight}</p>
        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <Neighborhood
        className="weather-people"
        condition={weather.main}
        isNight={weather.isNight}
        wind={weather.wind}
        temp={weather.temp}
      />
    </section>
  );
}

export default HeroWeather;
