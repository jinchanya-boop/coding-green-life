function Cloud({ top, scale, duration, delay }: { top: string; scale: number; duration: number; delay: number }) {
  return (
    <div
      className="ambient-cloud absolute"
      style={{ top, left: 0, animationDuration: `${duration}s`, animationDelay: `${delay}s`, transform: `scale(${scale})` }}
    >
      <svg width="90" height="36" viewBox="0 0 90 36" fill="none">
        <ellipse cx="22" cy="22" rx="20" ry="12" fill="#EAF4EF" fillOpacity="0.08" />
        <ellipse cx="42" cy="14" rx="16" ry="10" fill="#EAF4EF" fillOpacity="0.08" />
        <ellipse cx="60" cy="20" rx="18" ry="11" fill="#EAF4EF" fillOpacity="0.08" />
      </svg>
    </div>
  )
}

function Bird({ top, duration, delay, size = 16 }: { top: string; duration: number; delay: number; size?: number }) {
  return (
    <div className="ambient-bird absolute" style={{ top, left: 0, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
      <svg width={size * 2} height={size} viewBox="0 0 32 16" fill="none">
        <path d="M2 10 Q8 0 16 8 Q24 0 30 10" stroke="#5EEAD4" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}

function Tree({ left, size, duration, delay }: { left: string; size: number; duration: number; delay: number }) {
  return (
    <div
      className="ambient-tree absolute bottom-0"
      style={{ left, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
    >
      <svg width={size} height={size * 1.5} viewBox="0 0 40 60" fill="none">
        <path
          d="M20 4 L32 26 H26 L34 42 H6 L14 26 H8 Z"
          stroke="#22C55E"
          strokeOpacity="0.18"
          strokeWidth="2"
          fill="#22C55E"
          fillOpacity="0.06"
        />
        <rect x="17" y="42" width="6" height="14" fill="#22C55E" fillOpacity="0.1" />
      </svg>
    </div>
  )
}

// Purely decorative, ambient motion behind page content: drifting clouds, birds
// flying by, and trees swaying gently in a breeze. Fixed to the viewport so it
// doesn't affect scrolling or layout, and respects prefers-reduced-motion.
export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
      <Cloud top="8%" scale={1.1} duration={48} delay={0} />
      <Cloud top="18%" scale={0.8} duration={62} delay={-20} />
      <Cloud top="4%" scale={0.6} duration={55} delay={-38} />
      <Bird top="14%" duration={22} delay={0} />
      <Bird top="22%" duration={28} delay={-10} size={12} />
      <Bird top="10%" duration={26} delay={-18} size={13} />
      <Tree left="4%" size={70} duration={4.5} delay={0} />
      <Tree left="88%" size={90} duration={5.2} delay={-1.5} />
      <Tree left="94%" size={55} duration={3.8} delay={-2.5} />
    </div>
  )
}
