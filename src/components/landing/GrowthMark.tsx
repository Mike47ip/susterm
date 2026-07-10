// FILE LOCATION: src/components/landing/GrowthMark.tsx (replaces existing file)

export default function GrowthMark() {
  return (
    <div className="relative mx-auto flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
      {/* frosted glass backing so the mark stays crisp over any photo */}
      <div
        className="absolute inset-0 rounded-full border border-line/70 shadow-lg"
        style={{
          background: "color-mix(in srgb, var(--surface) 82%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      />

      {/* soft glow behind the mark */}
      <div
        className="blob-pulse absolute inset-4 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 28%, transparent) 0%, transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="leafGradLeft" x1="30" y1="132" x2="100" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="leafGradRight" x1="150" y1="38" x2="100" y2="94" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="budGrad" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="1" />
          </radialGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="var(--foreground)" floodOpacity="0.14" />
          </filter>
        </defs>

        <circle cx="100" cy="100" r="92" stroke="var(--line)" strokeWidth="1" strokeOpacity="0.4" />

        {/* grounding shadow */}
        <ellipse cx="100" cy="172" rx="26" ry="4.5" fill="var(--foreground)" opacity="0.08" />

        <g filter="url(#softShadow)">
          {/* stem, draws itself in */}
          <path
            d="M100,168 C100,142 92,124 100,100 C108,76 100,52 100,28"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            className="draw-stem"
          />

          {/* left leaf, smoother teardrop with a vein */}
          <path
            d="M100,132 C74,129 49,112 41,83 C50,80 60,81 69,86 C90,98 100,113 100,132 Z"
            fill="url(#leafGradLeft)"
            className="leaf-in"
            style={{ animationDelay: "900ms" }}
          />
          <path
            d="M96,124 C82,110 66,98 46,87"
            stroke="var(--surface)"
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="leaf-in"
            style={{ animationDelay: "980ms" }}
          />

          {/* right leaf, smaller and higher */}
          <path
            d="M100,94 C121,83 138,65 143,40 C136,43 128,46 120,52 C104,64 97,79 100,94 Z"
            fill="url(#leafGradRight)"
            className="leaf-in"
            style={{ animationDelay: "1080ms" }}
          />
          <path
            d="M103,86 C114,74 125,63 138,45"
            stroke="var(--surface)"
            strokeOpacity="0.5"
            strokeWidth="1.1"
            strokeLinecap="round"
            className="leaf-in"
            style={{ animationDelay: "1160ms" }}
          />

          {/* bud */}
          <circle
            cx="100"
            cy="26"
            r="7"
            fill="url(#budGrad)"
            className="leaf-in"
            style={{ animationDelay: "1280ms" }}
          />
        </g>
      </svg>
    </div>
  );
}