import { useId } from "react";

function Logo({ className = "", decorative = false }) {
  const id = useId().replace(/:/g, "");
  const sky = `${id}-sky`;
  const sun = `${id}-sun`;
  const cloud = `${id}-cloud`;

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "StratoSense"}
    >
      <defs>
        <linearGradient id={sky} x1="8" y1="4" x2="58" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="0.48" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id={sun} x1="36" y1="8" x2="54" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fffbeb" />
          <stop offset="0.45" stopColor="#fde047" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={cloud} x1="16" y1="28" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="16" fill={`url(#${sky})`} />
      <circle cx="45" cy="20" r="8.5" fill={`url(#${sun})`} />
      <g fill="none" stroke="#fef3c7" strokeWidth="2.4" strokeLinecap="round">
        <path d="M45 7.2v3.2" />
        <path d="M55.6 12.4l-2.3 2.3" />
        <path d="M58.2 20h-3.2" />
      </g>
      <path
        fill={`url(#${cloud})`}
        d="M18.5 47.5h27.2c5.2 0 9.3-3.7 9.3-8.4 0-3.7-2.4-6.8-5.8-7.9.2-.7.3-1.5.3-2.3 0-5.4-4.6-9.7-10.2-9.7-3.9 0-7.3 2.1-9 5.2-1-.4-2.1-.6-3.2-.6-5.3 0-9.6 4-9.6 9 0 .7.1 1.4.3 2-3.2.9-5.5 3.6-5.5 6.8 0 3.9 3.4 6.9 6.2 6.9z"
      />
      <path
        d="M25 40.5c3.4-4.2 8.2-4.6 11.8-1.2 2.2 2.1 4.6 2.4 7.2.4"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Logo;
