const COLOR_PALETTE = [
  { name: 'White', hex: '#f4f4f5' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Purple', hex: '#a855f7' },
];

const STROKE_WIDTHS = [
  { id: 'thin', label: 'Thin', value: 2 },
  { id: 'medium', label: 'Medium', value: 4 },
  { id: 'bold', label: 'Bold', value: 8 },
];

const STROKE_STYLES = [
  { id: 'solid', label: 'Solid' },
  { id: 'dashed', label: 'Dashed' },
  { id: 'dotted', label: 'Dotted' },
];

interface PropertiesPanelProps {
  selectedColor?: string;
  onSelectColor?: (color: string) => void;
  strokeWidth?: number;
  onSelectStrokeWidth?: (width: number) => void;
  strokeStyle?: string;
  onSelectStrokeStyle?: (style: string) => void;
  fill?: string;
  onSelectFill?: (fill: string) => void;
}

export default function PropertiesPanel({
  selectedColor = '#f4f4f5',
  onSelectColor = () => {},
  strokeWidth = 2,
  onSelectStrokeWidth = () => {},
  strokeStyle = 'solid',
  onSelectStrokeStyle = () => {},
  fill = 'transparent',
  onSelectFill = () => {},
}: PropertiesPanelProps) {
  return (
    <aside className="w-64 border-l border-subtle bg-panel flex flex-col shrink-0 select-none z-20 font-poppins">
      {/* Header */}
      <div className="h-10 px-4 border-b border-subtle flex items-center justify-between">
        <span className="font-semibold text-[10px] tracking-wider uppercase text-dim">
          Inspector & Styling
        </span>
        <span className="text-[10px] text-muted font-mono">2D Vector</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 1. Stroke Color */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-heading">Stroke Color</label>
            <span className="text-[11px] font-mono text-dim">{selectedColor}</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PALETTE.map((c) => {
              const isSelected = selectedColor === c.hex;
              return (
                <button
                  key={c.hex}
                  onClick={() => onSelectColor(c.hex)}
                  className={`w-7 h-7 rounded-md cursor-pointer transition-transform flex items-center justify-center border ${
                    isSelected
                      ? 'scale-110 border-white ring-2 ring-brand ring-offset-2 ring-offset-panel'
                      : 'border-subtle hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {isSelected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: c.hex === '#f4f4f5' ? '#111' : '#fff' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Stroke Width */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-heading block">Stroke Width</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-card rounded-lg border border-subtle">
            {STROKE_WIDTHS.map((w) => {
              const isSelected = strokeWidth === w.value;
              return (
                <button
                  key={w.id}
                  onClick={() => onSelectStrokeWidth(w.value)}
                  className={`py-1.5 text-xs rounded-md transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-panel text-heading font-medium shadow-sm border border-subtle'
                      : 'text-dim hover:text-muted'
                  }`}
                >
                  <span
                    className="w-6 rounded-full bg-current"
                    style={{ height: `${w.value}px` }}
                  />
                  <span className="text-[10px]">{w.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Stroke Style */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-heading block">Stroke Style</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-card rounded-lg border border-subtle">
            {STROKE_STYLES.map((s) => {
              const isSelected = strokeStyle === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectStrokeStyle(s.id)}
                  className={`py-1 text-xs rounded-md transition-colors cursor-pointer text-center ${
                    isSelected
                      ? 'bg-panel text-heading font-medium shadow-sm border border-subtle'
                      : 'text-dim hover:text-muted'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Fill Option */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-heading block">Background Fill</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-card rounded-lg border border-subtle">
            {['transparent', 'subtle', 'solid'].map((f) => {
              const isSelected = fill === f;
              return (
                <button
                  key={f}
                  onClick={() => onSelectFill(f)}
                  className={`py-1 text-xs capitalize rounded-md transition-colors cursor-pointer text-center ${
                    isSelected
                      ? 'bg-panel text-heading font-medium shadow-sm border border-subtle'
                      : 'text-dim hover:text-muted'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Shortcuts & Info */}
        <div className="pt-3 border-t border-subtle space-y-2 text-xs text-dim">
          <span className="text-[10px] font-semibold uppercase tracking-wider block">Quick Keys</span>
          <div className="flex items-center justify-between">
            <span>Pan Board</span>
            <kbd className="font-mono text-[10px] px-1 bg-card border border-subtle rounded">Space + Drag</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Zoom</span>
            <kbd className="font-mono text-[10px] px-1 bg-card border border-subtle rounded">Ctrl + Scroll</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Delete Selected</span>
            <kbd className="font-mono text-[10px] px-1 bg-card border border-subtle rounded">Backspace</kbd>
          </div>
        </div>
      </div>
    </aside>
  );
}
