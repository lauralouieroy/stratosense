function WeeklyForecast() {
  const days = ["Mon","Tue","Wed","Thu","Fri"];

  return (
    <div className="rounded-2xl p-4 md:p-6 bg-white/60 backdrop-blur-md border border-white/30 shadow-md">

      <h3 className="text-sm md:text-lg font-semibold mb-4">
        7-Day Forecast
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {days.map((d,i)=>(
          <div key={d} className="p-3 md:p-4 bg-white/60 rounded-xl text-center">
            <p className="text-sm">{d}</p>
            <p>☀️</p>
            <p className="text-sm font-semibold">{32-i}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyForecast;