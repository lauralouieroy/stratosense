const WEATHER_KEYS = {
  Clear: "clear",
  Clouds: "clouds",
  Rain: "rain",
  Drizzle: "drizzle",
  Thunderstorm: "storm",
  Snow: "snow",
  Mist: "fog",
  Smoke: "fog",
  Haze: "fog",
  Dust: "fog",
  Fog: "fog",
  Sand: "fog",
  Ash: "fog",
  Squall: "storm",
  Tornado: "storm",
};

export function getWeatherKey(condition) {
  return WEATHER_KEYS[condition] || "clear";
}

export function getWeatherTheme(condition) {
  return { key: getWeatherKey(condition) };
}

export function rainIntensity(description = "") {
  const text = description.toLowerCase();
  if (
    text.includes("heavy") ||
    text.includes("extreme") ||
    text.includes("violent") ||
    text.includes("ragged")
  ) {
    return 1.3;
  }
  if (text.includes("light")) return 0.9;
  return 1;
}
