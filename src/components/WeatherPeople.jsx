import { getWeatherKey } from "../utils/weatherTheme";

const SKINS = ["#f4c7a2", "#b7774d"];
const HAIR = ["#3f2a1d", "#1c1917"];

const RAIN = [
  { hat: "cap", umbrella: true, coat: "#2563eb", accent: "#facc15", pants: "#1e293b", boots: "#0f172a" },
  { hat: "hood", umbrella: true, coat: "#0284c7", accent: "#e0f2fe", pants: "#334155", boots: "#1e3a8a" },
];

const STORM = [
  { hat: "hood", umbrella: true, gust: true, coat: "#1e3a8a", accent: "#f8fafc", pants: "#0f172a", boots: "#020617" },
  { hat: "cap", umbrella: true, gust: true, coat: "#334155", accent: "#fde047", pants: "#1e293b", boots: "#0f172a" },
];

const SNOW = [
  { hat: "beanie", scarf: true, coat: "#e11d48", accent: "#fecdd3", pants: "#1e293b", boots: "#44403c" },
  { hat: "hood", scarf: true, coat: "#7c3aed", accent: "#ddd6fe", pants: "#312e81", boots: "#1e1b4b" },
];

const SUN = [
  { hat: "sun", shades: true, sleeves: "short", coat: "#f97316", accent: "#fde047", pants: "#2563eb", boots: "#f8fafc" },
  { hat: "cap", shades: true, sleeves: "short", coat: "#22c55e", accent: "#facc15", pants: "#0f172a", boots: "#f8fafc" },
];

const CLOUD = [
  { hat: "cap", coat: "#475569", accent: "#e2e8f0", pants: "#1e293b", boots: "#0f172a" },
  { hat: "none", coat: "#0284c7", accent: "#bae6fd", pants: "#334155", boots: "#1e293b" },
];

const FOG = [
  { hat: "hood", scarf: true, coat: "#475569", accent: "#e2e8f0", pants: "#1e293b", boots: "#0f172a" },
  { hat: "beanie", scarf: true, coat: "#64748b", accent: "#cbd5e1", pants: "#334155", boots: "#1e293b" },
];

const NIGHT = [
  { hat: "beanie", coat: "#1e293b", accent: "#38bdf8", pants: "#020617", boots: "#020617" },
  { hat: "hood", coat: "#312e81", accent: "#c4b5fd", pants: "#1e1b4b", boots: "#020617" },
];

function outfitsFor(kind, isNight, temp) {
  if (kind === "storm") return STORM;
  if (kind === "rain" || kind === "drizzle") return RAIN;
  if (kind === "snow" || temp <= 2) return SNOW;
  if (kind === "fog") return FOG;
  if (isNight) return NIGHT;
  if (kind === "clear" && temp >= 22) return SUN;
  return CLOUD;
}

function Legs({ look, skin, side }) {
  const short = look.sleeves === "short";
  const hipX = side === "a" ? 66 : 90;
  const footX = side === "a" ? 60 : 98;
  const boot = side === "a" ? "M48 158h22l1 8H46z" : "M86 158h22l3 8H84z";

  return (
    <g className={`person-leg person-leg-${side}`}>
      {short ? (
        <>
          <path
            d={`M${hipX} 118 L${hipX + (side === "a" ? -2 : 3)} 136`}
            stroke={look.pants}
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d={`M${hipX + (side === "a" ? -2 : 3)} 134 L${footX} 158`}
            stroke={skin}
            strokeWidth="10"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d={`M${hipX} 118 L${footX} 158`}
          stroke={look.pants}
          strokeWidth="12"
          strokeLinecap="round"
        />
      )}
      <path d={boot} fill={look.boots} />
      {short && (
        <path
          d={side === "a" ? "M50 162h14" : "M90 162h14"}
          stroke={look.accent}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

export function getCrowd(condition, isNight, temp = 20, wind = 0) {
  const kind = getWeatherKey(condition);
  const pair = outfitsFor(kind, isNight, temp);
  const third = {
    ...pair[1],
    hat: pair[0].hat,
    sleeves: pair[0].sleeves,
    shades: pair[0].shades,
  };

  return {
    kind,
    lean: kind === "storm" ? 8 : Math.min(wind, 36) / 10,
    looks: [pair[0], pair[1], third],
  };
}

export function Person({ look, skin, hair, mirror, delay, lean }) {
  const arm = look.sleeves === "short" ? skin : look.coat;

  return (
    <div className="person-slot" style={{ transform: `rotate(${lean}deg)` }}>
      <div className="person-bob" style={{ animationDelay: delay }}>
        <svg
          className={`person${mirror ? " is-mirror" : ""}`}
          viewBox="0 0 168 188"
          aria-hidden="true"
        >
          <ellipse cx="78" cy="178" rx="30" ry="5.5" fill="rgba(15,23,42,0.28)" />

          {look.umbrella && (
            <g className={`person-umbrella${look.gust ? " is-gust" : ""}`}>
              <path d="M86 44c12-28 56-28 66 0-16-8-50-8-66 0z" fill={look.accent} />
              <path d="M119 20v24" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
              <path d="M103 28v16M135 28v16" stroke="rgba(15,23,42,0.2)" strokeWidth="1.6" />
              <path d="M119 44v54" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M119 98c7 6 7 12 0 15" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
            </g>
          )}

          <Legs look={look} skin={skin} side="a" />
          <Legs look={look} skin={skin} side="b" />

          <path
            d="M62 90c-16 8-16 28-6 38"
            fill="none"
            stroke={arm}
            strokeWidth="9"
            strokeLinecap="round"
          />

          <path d="M56 82c10-14 40-14 50 0l8 40c-18 14-48 14-66 0z" fill={look.coat} />
          <path d="M80 90v22" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" />

          <path
            d={look.umbrella ? "M98 90c14-8 24 2 24 18" : "M98 90c14 8 12 26 2 34"}
            fill="none"
            stroke={arm}
            strokeWidth="9"
            strokeLinecap="round"
          />

          {look.hat === "hood" && (
            <path d="M50 72c0-40 60-40 60 0-8-18-52-18-60 0z" fill={look.coat} />
          )}

          <path d="M56 64c2-22 46-24 50 2-10-12-40-12-50-2z" fill={hair} />
          <circle cx="80" cy="64" r="17" fill={skin} />

          {look.shades ? (
            <g>
              <rect x="66" y="60" width="12" height="7" rx="2" fill="#0f172a" />
              <rect x="82" y="60" width="12" height="7" rx="2" fill="#0f172a" />
              <path d="M78 63h4" stroke="#0f172a" strokeWidth="1.6" />
            </g>
          ) : (
            <g fill="#1c1917">
              <circle cx="74" cy="62" r="1.7" />
              <circle cx="87" cy="62" r="1.7" />
            </g>
          )}
          <path d="M73 72c3.2 3.2 11 3.2 14.2 0" fill="none" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round" />

          {look.scarf && (
            <>
              <path d="M58 80c16 12 32 6 44-4" fill="none" stroke={look.accent} strokeWidth="7" strokeLinecap="round" />
              <path className="person-scarf-tail" d="M98 80c8 16 2 34-4 42" fill="none" stroke={look.accent} strokeWidth="6" strokeLinecap="round" />
            </>
          )}

          {look.hat === "cap" && (
            <g fill={look.accent}>
              <path d="M62 56c4-18 34-18 38 0-12-7-26-7-38 0z" />
              <path d="M96 54l26 6-24 6z" />
            </g>
          )}
          {look.hat === "beanie" && (
            <g fill={look.accent}>
              <path d="M62 56c4-22 34-22 38 0-12-8-26-8-38 0z" />
              <circle cx="80" cy="34" r="5" />
            </g>
          )}
          {look.hat === "sun" && (
            <g fill="#f59e0b">
              <ellipse cx="80" cy="52" rx="32" ry="6.5" />
              <path d="M66 52c2-18 26-18 28 0z" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

function WeatherPeople({ condition, isNight, wind = 0, temp = 20 }) {
  const { kind, looks, lean } = getCrowd(condition, isNight, temp, wind);

  return (
    <div className={`weather-people people-${kind}`} aria-hidden="true">
      {looks.map((look, index) => (
        <Person
          key={`${kind}-${index}`}
          look={look}
          skin={SKINS[index]}
          hair={HAIR[index]}
          mirror={index === 1}
          delay={`${index * 0.4}s`}
          lean={index === 0 ? lean : lean}
        />
      ))}
    </div>
  );
}

export default WeatherPeople;
