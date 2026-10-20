export default function HeroDiagram() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none select-none">
      <div className="relative w-full aspect-[540/270] overflow-visible">
        <svg viewBox="0 0 540 270" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker
              id="diagram-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#52525b" />
            </marker>

            <marker
              id="diagram-arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* 1. Client -> Gateway (Vertical Down) */}
          <path
            d="M 77.5 98 L 77.5 159"
            stroke="#52525b"
            strokeWidth="1.5"
            markerEnd="url(#diagram-arrow)"
          />

          {/* 2. Gateway -> Sync Server (Elbow Curve) */}
          <path
            d="M 145 194 C 172 194, 172 133, 189 133"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4 3"
            fill="none"
            markerEnd="url(#diagram-arrow-active)"
          />

          {/* 3. Sync Server -> Redis Cache (Upper Right Branch) */}
          <path
            d="M 340 116 C 365 116, 365 69, 384 69"
            stroke="#52525b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            fill="none"
            markerEnd="url(#diagram-arrow)"
          />

          {/* 4. Sync Server -> Postgres DB (Lower Right Branch) */}
          <path
            d="M 340 150 C 365 150, 365 194, 384 194"
            stroke="#52525b"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#diagram-arrow)"
          />

          {/* Port Anchor Dots */}
          <circle cx="77.5" cy="98" r="2.5" fill="#52525b" />
          <circle cx="77.5" cy="165" r="2.5" fill="#52525b" />
          <circle cx="145" cy="194" r="2.5" fill="#3b82f6" />
          <circle cx="195" cy="133" r="2.5" fill="#3b82f6" />
          <circle cx="340" cy="116" r="2.5" fill="#52525b" />
          <circle cx="390" cy="69" r="2.5" fill="#52525b" />
          <circle cx="340" cy="150" r="2.5" fill="#52525b" />
          <circle cx="390" cy="194" r="2.5" fill="#52525b" />

          {/* Node 1: Web Client (Top Left) */}
          <foreignObject x="10" y="40" width="135" height="58">
            <div className="w-full h-full p-2.5 rounded-lg bg-card border border-subtle shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-0.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 shrink-0">
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                <span className="text-[11px] font-semibold text-heading font-poppins whitespace-nowrap">Web Client</span>
              </div>
              <span className="text-[9px] font-mono text-dim pl-[21px] whitespace-nowrap">React • Canvas UI</span>
            </div>
          </foreignObject>

          {/* Node 2: API Gateway (Bottom Left) */}
          <foreignObject x="10" y="165" width="135" height="58">
            <div className="w-full h-full p-2.5 rounded-lg bg-card border border-subtle shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-0.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 shrink-0">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="text-[11px] font-semibold text-heading font-poppins whitespace-nowrap">API Gateway</span>
              </div>
              <span className="text-[9px] font-mono text-dim pl-[21px] whitespace-nowrap">Auth • Rate Limit</span>
            </div>
          </foreignObject>

          {/* Node 3: Sync Server (Center Highlighted) */}
          <foreignObject x="195" y="101" width="145" height="64">
            <div className="w-full h-full p-2.5 rounded-lg bg-card border-2 border-brand shadow-lg ring-2 ring-brand/20 flex flex-col justify-center relative">
              <div className="flex items-center gap-2 mb-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand shrink-0">
                  <rect width="20" height="8" x="2" y="2" rx="2" />
                  <rect width="20" height="8" x="2" y="14" rx="2" />
                  <line x1="6" x2="6.01" y1="6" y2="6" />
                  <line x1="6" x2="6.01" y1="18" y2="18" />
                </svg>
                <span className="text-[11px] font-semibold text-heading font-poppins whitespace-nowrap">Sync Server</span>
              </div>
              <span className="text-[9px] font-mono text-dim pl-[22px] whitespace-nowrap">WebSocket Hub • :8080</span>
            </div>
          </foreignObject>

          {/* Node 4: Redis Cache (Top Right) */}
          <foreignObject x="390" y="40" width="140" height="58">
            <div className="w-full h-full p-2.5 rounded-lg bg-card border border-subtle shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-0.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400 shrink-0">
                  <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                  <path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.5" />
                  <path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 17.5" />
                </svg>
                <span className="text-[11px] font-semibold text-heading font-poppins whitespace-nowrap">Redis Cache</span>
              </div>
              <span className="text-[9px] font-mono text-dim pl-[21px] whitespace-nowrap">In-Memory • :6379</span>
            </div>
          </foreignObject>

          {/* Node 5: PostgreSQL Database (Bottom Right) */}
          <foreignObject x="390" y="165" width="140" height="58">
            <div className="w-full h-full p-2.5 rounded-lg bg-card border border-subtle shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-0.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 shrink-0">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                </svg>
                <span className="text-[11px] font-semibold text-heading font-poppins whitespace-nowrap">PostgreSQL DB</span>
              </div>
              <span className="text-[9px] font-mono text-dim pl-[21px] whitespace-nowrap">Canvas Store • :5432</span>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}
