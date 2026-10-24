const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function shifted(unix, offset) {
  return new Date((unix + offset) * 1000);
}

function dateKey(unix, offset) {
  const time = shifted(unix, offset);
  return `${time.getUTCFullYear()}-${time.getUTCMonth()}-${time.getUTCDate()}`;
}

function hourOf(unix, offset) {
  return shifted(unix, offset).getUTCHours();
}

function formatHour(unix, offset) {
  const hour = hourOf(unix, offset);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12} ${suffix}`;
}

function formatClock(unix, offset) {
  if (!unix && unix !== 0) return "—";
  const time = shifted(unix, offset);
  const hour = time.getUTCHours();
  const minute = String(time.getUTCMinutes()).padStart(2, "0");
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
}

function compass(degrees) {
  if (degrees == null || Number.isNaN(degrees)) return "";
  return COMPASS[Math.round(degrees / 45) % 8];
}

function daytimeEntry(items, offset) {
  return items.reduce((closest, item) => {
    const distance = Math.abs(hourOf(item.dt, offset) - 13);
    if (!closest || distance < closest.distance) {
      return { item, distance };
    }
    return closest;
  }, null).item;
}

function buildHourly(list, offset) {
  return (list || []).slice(0, 8).map((item) => ({
    time: formatHour(item.dt, offset),
    temp: Math.round(item.main.temp),
    main: item.weather[0].main,
  }));
}

function buildDaily(list, offset) {
  const groups = new Map();

  for (const item of list || []) {
    const key = dateKey(item.dt, offset);
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  }

  const today = dateKey(Math.floor(Date.now() / 1000), offset);

  return Array.from(groups.entries()).slice(0, 5).map(([key, items]) => {
    const sample = daytimeEntry(items, offset);
    const temps = items.map((item) => item.main.temp);
    const time = shifted(sample.dt, offset);

    return {
      label: key === today ? "Today" : WEEKDAYS[time.getUTCDay()],
      high: Math.round(Math.max(...temps)),
      low: Math.round(Math.min(...temps)),
      main: sample.weather[0].main,
    };
  });
}

export function formatReport(current, forecast) {
  const offset = current.timezone ?? forecast?.city?.timezone ?? 0;
  const list = forecast?.list ?? [];

  return {
    location: `${current.name}, ${current.sys.country}`,
    city: current.name,
    temp: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    condition: current.weather[0].description,
    main: current.weather[0].main,
    humidity: current.main.humidity,
    wind: Math.round((current.wind?.speed ?? 0) * 3.6),
    windDir: compass(current.wind?.deg),
    pressure: current.main.pressure,
    isNight: current.dt < current.sys?.sunrise || current.dt > current.sys?.sunset,
    sunrise: formatClock(current.sys?.sunrise, offset),
    sunset: formatClock(current.sys?.sunset, offset),
    hourly: buildHourly(list, offset),
    daily: buildDaily(list, offset),
  };
}
