import { getWeatherKey } from "../utils/weatherTheme";

function CloudGlyph() {
  return (
    <svg className="wx-cloud" viewBox="0 0 128 80" fill="currentColor" aria-hidden="true">
      <ellipse cx="46" cy="48" rx="28" ry="20" />
      <ellipse cx="74" cy="40" rx="34" ry="26" />
      <ellipse cx="100" cy="50" rx="22" ry="16" />
      <rect x="30" y="46" width="80" height="20" rx="10" />
    </svg>
  );
}

function WeatherIcon({ type, size = "lg" }) {
  const kind = getWeatherKey(type);

  return (
    <div className={`wx wx-${size} wx-${kind}`} aria-hidden="true">
      {kind === "clear" && (
        <>
          <div className="wx-rays" />
          <div className="wx-sun" />
        </>
      )}

      {kind === "clouds" && <CloudGlyph />}

      {(kind === "rain" || kind === "drizzle" || kind === "storm") && (
        <>
          <CloudGlyph />
          <div className="wx-drops">
            <span />
            <span />
            <span />
            <span />
          </div>
          {kind === "storm" && (
            <svg className="wx-bolt" viewBox="0 0 24 36">
              <path d="M14 0 L4 18 H11 L7 36 L22 14 H14 L18 0 Z" />
            </svg>
          )}
        </>
      )}

      {kind === "snow" && (
        <>
          <CloudGlyph />
          <div className="wx-flakes">
            <span />
            <span />
            <span />
          </div>
        </>
      )}

      {kind === "fog" && (
        <>
          <CloudGlyph />
          <div className="wx-mist">
            <span />
            <span />
            <span />
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherIcon;
