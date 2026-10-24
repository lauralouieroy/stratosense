const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

async function read(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(response.status === 404 ? "not-found" : "unavailable");
    error.code = response.status === 404 ? "not-found" : "unavailable";
    throw error;
  }

  return response.json();
}

function endpoint(path) {
  const joiner = path.includes("?") ? "&" : "?";
  return `${BASE}/${path}${joiner}units=metric&appid=${API_KEY}`;
}

async function reportFor(query) {
  const [currentResult, forecastResult] = await Promise.allSettled([
    read(endpoint(`weather?${query}`)),
    read(endpoint(`forecast?${query}`)),
  ]);

  if (currentResult.status === "rejected") {
    throw currentResult.reason;
  }

  return {
    current: currentResult.value,
    forecast: forecastResult.status === "fulfilled" ? forecastResult.value : null,
  };
}

export function getCityReport(city) {
  const name = encodeURIComponent(city.trim());
  return reportFor(`q=${name}`);
}

export function getCoordReport(lat, lon) {
  return reportFor(`lat=${lat}&lon=${lon}`);
}

function fold(value) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export async function searchCities(query, signal) {
  const typed = query.trim();
  const name = encodeURIComponent(typed);
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=8&language=en&format=json`,
    { signal }
  );

  if (!response.ok) {
    const error = new Error("unavailable");
    error.code = "unavailable";
    throw error;
  }

  const data = await response.json();
  const needle = fold(typed);
  const seen = new Set();
  const places = [];

  for (const place of data.results || []) {
    const label = [place.name, place.admin1, place.country_code].filter(Boolean).join(", ");
    if (seen.has(label)) continue;
    if (!fold(place.name).includes(needle)) continue;
    seen.add(label);
    places.push({
      name: place.name,
      state: place.admin1 || "",
      country: place.country_code || "",
      lat: place.latitude,
      lon: place.longitude,
      label,
      rank: fold(place.name).startsWith(needle) ? 0 : 1,
    });
  }

  return places
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5)
    .map(({ rank, ...place }) => place);
}
