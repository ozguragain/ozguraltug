"use client";

const WAVES = [
  {
    d: "M 0 45 C 35 28, 75 62, 110 42 C 145 22, 175 58, 200 48",
    opacity: 0.25,
    delay: 0,
    hoverY: -4,
  },
  {
    d: "M 0 100 C 45 78, 85 118, 130 95 C 160 80, 185 108, 200 98",
    opacity: 0.42,
    delay: 150,
    hoverY: 4,
  },
  {
    d: "M 0 158 C 30 138, 95 172, 140 150 C 170 136, 192 165, 200 155",
    opacity: 0.60,
    delay: 300,
    hoverY: -3,
  },
  {
    d: "M 0 218 C 55 195, 100 235, 145 210 C 175 195, 195 225, 200 215",
    opacity: 0.82,
    delay: 450,
    hoverY: 5,
  },
];

export function BezierWaves() {
  return (
    <svg
      className="bezier-waves"
      viewBox="0 0 200 260"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {WAVES.map((wave, i) => (
        <path
          key={i}
          d={wave.d}
          className="bezier-wave"
          style={{
            ["--wave-opacity" as string]: wave.opacity,
            ["--wave-hover-y" as string]: `${wave.hoverY}px`,
            animationDelay: `${wave.delay}ms`,
          }}
        />
      ))}
    </svg>
  );
}