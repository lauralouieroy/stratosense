import { getCrowd, Person } from "./WeatherPeople";

const SKINS = ["#f4c7a2", "#b7774d", "#e0ac84"];
const HAIR = ["#3f2a1d", "#1c1917", "#4a3728"];

const BLOCKS = [
  { type: "tree" },
  { type: "house", tall: false },
  { type: "house", tall: true },
  { type: "tree" },
  { type: "house", tall: false },
  { type: "house", tall: true },
  { type: "tree" },
  { type: "house", tall: false },
];

const WALKS = [
  { time: "18s", delay: "-3s", reverse: false },
  { time: "27s", delay: "-16s", reverse: true },
  { time: "22s", delay: "-9s", reverse: false },
];

function House({ tall }) {
  return (
    <div className={`house${tall ? " is-tall" : ""}`}>
      <div className="roof" />
      <div className="facade">
        <span className="window" />
        <span className="window" />
        <span className="window" />
        <span className="window" />
      </div>
    </div>
  );
}

function Tree() {
  return (
    <div className="tree">
      <div className="canopy" />
      <div className="trunk" />
    </div>
  );
}

function Neighborhood({
  condition,
  isNight = false,
  wind = 0,
  temp = 20,
  compact = false,
  className = "",
}) {
  const { kind, looks, lean } = getCrowd(condition, isNight, temp, wind);

  return (
    <div
      className={`neighborhood neighborhood-${kind}${isNight ? " is-night" : ""}${compact ? " is-compact" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="skyline">
        {BLOCKS.map((block, index) => (
          block.type === "tree"
            ? <Tree key={index} />
            : <House key={index} tall={block.tall} />
        ))}
      </div>

      <div className="sidewalk" />

      <div className="walkers">
        {looks.map((look, index) => {
          const walk = WALKS[index];
          return (
            <div
              key={`${kind}-${index}`}
              className={`walker${walk.reverse ? " is-return" : ""}`}
              style={{
                "--walk-time": walk.time,
                "--walk-delay": walk.delay,
              }}
            >
              <Person
                look={look}
                skin={SKINS[index]}
                hair={HAIR[index]}
                mirror={walk.reverse}
                delay={`${index * 0.35}s`}
                lean={lean}
              />
            </div>
          );
        })}
      </div>

      <div className="street">
        <span className="puddle" />
        <span className="puddle puddle-2" />
      </div>
    </div>
  );
}

export default Neighborhood;
