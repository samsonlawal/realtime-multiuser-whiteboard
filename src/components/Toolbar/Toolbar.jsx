import Button from '../reusables/Button';
import Logo from '../reusables/Logo';

const TOOLS = [
  { id: 'select', label: 'Select', shortcut: 'V', icon: 'cursor' },
  { id: 'hand', label: 'Pan', shortcut: 'H', icon: 'hand' },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: 'rect' },
  { id: 'diamond', label: 'Decision (Diamond)', shortcut: 'D', icon: 'diamond' },
  { id: 'circle', label: 'Circle / Node', shortcut: 'C', icon: 'circle' },
  { id: 'database', label: 'Database', shortcut: 'B', icon: 'cylinder' },
  { id: 'pen', label: 'Draw (Pen)', shortcut: 'P', icon: 'pen' },
  { id: 'arrow', label: 'Connector (Arrow)', shortcut: 'A', icon: 'arrow' },
  { id: 'text', label: 'Text', shortcut: 'T', icon: 'text' },
  { id: 'eraser', label: 'Eraser', shortcut: 'E', icon: 'eraser' },
];

function ToolIcon({ type }) {
  switch (type) {
    case 'cursor':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
          <path d="m13 13 6 6"/>
        </svg>
      );
    case 'hand':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
        </svg>
      );
    case 'rect':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
        </svg>
      );
    case 'diamond':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 2 12l10 10 10-10Z"/>
        </svg>
      );
    case 'circle':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
    case 'cylinder':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M3 5v14a9 3 0 0 0 18 0V5"/>
          <path d="M3 12a9 3 0 0 0 18 0"/>
        </svg>
      );
    case 'pen':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
          <path d="M2 2l7.586 7.586"/>
        </svg>
      );
    case 'arrow':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
      );
    case 'text':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7"/>
          <line x1="9" x2="15" y1="20" y2="20"/>
          <line x1="12" x2="12" y1="4" y2="20"/>
        </svg>
      );
    case 'eraser':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
          <path d="M22 21H7"/>
          <path d="m5 11 9 9"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function Toolbar({
  activeTool = 'select',
  onSelectTool = () => {},
  onBackToHome,
}) {
  return (
    <aside className="w-16 md:w-60 border-r border-subtle bg-panel flex flex-col shrink-0 select-none z-20">
      {/* Brand & Exit Header */}
      <div className="h-14 px-3 md:px-4 border-b border-subtle flex items-center justify-between">
        <Logo size="sm" className="hidden md:inline" />

        {onBackToHome && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToHome}
            className="px-2! text-muted hover:text-heading"
            title="Return to Home"
          >
            <span className="hidden md:inline text-xs mr-1">Exit</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
          </Button>
        )}
      </div>

      {/* Tool Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="hidden md:block px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-dim">
          Elements & Tools
        </div>

        {TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-brand text-white font-medium shadow-sm'
                  : 'text-muted hover:text-heading hover:bg-card-hover'
              }`}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <div className="flex items-center gap-2.5">
                <ToolIcon type={tool.icon} />
                <span className="hidden md:inline">{tool.label}</span>
              </div>
              <kbd
                className={`hidden md:inline-block px-1.5 py-0.5 text-[10px] rounded font-mono ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-card text-dim border border-subtle'
                }`}
              >
                {tool.shortcut}
              </kbd>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-subtle text-[11px] text-dim hidden md:flex items-center justify-between">
        <span>Mode: Visual Design</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Ready" />
      </div>
    </aside>
  );
}
