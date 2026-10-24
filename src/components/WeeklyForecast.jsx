import WeatherIcon from "./WeatherIcon";

function WeeklyForecast({ days }) {
  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-sm md:text-lg font-semibold mb-4">
        5-Day Forecast
      </h3>

      {days?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {days.map((day) => (
            <div key={day.label} className="forecast-chip">
              <p className="text-sm">{day.label}</p>
              <WeatherIcon type={day.main} size="sm" />
              <p className="text-sm font-semibold">{day.high}°</p>
              <p className="forecast-low">{day.low}°</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="stat-label">Forecast is unavailable right now.</p>
      )}
    </div>
  );
}

export default WeeklyForecast;
