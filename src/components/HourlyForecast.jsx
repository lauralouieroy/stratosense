function HourlyForecast() {
  return (
    <div className="rounded-2xl p-4 md:p-6 bg-white/60 backdrop-blur-md border border-white/30 shadow-md">

      <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4">
        Hourly Forecast
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
        {[1,2,3,4,5,6].map((h) => (
          <div
            key={h}
            className="snap-start min-w-[75px] md:min-w-[90px] p-3 md:p-4 rounded-xl bg-white/60 text-center"
          >
            <p className="text-xs">{h+12}:00</p>
            <p className="text-lg">☀️</p>
            <p className="font-semibold text-sm">{30+h}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;