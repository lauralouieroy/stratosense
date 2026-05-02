import WeatherIcon from "./WeatherIcon";

function getInsight(temp, feelsLike, humidity, wind) {
  if (feelsLike > temp + 1) return "Feels warmer than actual temperature";
  if (humidity > 75) return "Humidity is high today";
  if (wind > 20) return "Wind is quite strong";
  return "Weather conditions are moderate";
}

function HeroWeather({ weather, theme }) {
  const insight = getInsight(
    weather.temp,
    weather.feelsLike,
    weather.humidity,
    weather.wind
  );

  return (
    <section className="relative px-4 md:px-6 py-16 md:py-24 text-center text-white overflow-hidden">

      {/* 🌈 Dynamic Sky (bigger for movement) */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-[-25%] bg-gradient-to-br ${theme.gradient} animate-sky`}
        />
      </div>

      {/* 🌫 Atmospheric overlay */}
      <div className={`absolute inset-0 ${theme.overlay} backdrop-blur-2xl`} />

      {/* 🌧 Rain Effect */}
      {weather.main === "Rain" && (
        <div className="absolute inset-0 rain opacity-40"></div>
      )}

      {/* ☀️ Center Glow (MAIN IMPROVEMENT) */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-40 h-40 md:w-56 md:h-56 bg-white/20 rounded-full blur-3xl opacity-70"></div>
      </div>

      {/* ✨ Light blobs (subtle depth) */}
      <div className="absolute inset-0">
        <div className="absolute w-60 h-60 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl top-[-60px] left-[-60px]" />
        <div className="absolute w-60 h-60 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl bottom-[-60px] right-[-60px]" />
      </div>

      {/* 📊 Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Location */}
        <p className="text-xs md:text-sm opacity-90 mb-2">
          {weather.location}
        </p>

        {/* Animated Icon */}
        <div className="mb-2">
          <WeatherIcon type={weather.main} />
        </div>

        {/* Temperature (MAIN FOCUS) */}
        <h2 className="text-7xl md:text-9xl font-bold tracking-tight drop-shadow-xl leading-none">
          {weather.temp}°
        </h2>

        {/* Condition */}
        <p className="text-base md:text-xl mt-2 capitalize opacity-90 drop-shadow">
          {weather.condition}
        </p>

        {/* Feels Like */}
        <p className="text-sm opacity-80 mt-1">
          Feels like {weather.feelsLike}°
        </p>

        {/* Insight */}
        <p className="text-xs opacity-80 mt-3 max-w-xs">
          {insight}
        </p>

      </div>
    </section>
  );
}

export default HeroWeather;