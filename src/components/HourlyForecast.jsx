import WeatherIcon from "./WeatherIcon";

function HourlyForecast({ hours }) {
  return (
    <div className="glass-card p-4 md:p-6">
      <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4">
        Next 24 Hours
      </h3>

      {hours?.length ? (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {hours.map((hour, index) => (
            <div
              key={`${hour.time}-${index}`}
              className="forecast-chip snap-start min-w-[75px] md:min-w-[90px]"
            >
              <p className="text-xs">{hour.time}</p>
              <WeatherIcon type={hour.main} size="sm" />
              <p className="font-semibold text-sm">{hour.temp}°</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="stat-label">Forecast is unavailable right now.</p>
      )}
    </div>
  );
}

export default HourlyForecast;
