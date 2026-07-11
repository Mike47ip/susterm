function Leaf({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M4 20c0-8.837 6-15 16-16-1 10-7.163 16-16 16Z"
        fill="var(--accent)"
        fillOpacity="0.18"
        stroke="var(--accent)"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function FloatingLeaves() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Leaf className="float-a absolute left-[8%] top-[18%]" size={26} />
      <Leaf className="float-b absolute left-[85%] top-[12%]" size={18} />
      <Leaf className="float-c absolute left-[80%] top-[70%]" size={30} />
      <Leaf className="float-a absolute left-[12%] top-[75%]" size={16} />
      <Leaf className="float-b absolute left-[50%] top-[6%]" size={14} />
    </div>
  );
}
