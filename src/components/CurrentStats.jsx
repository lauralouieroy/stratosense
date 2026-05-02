function CurrentStats({ weather }) {
  return (
    <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition">
      <h3 className="font-semibold text-lg mb-4 tracking-tight">
        Current Conditions
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500 text-xs uppercase">Humidity</p>
          <p className="font-semibold text-lg">{weather.humidity}%</p>
        </div>

        <div>
          <p className="text-slate-500 text-xs uppercase">Wind</p>
          <p className="font-semibold text-lg">{weather.wind} km/h</p>
        </div>

        <div>
          <p className="text-slate-500 text-xs uppercase">Pressure</p>
          <p className="font-semibold text-lg">{weather.pressure} hPa</p>
        </div>

        <div>
          <p className="text-slate-500 text-xs uppercase">Condition</p>
          <p className="font-semibold text-lg capitalize">
            {weather.main}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CurrentStats;