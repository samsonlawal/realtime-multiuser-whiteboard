const ARCHITECTURE_CARDS = [
  {
    id: 'dual-layer',
    icon: (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-turtle preview-icon"><path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z"/><path d="M4.82 7.9 8 10"/><path d="M15.18 7.9 12 10"/><path d="M16.93 10H20a2 2 0 0 1 0 4H2"/></svg>
    ),
    category: 'Rendering',
    title: 'Dual-Layer Canvas',
    spec: 'HTML5 2D • requestAnimationFrame',
    description:
      'Active strokes render imperatively on a transparent top canvas layer. When the stroke finishes, it commits to the static bottom buffer without re-drawing history.',
  },
  {
    id: 'presence',
    icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round-collaboration preview-icon"><path d="M20.453 8.911a9 9 0 00-6.696-5.738"/><path d="M21 22a4 4 0 00-8 0"/><path d="M3 12a4 4 0 017.963-.543"/><path d="M3.889 15.9a9 9 0 005.247 4.632"/><circle cx="17" cy="15" r="3"/><circle cx="7" cy="5" r="3"/></svg>
    ),
    category: 'Presence',
    title: 'Live Peer Cursors',
    spec: 'WebSocket • 30Hz Coordinate Stream',
    description:
      'Pointer coordinates are throttled to 30Hz and broadcast over WebSockets. Smooth client-side interpolation prevents jitter and keeps network payload minimal.',
  },
  {
    id: 'vector-model',
    icon: (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-vector-polygon preview-icon"><path d="m12.828 4.813 5.344 2.375"/><path d="m15.769 18.153 3.461-8.306"/><path d="m5.687 14.074 7.625 4.852"/><path d="M9.772 5.579 5.228 11.42"/><circle cx="11" cy="4" r="2"/><circle cx="15" cy="20" r="2"/><circle cx="20" cy="8" r="2"/><circle cx="4" cy="13" r="2"/></svg>
    ),
    category: 'Data Model',
    title: 'Vector Point History',
    spec: 'Lossless Vectors • Array<Point>',
    description:
      'Drawings are stored as arrays of mathematical coordinate tuples rather than raster image bitmaps, guaranteeing infinite resolution and compact network payloads.',
  },
  {
    id: 'bezier',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18c3-9 9 9 18-9" />
        <circle cx="3" cy="18" r="1.5" />
        <circle cx="21" cy="9" r="1.5" />
      </svg>
    ),
    category: 'Geometry',
    title: 'Bézier Path Smoothing',
    spec: 'Quadratic Bézier • Dynamic Tension',
    description:
      'Fast mouse movement produces jagged polygonal points. Midpoints between raw coordinates are calculated dynamically using quadratic Bézier curves to create natural lines.',
  },
  {
    id: 'undo-redo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gamepad-directional preview-icon"><path d="M11.146 15.854a1.207 1.207 0 0 1 1.708 0l1.56 1.56A2 2 0 0 1 15 18.828V21a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.172a2 2 0 0 1 .586-1.414z"/><path d="M18.828 15a2 2 0 0 1-1.414-.586l-1.56-1.56a1.207 1.207 0 0 1 0-1.708l1.56-1.56A2 2 0 0 1 18.828 9H21a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"/><path d="M6.586 14.414A2 2 0 0 1 5.172 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.172a2 2 0 0 1 1.414.586l1.56 1.56a1.207 1.207 0 0 1 0 1.708z"/><path d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.172a2 2 0 0 1-.586 1.414l-1.56 1.56a1.207 1.207 0 0 1-1.708 0l-1.56-1.56A2 2 0 0 1 9 5.172z"/></svg>
    ),
    category: 'State Engine',
    title: 'User-Scoped Undo / Redo',
    spec: 'User-Filtered History Stack',
    description:
      'Strokes maintain user origin metadata. Pressing Ctrl+Z undoes only your own latest stroke without erasing drawings contributed by other collaborators in the room.',
  },
  {
    id: 'catch-up',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud preview-icon"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
    ),
    category: 'Sync Engine',
    title: 'State Catch-Up Sync',
    spec: 'Compressed Snapshot • Event Replay',
    description:
      'When a user joins a room that has been active for hours, the server delivers a compressed historical snapshot of active strokes before opening the live event stream.',
  },
];

export default function ArchitectureCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 w-full bg-canvas">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-2xl sm:text-3xl font-semibold text-heading tracking-tight mb-3 font-display">
          System Architecture & Primitives
        </h2>
        <p className="text-base text-muted leading-relaxed font-body">
          The core engineering layers powering canvas rendering, event synchronization, and multiplayer collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ARCHITECTURE_CARDS.map((card) => (
          <div
            key={card.id}
            className="min-h-[280px] p-5 rounded-xl bg-card border border-subtle hover:border-subtle-hover hover:bg-card-hover flex flex-col transition-all duration-200 hover:-translate-y-1 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 flex items-center justify-center text-heading">
                {card.icon}
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded text-dim bg-panel border border-subtle">
                {card.category}
              </span>
            </div>

            <h3 className="text-base font-semibold text-heading mb-1 font-display tracking-tight leading-snug">
              {card.title}
            </h3>

            <div className="text-[11px] font-mono font-medium text-dim mb-3">
              {card.spec}
            </div>

            <p className="text-xs text-muted leading-relaxed font-body mt-auto">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
