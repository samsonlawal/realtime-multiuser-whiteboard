import { useState } from 'react';

const TOOLS = [
  { id: 'select',    label: 'Select',    shortcut: 'V', icon: 'cursor' },
  { id: 'hand',      label: 'Pan',       shortcut: 'H', icon: 'hand' },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: 'rect' },
  { id: 'diamond',   label: 'Diamond',   shortcut: 'D', icon: 'diamond' },
  { id: 'circle',    label: 'Circle',    shortcut: 'C', icon: 'circle' },
  { id: 'arrow',     label: 'Arrow',     shortcut: 'A', icon: 'arrow' },
  { id: 'text',      label: 'Text',      shortcut: 'T', icon: 'text' },
];

function ToolIcon({ type }) {
  const p = {
    xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16,
    viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (type) {
    case 'cursor':
      return <svg {...p}><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="m13 13 6 6" /></svg>;
    case 'hand':
      return <svg {...p}><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>;
    case 'rect':
      return <svg {...p}><rect width="18" height="18" x="3" y="3" rx="2" /></svg>;
    case 'diamond':
      return <svg {...p}><path d="M12 2 2 12l10 10 10-10Z" /></svg>;
    case 'circle':
      return <svg {...p}><circle cx="12" cy="12" r="10" /></svg>;
    case 'arrow':
      return <svg {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
    case 'text':
      return <svg {...p}><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" x2="15" y1="20" y2="20" /><line x1="12" x2="12" y1="4" y2="20" /></svg>;
    default:
      return null;
  }
}

function ToolButton({ tool, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
          isActive
            ? 'bg-brand text-white shadow-md shadow-brand/25 scale-105'
            : 'text-muted hover:text-heading hover:bg-card-hover'
        }`}
      >
        <ToolIcon type={tool.icon} />
      </button>

      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 pointer-events-none z-50 whitespace-nowrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card border border-subtle shadow-xl text-[11px] font-medium text-heading">
            {tool.label}
            <kbd className="px-1.5 py-0.5 rounded bg-panel border border-subtle text-[10px] font-mono text-dim">
              {tool.shortcut}
            </kbd>
          </div>
          <div className="w-2 h-2 bg-card border-r border-b border-subtle rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FloatingToolbar
───────────────────────────────────────────────────────────── */
export default function FloatingToolbar({
  activeTool = 'select',
  onSelectTool = () => {},
  zoom = 100,
  onZoomIn = () => {},
  onZoomOut = () => {},
  onResetZoom = () => {},
}) {
  return (
    <nav
      aria-label="Whiteboard Drawing Tools"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 p-1.5 rounded-xl bg-panel/95 backdrop-blur-xl border border-subtle shadow-2xl select-none font-poppins"
    >
      {/* Tool buttons — icon only, tooltip on hover */}
      <div className="flex items-center gap-0.5">
        {TOOLS.map((tool) => (
          <ToolButton
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={() => onSelectTool(tool.id)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-subtle mx-1.5" />

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onZoomOut}
          className="w-7 h-7 rounded-lg hover:bg-card-hover flex items-center justify-center text-muted hover:text-heading cursor-pointer transition-colors"
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button
          onClick={onResetZoom}
          className="px-2 py-1 rounded-lg hover:bg-card-hover text-[11px] font-medium text-heading cursor-pointer transition-colors min-w-[46px] text-center font-mono"
          title="Reset Zoom"
        >
          {zoom}%
        </button>
        <button
          onClick={onZoomIn}
          className="w-7 h-7 rounded-lg hover:bg-card-hover flex items-center justify-center text-muted hover:text-heading cursor-pointer transition-colors"
          title="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
