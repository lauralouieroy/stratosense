export function getWeatherTheme(condition) {
  const map = {
Clear: {
  gradient: "from-blue-500 via-sky-400 to-yellow-300",
  overlay: "bg-white/10",
},
Clouds: {
  gradient: "from-blue-300 via-sky-200 to-blue-400",
  overlay: "bg-white/10",
},
Rain: {
  gradient: "from-slate-700 via-slate-600 to-slate-800",
  overlay: "bg-black/20",
},
    Thunderstorm: {
      gradient: "from-gray-800 via-slate-700 to-black",
      overlay: "bg-purple-900/30",
    },
    Drizzle: {
      gradient: "from-blue-300 via-slate-300 to-gray-400",
      overlay: "bg-blue-400/20",
    },
    Mist: {
      gradient: "from-gray-400 via-gray-300 to-gray-200",
      overlay: "bg-white/30",
    },
  };

  return map[condition] || map["Clear"];
}