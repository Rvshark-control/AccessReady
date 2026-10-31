import { cn } from "@/utils/cn";

interface BooProps {
  className?: string;
  /**
   * Accessible description. Omit (or pass decorative) when nearby text already
   * says what the illustration shows.
   */
  title?: string;
  decorative?: boolean;
  /** Gentle idle animation (disabled automatically for prefers-reduced-motion). */
  animated?: boolean;
}

const INK = "#24143d";
const LINE = "#3d2566";

/**
 * Boo: AccessReady's mascot. A friendly ghost in a wheelchair, wearing a purple
 * witch hat and holding an accessibility checklist. Pure SVG, no external assets.
 */
export function Boo({
  className,
  title = "Boo, the AccessReady mascot: a friendly ghost in a wheelchair wearing a purple witch hat and holding an accessibility checklist.",
  decorative = false,
  animated = true,
}: BooProps) {
  const a11y = decorative
    ? ({ "aria-hidden": true, focusable: "false" } as const)
    : ({ role: "img", "aria-label": title } as const);

  return (
    <svg
      viewBox="0 0 360 380"
      width={360}
      height={380}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full select-none", className)}
      {...a11y}
    >
      {/* Ground shadow */}
      <ellipse cx="182" cy="364" rx="138" ry="10" fill={INK} opacity="0.16" />

      {/* Wheelchair: back frame and push handle */}
      <g fill="none" stroke={LINE} strokeLinecap="round" strokeLinejoin="round">
        <path d="M84 126 L100 130 L108 252" strokeWidth="9" />
        <path d="M70 121 L86 126" stroke={INK} strokeWidth="13" />
        {/* Front caster fork + caster */}
        <path d="M236 258 L248 330" strokeWidth="7" />
      </g>
      <circle cx="250" cy="343" r="15" fill="#fff8f0" stroke={INK} strokeWidth="7" />
      <circle cx="250" cy="343" r="4" fill="#ff8a2a" />

      {/* Seat, leg rest, footplate */}
      <g fill="none" stroke={LINE} strokeLinecap="round" strokeLinejoin="round">
        <path d="M104 252 L250 252" strokeWidth="9" />
        <path d="M244 254 L284 318" strokeWidth="8" />
        <path d="M276 322 L318 322" strokeWidth="8" />
      </g>

      {/* Ghost + hat + checklist: bobs gently */}
      <g className={cn(animated && "motion-safe:animate-bob")}>
        {/* Body */}
        <path
          d="M98 262
             C88 204 92 128 166 104
             C238 84 268 148 266 196
             C265 222 270 242 288 260
             C300 272 306 292 298 306
             C290 318 278 304 268 314
             C258 324 246 306 236 314
             C226 322 214 306 204 300
             L120 300 Z"
          fill="#ffffff"
          stroke={LINE}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Soft shading for volume */}
        <path
          d="M238 120 C262 146 262 178 258 204 C256 228 266 250 284 266 C292 276 296 288 292 298 C282 300 272 296 262 302 C256 270 246 236 248 200 C250 168 248 142 238 120 Z"
          fill="#eee7fa"
        />
        <path
          d="M118 150 C112 170 110 196 114 222"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Face */}
        <g className={cn(animated && "motion-safe:animate-blink")} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <ellipse cx="164" cy="168" rx="9" ry="12" fill={INK} />
          <ellipse cx="206" cy="166" rx="9" ry="12" fill={INK} />
          <circle cx="167.5" cy="162.5" r="3.4" fill="#ffffff" />
          <circle cx="209.5" cy="160.5" r="3.4" fill="#ffffff" />
        </g>
        <ellipse cx="146" cy="190" rx="11" ry="6.5" fill="#ff8a2a" opacity="0.42" />
        <ellipse cx="226" cy="188" rx="11" ry="6.5" fill="#ff8a2a" opacity="0.42" />
        <path d="M175 186 Q185 200 195 186 Q185 190 175 186 Z" fill={INK} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />

        {/* Witch hat */}
        <g strokeLinejoin="round" strokeLinecap="round">
          <path
            d="M120 110 C140 96 196 90 228 100 C240 104 236 114 222 116 C190 122 146 124 124 120 C112 118 112 114 120 110 Z"
            fill="#5a3c8c"
            stroke={INK}
            strokeWidth="3.5"
          />
          <path
            d="M138 108 C148 82 152 58 152 38 C152 24 142 12 124 8 C142 6 162 14 172 30 C186 52 200 80 214 104 C190 110 162 112 138 108 Z"
            fill="#6e4aa6"
            stroke={INK}
            strokeWidth="3.5"
          />
          <path d="M150 92 C154 74 158 56 158 40" fill="none" stroke="#a387d3" strokeWidth="4" opacity="0.8" />
          <path
            d="M141 98 C164 104 190 102 210 96 L205 84 C186 90 164 92 145 87 Z"
            fill="#ff8a2a"
            stroke={INK}
            strokeWidth="3"
          />
          <path
            d="M176 85.5 L178.3 90.7 L183.5 93 L178.3 95.3 L176 100.5 L173.7 95.3 L168.5 93 L173.7 90.7 Z"
            fill="#fff8f0"
          />
        </g>

        {/* Checklist */}
        <g transform="rotate(9 252 214)">
          <rect x="220" y="170" width="64" height="86" rx="9" fill="#fff8f0" stroke={INK} strokeWidth="3.5" />
          <rect x="238" y="162" width="28" height="15" rx="5" fill="#6e4aa6" stroke={INK} strokeWidth="3" />
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="229" y="188" width="12" height="12" rx="3" stroke={INK} strokeWidth="2.5" />
            <path d="M231 194 L235 198 L243 186" stroke="#ff8a2a" strokeWidth="4" />
            <path d="M248 194 L274 194" stroke="#c3b0e6" strokeWidth="4.5" />
            <rect x="229" y="209" width="12" height="12" rx="3" stroke={INK} strokeWidth="2.5" />
            <path d="M231 215 L235 219 L243 207" stroke="#ff8a2a" strokeWidth="4" />
            <path d="M248 215 L270 215" stroke="#c3b0e6" strokeWidth="4.5" />
            <rect x="229" y="230" width="12" height="12" rx="3" stroke={INK} strokeWidth="2.5" />
            <path d="M248 236 L266 236" stroke="#c3b0e6" strokeWidth="4.5" />
          </g>
        </g>
        {/* Arm holding the checklist */}
        <path
          d="M240 214 C232 206 222 206 216 214 C212 222 220 230 230 232 C238 234 246 226 240 214 Z"
          fill="#ffffff"
          stroke={LINE}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Near wheel: drawn over the ghost's lower body */}
      <g>
        <circle cx="150" cy="286" r="70" fill="none" stroke={INK} strokeWidth="12" />
        <circle cx="150" cy="286" r="61" fill="none" stroke="#a387d3" strokeWidth="3" />
        <circle cx="150" cy="286" r="54" fill="#ffffff" fillOpacity="0.08" stroke="#6e4aa6" strokeWidth="3.5" />
        <g stroke="#8462bd" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
          <path d="M150 232 L150 340" />
          <path d="M96 286 L204 286" />
          <path d="M112 248 L188 324" />
          <path d="M188 248 L112 324" />
        </g>
        <circle cx="150" cy="286" r="12" fill="#ff8a2a" stroke={INK} strokeWidth="3.5" />
        <circle cx="150" cy="286" r="3.5" fill={INK} />
      </g>

      {/* Little arm resting on the push rim */}
      <g className={cn(animated && "motion-safe:animate-bob")}>
        <path
          d="M114 214 C104 214 98 224 102 232 C106 240 118 240 124 232 C128 226 124 214 114 214 Z"
          fill="#ffffff"
          stroke={LINE}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
