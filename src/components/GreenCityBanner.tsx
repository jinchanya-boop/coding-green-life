export function GreenCityBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: 200 }}>
      <svg viewBox="0 0 800 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F2721" />
            <stop offset="100%" stopColor="#173A31" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B4038" />
            <stop offset="100%" stopColor="#1B4038" />
          </linearGradient>
          <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#204A40" />
            <stop offset="100%" stopColor="#204A40" />
          </linearGradient>
        </defs>

        <rect width="800" height="200" fill="url(#sky)" />

        {/* sun glow */}
        <circle cx="670" cy="55" r="90" fill="url(#sun)" />
        <circle cx="670" cy="55" r="26" fill="#FDE68A" opacity="0.9" />

        {/* clouds */}
        <g opacity="0.5" fill="#EAF4EF">
          <ellipse cx="140" cy="45" rx="34" ry="12" />
          <ellipse cx="165" cy="38" rx="24" ry="10" />
          <ellipse cx="430" cy="30" rx="28" ry="10" />
          <ellipse cx="452" cy="24" rx="18" ry="8" />
        </g>

        {/* far hills */}
        <path d="M0 140 Q100 100 220 130 T480 120 T800 135 V200 H0 Z" fill="url(#hillFar)" opacity="0.8" />

        {/* city skyline silhouette */}
        <g fill="#0F2721">
          <rect x="60" y="105" width="26" height="70" rx="3" />
          <rect x="95" y="85" width="22" height="90" rx="3" />
          <rect x="125" y="120" width="30" height="55" rx="3" />
          <rect x="560" y="95" width="24" height="80" rx="3" />
          <rect x="592" y="115" width="30" height="60" rx="3" />
          <rect x="630" y="80" width="20" height="95" rx="3" />
          <rect x="700" y="110" width="26" height="65" rx="3" />
        </g>
        {/* lit windows */}
        <g fill="#FDE68A" opacity="0.85">
          <rect x="67" y="115" width="5" height="6" />
          <rect x="77" y="115" width="5" height="6" />
          <rect x="67" y="130" width="5" height="6" />
          <rect x="102" y="98" width="5" height="6" />
          <rect x="102" y="115" width="5" height="6" />
          <rect x="567" y="108" width="5" height="6" />
          <rect x="599" y="128" width="5" height="6" />
          <rect x="636" y="95" width="5" height="6" />
          <rect x="707" y="122" width="5" height="6" />
        </g>
        {/* green roof gardens */}
        <g fill="#4ADE80" opacity="0.85">
          <rect x="93" y="82" width="26" height="6" rx="2" />
          <rect x="628" y="77" width="24" height="6" rx="2" />
        </g>

        {/* near hills */}
        <path d="M0 165 Q120 135 260 160 T520 150 T800 165 V200 H0 Z" fill="url(#hillNear)" />

        {/* trees along the front */}
        <g>
          {[40, 90, 200, 260, 340, 470, 540, 650, 730, 770].map((x, i) => (
            <g key={i} transform={`translate(${x} ${172 + (i % 3) * 4})`}>
              <rect x="-2" y="10" width="4" height="12" fill="#0F2721" />
              <circle cx="0" cy="4" r="11" fill="#22C55E" opacity="0.9" />
              <circle cx="-6" cy="8" r="8" fill="#16A34A" opacity="0.9" />
              <circle cx="6" cy="8" r="8" fill="#16A34A" opacity="0.9" />
            </g>
          ))}
        </g>

        {/* birds */}
        <g stroke="#EAF4EF" strokeWidth="1.5" fill="none" opacity="0.6">
          <path d="M330 50 q6 -8 12 0 q6 -8 12 0" />
          <path d="M360 65 q5 -7 10 0 q5 -7 10 0" />
        </g>
      </svg>

      <div className="absolute inset-0 flex items-end p-4" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(8,21,18,0.55) 100%)' }}>
        <div>
          <p className="font-display text-2xl font-bold text-white drop-shadow">GREEN CITY</p>
        </div>
      </div>
    </div>
  )
}
