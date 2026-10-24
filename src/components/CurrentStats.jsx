function CurrentStats({ weather }) {
  const wind = weather.windDir
    ? `${weather.wind} km/h ${weather.windDir}`
    : `${weather.wind} km/h`;

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-lg mb-4 tracking-tight">
        Current Conditions
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="stat-label">Humidity</p>
          <p className="stat-value">{weather.humidity}%</p>
        </div>

        <div>
          <p className="stat-label">Wind</p>
          <p className="stat-value">{wind}</p>
        </div>

        <div>
          <p className="stat-label">Pressure</p>
          <p className="stat-value">{weather.pressure} hPa</p>
        </div>

        <div>
          <p className="stat-label">Condition</p>
          <p className="stat-value capitalize">
            {weather.main}
          </p>
        </div>

        <div>
          <p className="stat-label">Sunrise</p>
          <p className="stat-value">{weather.sunrise}</p>
        </div>

        <div>
          <p className="stat-label">Sunset</p>
          <p className="stat-value">{weather.sunset}</p>
        </div>
      </div>
    </div>
  );
}

export default CurrentStats;
