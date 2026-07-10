"use client";

import { useEffect, useState } from "react";

const CONFETTI_COLORS = ["#4F46E5", "#0F8A5F", "#D97706", "#D64545", "#16213E"];

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
};

function ConfettiBurst({ count }: { count: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Client-only randomized confetti generated post-mount, intentionally,
    // to avoid SSR/hydration mismatches from Math.random().
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 250,
        duration: 1400 + Math.random() * 900,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
      }))
    );
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-visible">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function ScoreReveal({ score, total }: { score: number; total: number }) {
  const percent = Math.round((score / total) * 100);
  const [displayScore, setDisplayScore] = useState(0);
  const celebrate = percent >= 70;

  useEffect(() => {
    if (score === 0) return;
    const duration = 600;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    }
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative">
      {celebrate && <ConfettiBurst count={40} />}
      <div className="score-reveal flex items-end gap-4 rounded-lg border border-line bg-surface p-6">
        <span className="tabnum text-5xl font-semibold text-foreground">
          {displayScore}/{total}
        </span>
        <span className="tabnum mb-1 text-lg text-muted">{percent}%</span>
      </div>
      {celebrate && (
        <p className="score-reveal mt-3 text-sm font-medium text-correct">
          Nice — that&apos;s a strong score.
        </p>
      )}
    </div>
  );
}
