function WeatherIcon({ type }) {
  const base = "w-24 h-24 md:w-28 md:h-28 flex items-center justify-center";

  switch (type) {
    case "Clear":
      return (
        <div className={`${base} relative animate-float`}>
          <div className="absolute w-20 h-20 bg-yellow-300 blur-2xl opacity-60 animate-pulse rounded-full"></div>
          <div className="w-16 h-16 bg-yellow-400 rounded-full shadow-lg"></div>
        </div>
      );

    case "Clouds":
      return (
        <div className={`${base} relative animate-float`}>
          {/* Cloud glow */}
          <div className="absolute w-24 h-16 bg-white/40 blur-2xl rounded-full"></div>

          {/* Cloud body */}
          <div className="relative flex gap-[-10px]">
            <div className="w-10 h-10 bg-white rounded-full"></div>
            <div className="w-12 h-12 bg-white rounded-full -ml-4"></div>
            <div className="w-10 h-10 bg-white rounded-full -ml-4"></div>
          </div>
        </div>
      );

    case "Rain":
      return (
        <div className={`${base} relative animate-float`}>
          {/* Cloud */}
          <div className="absolute w-20 h-12 bg-gray-300 rounded-full top-6"></div>

          {/* Rain */}
          <div className="absolute top-16 flex gap-2">
            <span className="w-1 h-4 bg-blue-400 animate-pulse"></span>
            <span className="w-1 h-4 bg-blue-400 animate-pulse delay-100"></span>
            <span className="w-1 h-4 bg-blue-400 animate-pulse delay-200"></span>
          </div>
        </div>
      );

    case "Thunderstorm":
      return (
        <div className={`${base} relative animate-float`}>
          <div className="absolute w-20 h-12 bg-gray-400 rounded-full top-6"></div>

          <svg className="w-12 h-12 mt-10 animate-pulse" viewBox="0 0 100 100">
            <polygon points="50,40 40,70 60,70 50,90" fill="#FACC15" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`${base} animate-float`}>
          <div className="w-16 h-10 bg-white/70 rounded-full"></div>
        </div>
      );
  }
}

export default WeatherIcon;