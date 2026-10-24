import { useEffect, useRef, useState } from "react";
import { getWeatherKey, rainIntensity } from "../utils/weatherTheme";

const CLOUDS = [
  { top: "6%", scale: 1.05, duration: 84, delay: -18, opacity: 0.95 },
  { top: "18%", scale: 0.7, duration: 108, delay: -52, opacity: 0.78 },
  { top: "31%", scale: 1.4, duration: 126, delay: -10, opacity: 0.42 },
  { top: "1%", scale: 0.55, duration: 70, delay: -36, opacity: 0.9 },
  { top: "24%", scale: 0.92, duration: 96, delay: -74, opacity: 0.62 },
  { top: "11%", scale: 1.6, duration: 142, delay: -96, opacity: 0.32 },
];

function CloudShape() {
  return (
    <svg viewBox="0 0 160 90" fill="currentColor" aria-hidden="true">
      <ellipse cx="58" cy="54" rx="38" ry="26" />
      <ellipse cx="96" cy="46" rx="44" ry="32" />
      <ellipse cx="128" cy="58" rx="28" ry="20" />
      <rect x="38" y="52" width="104" height="26" rx="13" />
    </svg>
  );
}

function CloudLayer({ kind, wind }) {
  const count = kind === "clear" ? 3 : 6;
  const gust = 1 - Math.min(wind, 55) / 100;

  return (
    <div className={`cloud-layer cloud-layer-${kind}`}>
      {CLOUDS.slice(0, count).map((cloud, index) => (
        <div
          key={index}
          className="cloud-slot"
          style={{
            top: cloud.top,
            animationDuration: `${Math.max(28, cloud.duration * gust)}s`,
            animationDelay: `${cloud.delay}s`,
            opacity: cloud.opacity,
          }}
        >
          <div className="cloud" style={{ transform: `scale(${cloud.scale})` }}>
            <CloudShape />
          </div>
        </div>
      ))}
    </div>
  );
}

function FogBanks() {
  return (
    <div className="fog-layer">
      <div className="fog f1" />
      <div className="fog f2" />
      <div className="fog f3" />
    </div>
  );
}

function Lightning() {
  const [strike, setStrike] = useState(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    let timer = 0;
    const arm = (delay) => {
      timer = window.setTimeout(() => {
        setStrike({ id: Date.now(), left: 8 + Math.random() * 78 });
        arm(3800 + Math.random() * 5400);
      }, delay);
    };

    arm(700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="lightning-layer">
      {strike && (
        <>
          <div key={`${strike.id}-flash`} className="lightning-flash" />
          <div key={strike.id} className="lightning-strike" style={{ left: `${strike.left}%` }}>
            <svg viewBox="0 0 48 140" className="bolt-svg">
              <path d="M28 0 L10 64 H23 L12 140 L42 50 H27 L38 0 Z" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

function particleMode(kind, isNight) {
  if (kind === "rain" || kind === "drizzle" || kind === "storm" || kind === "snow") return kind;
  if (isNight) return "stars";
  if (kind === "clear" || kind === "clouds" || kind === "fog") return "motes";
  return "none";
}

function makeParticle(mode, width, height, anywhere) {
  if (mode === "snow") {
    return {
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -12,
      r: 1.1 + Math.random() * 2.6,
      speed: 0.55 + Math.random() * 1.35,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.55 + Math.random() * 0.45,
    };
  }

  if (mode === "stars") {
    return {
      x: Math.random() * width,
      y: Math.random() * height * 0.78,
      r: Math.random() > 0.92 ? 1.7 : 0.5 + Math.random() * 0.9,
      speed: 0.35 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
    };
  }

  if (mode === "motes") {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.7 + Math.random() * 1.6,
      speed: 0.12 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.12 + Math.random() * 0.28,
    };
  }

  const fine = mode === "drizzle";
  const heavy = mode === "storm";
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : -40,
    len: (fine ? 9 : 18) + Math.random() * (fine ? 10 : heavy ? 26 : 18),
    speed: (fine ? 5.5 : heavy ? 16 : 11) + Math.random() * (heavy ? 8 : 6),
    opacity: (fine ? 0.25 : 0.35) + Math.random() * 0.4,
    thick: fine ? 1 : Math.random() > 0.75 ? 1.8 : 1.25,
    near: Math.random() > 0.8,
  };
}

function WeatherAtmosphere({ condition, detail = "", wind = 0, isNight = false }) {
  const canvasRef = useRef(null);
  const kind = getWeatherKey(condition);
  const intensity = rainIntensity(detail);
  const mode = particleMode(kind, isNight);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode === "none") return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let running = true;
    let particles = [];
    let ripples = [];
    const slant = Math.max(-16, Math.min(16, wind / 2.6));

    let lastWidth = 0;
    let lastHeight = 0;

    const measure = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const base = {
        rain: 150,
        drizzle: 100,
        storm: 200,
        snow: 110,
        stars: 90,
        motes: kind === "clear" ? 36 : 18,
      }[mode];
      const count = Math.min(
        280,
        Math.round(base * intensity * Math.min(Math.max(width, 360) / 520, 2.1))
      );
      particles = Array.from({ length: count }, () => makeParticle(mode, width, height, true));
      ripples = [];
    };

    const paint = (time) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);

      if (mode === "rain" || mode === "drizzle" || mode === "storm") {
        context.lineCap = "round";
        context.strokeStyle = mode === "storm" ? "rgba(236, 242, 255, 0.8)" : "rgba(224, 242, 254, 0.72)";

        for (const drop of particles) {
          if (!reduced) {
            const speed = drop.near ? drop.speed * 1.4 : drop.speed;
            drop.y += speed;
            drop.x += slant * (drop.near ? 0.22 : 0.12);
            if (drop.y > height + drop.len) {
              if (ripples.length < 36) ripples.push({ x: drop.x, y: height - 8, r: 1.5, life: 1 });
              drop.y = -drop.len;
              drop.x = Math.random() * width;
            }
            if (drop.x > width + 30) drop.x = -20;
            if (drop.x < -30) drop.x = width + 20;
          }

          context.globalAlpha = drop.near ? Math.min(1, drop.opacity + 0.15) : drop.opacity;
          context.lineWidth = drop.near ? drop.thick + 0.7 : drop.thick;
          context.beginPath();
          context.moveTo(drop.x, drop.y);
          context.lineTo(drop.x + slant * 0.85, drop.y + drop.len);
          context.stroke();
        }

        context.lineWidth = 1;
        context.strokeStyle = "rgba(224, 242, 254, 0.55)";
        ripples = ripples.filter((ripple) => ripple.life > 0);
        for (const ripple of ripples) {
          context.globalAlpha = ripple.life * 0.5;
          context.beginPath();
          context.ellipse(ripple.x, ripple.y, ripple.r * 2.2, ripple.r * 0.7, 0, 0, Math.PI * 2);
          context.stroke();
          if (!reduced) {
            ripple.r += 0.55;
            ripple.life -= 0.02;
          }
        }
      } else if (mode === "snow") {
        for (const flake of particles) {
          if (!reduced) {
            flake.y += flake.speed;
            flake.x += Math.sin(flake.y * 0.02 + flake.phase) * 0.8 + slant * 0.05;
            if (flake.y > height + 8) {
              flake.y = -8;
              flake.x = Math.random() * width;
            }
          }
          context.globalAlpha = flake.opacity;
          context.fillStyle = "#ffffff";
          context.strokeStyle = "rgba(30, 58, 138, 0.2)";
          context.lineWidth = 0.7;
          context.beginPath();
          context.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
          context.fill();
          context.stroke();
        }
      } else if (mode === "stars") {
        for (const star of particles) {
          const twinkle = reduced
            ? 0.75
            : 0.25 + Math.abs(Math.sin(time * 0.001 * star.speed + star.phase));
          context.globalAlpha = twinkle;
          context.fillStyle = twinkle > 0.85 ? "#fef9c3" : "#f8fafc";
          context.beginPath();
          context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          context.fill();
        }
      } else {
        const warm = kind === "clear";
        for (const mote of particles) {
          if (!reduced) {
            mote.y -= mote.speed;
            mote.x += Math.sin(time * 0.00035 + mote.phase) * 0.22;
            if (mote.y < -6) {
              mote.y = height + 6;
              mote.x = Math.random() * width;
            }
          }
          context.globalAlpha = mote.opacity;
          context.fillStyle = warm ? "rgba(254, 240, 138, 0.95)" : "rgba(255,255,255,0.75)";
          context.beginPath();
          context.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.globalAlpha = 1;
    };

    const tick = (time) => {
      if (!running) return;
      paint(time);
      frame = requestAnimationFrame(tick);
    };

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);
    };

    measure();
    requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);

    if (reduced && mode !== "stars") paint(0);
    else frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", onResize);
    };
  }, [mode, wind, intensity, kind, isNight]);

  const showClouds = kind !== "fog";
  const showGlow = !isNight && (kind === "clear" || kind === "clouds");

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="sky-gradient" />
      {showGlow && <div className={`sun-glow ${kind === "clouds" ? "is-veiled" : ""}`} />}
      {isNight && kind !== "storm" && (
        <div className="moon-wrap">
          <div className="moon" />
        </div>
      )}
      {showClouds && <CloudLayer kind={kind} wind={wind} />}
      {(kind === "fog" || kind === "drizzle") && <FogBanks />}
      <canvas ref={canvasRef} className="weather-canvas" />
      {(kind === "rain" || kind === "drizzle" || kind === "storm") && <div className="ground-mist" />}
      {kind === "storm" && <Lightning />}
      <div className="vignette" />
    </div>
  );
}

export default WeatherAtmosphere;
