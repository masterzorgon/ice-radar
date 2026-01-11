'use client';

interface RadarLogoProps {
  size?: number;
  className?: string;
}

export default function RadarLogo({ size = 32, className = '' }: RadarLogoProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className={`drop-shadow-[0_0_8px_#00ff00] ${className}`}
      style={{ backgroundColor: 'transparent' }}
    >
      <defs>
        <style>
          {`
            .radar-stroke {
              fill: none;
              stroke: #00ff00;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .radar-fill {
              fill: #00ff00;
            }
          `}
        </style>
        {/* Clip path to contain the sweep within the radar circle */}
        {/* <clipPath id="radar-clip">
          <circle cx="40" cy="40" r="28" />
        </clipPath> */}
      </defs>

      {/* Radar display */}
      <g transform="translate(40, 40)">
        {/* Outer frame/bezel */}
        <rect
          x="-36"
          y="-36"
          width="72"
          height="72"
          rx="4"
          ry="4"
          strokeWidth="2"
          className="radar-stroke"
        />

        {/* Concentric radar circles */}
        <circle cx="0" cy="0" r="28" strokeWidth="1.5" strokeOpacity="0.3" className="radar-stroke" />
        <circle cx="0" cy="0" r="20" strokeWidth="1.5" strokeOpacity="0.4" className="radar-stroke" />
        <circle cx="0" cy="0" r="12" strokeWidth="1.5" strokeOpacity="0.5" className="radar-stroke" />
        <circle cx="0" cy="0" r="4" strokeWidth="1.5" strokeOpacity="0.6" className="radar-stroke" />

        {/* Cross-hairs / grid lines */}
        <line x1="0" y1="-30" x2="0" y2="30" strokeWidth="1" strokeOpacity="0.2" className="radar-stroke" />
        <line x1="-30" y1="0" x2="30" y2="0" strokeWidth="1" strokeOpacity="0.2" className="radar-stroke" />
        <line x1="-21" y1="-21" x2="21" y2="21" strokeWidth="1" strokeOpacity="0.15" className="radar-stroke" />
        <line x1="21" y1="-21" x2="-21" y2="21" strokeWidth="1" strokeOpacity="0.15" className="radar-stroke" />
      </g>

      {/* Animated sweep group - clipped to radar circle */}
      <g clipPath="url(#radar-clip)">
        <g transform="translate(40, 40)" className="animate-radar-sweep translate-x-1/2 translate-y-1/2" style={{ transformOrigin: '0px 0px' }}>
          {/* Sweep glow/trail effect */}
          {/* Radar sweep line */}
          <path
            d="M0,0 L0,-28 A28,28 0 0,1 19.8,-19.8 Z"
            fill="#00ff00"
            fillOpacity="0.15"
          />
          <path
            d="M0,0 L0,-28 A28,28 0 0,1 9.7,-26.3 Z"
            fill="#00ff00"
            fillOpacity="0.25"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-28"
            strokeWidth="2"
            strokeOpacity="0.9"
            className="radar-stroke"
          />
        </g>
      </g>

      {/* Center dot and blips - back in main group */}
      <g transform="translate(40, 40)">
        {/* Center dot */}
        <circle cx="0" cy="0" r="2" className="radar-fill" />

        {/* Animated blip markers */}
        <circle
          cx="10"
          cy="-8"
          r="2.5"
          className="radar-fill animate-radar-blip-1"
        />
        <circle
          cx="-15"
          cy="12"
          r="2"
          className="radar-fill animate-radar-blip-2"
        /> 
        <circle
          cx="18"
          cy="5"
          r="1.5"
          className="radar-fill animate-radar-blip-3"
        />
      </g>
    </svg>
  );
}