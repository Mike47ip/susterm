import RevealOnScroll from "./RevealOnScroll";

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <path
        d="M4 5.5c2.5-1 5-1 7 .5v13c-2-1.5-4.5-1.5-7-.5v-13Z"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 5.5c-2.5-1-5-1-7 .5v13c2-1.5 4.5-1.5 7-.5v-13Z"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.5" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.4" fill="var(--accent)" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <path
        d="M13 3 5 13.5h5.5L11 21l8-11h-5.5L13 3Z"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

const FEATURES = [
  {
    icon: BookIcon,
    title: "Grounded in real research",
    body: "Every question is pulled from the SusTerm Dictionary — 500+ real sustainability terms compiled by Study Sustainability Hub.",
  },
  {
    icon: TargetIcon,
    title: "Learn by inference",
    body: "Each question hides the term inside a real-world example, so you're reasoning your way to the answer, not just recalling a flashcard.",
  },
  {
    icon: BoltIcon,
    title: "Built for momentum",
    body: "Keyboard shortcuts and auto-advance keep the pace up — answer, learn, next question, no clicking required.",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, body }, i) => (
        <RevealOnScroll key={title} delay={i * 100}>
          <div className="h-full rounded-xl border border-line bg-surface p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Icon />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
