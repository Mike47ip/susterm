export default function LandingBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft radial accent glow, top of hero */}
      <div
        className="absolute inset-x-0 -top-1/3 h-[140%]"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, color-mix(in srgb, var(--accent) 9%, transparent) 0%, transparent 65%)",
        }}
      />

      {/* fine dot-grid texture, fading toward the edges */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "radial-gradient(var(--line) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      {/* rolling hills, layered from farthest/faintest to nearest/deepest — each layer
          scrolls continuously (not swaying) at its own speed for real parallax wave motion.
          Each shape is duplicated once and scrolled exactly one copy-width so the loop
          is seamless — you never see it "reset". */}
      <svg
        className="absolute bottom-0 h-40 sm:h-56"
        style={{ left: 0, width: "200%" }}
        viewBox="0 0 2880 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="hillA"
            d="M0,220 C240,160 420,260 720,200 C1020,140 1220,220 1440,180 L1440,320 L0,320 Z"
          />
          <path
            id="hillB"
            d="M0,260 C260,210 480,280 760,230 C1040,180 1240,250 1440,220 L1440,320 L0,320 Z"
          />
          <path
            id="hillC"
            d="M0,290 C300,260 520,300 800,270 C1080,240 1260,290 1440,270 L1440,320 L0,320 Z"
          />
        </defs>

        <g className="wave-scroll-a" fill="var(--accent)" fillOpacity="0.06">
          <use href="#hillA" x="0" />
          <use href="#hillA" x="1440" />
        </g>
        <g className="wave-scroll-b" fill="var(--accent)" fillOpacity="0.1">
          <use href="#hillB" x="0" />
          <use href="#hillB" x="1440" />
        </g>
        <g className="wave-scroll-c" fill="var(--accent)" fillOpacity="0.16">
          <use href="#hillC" x="0" />
          <use href="#hillC" x="1440" />
        </g>
      </svg>
    </div>
  );
}
