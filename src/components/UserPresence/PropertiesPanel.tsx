import { useState } from 'react';
import type { NodeEntity, ConnectionEntity } from '../../types/whiteboard';

const COLOR_PALETTE = [
  { name: 'White', hex: '#f4f4f5' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Purple', hex: '#a855f7' },
];

const STROKE_WIDTHS = [
  { id: 'thin', label: 'Thin', value: 2, barHeight: 1.5 },
  { id: 'medium', label: 'Medium', value: 4, barHeight: 3 },
  { id: 'bold', label: 'Bold', value: 8, barHeight: 4.5 },
];

const STROKE_STYLES = [
  { id: 'solid' as const, label: 'Solid', dash: undefined },
  { id: 'dashed' as const, label: 'Dashed', dash: '5 3' },
  { id: 'dotted' as const, label: 'Dotted', dash: '1.5 3' },
];

const FILL_OPTIONS = [
  { id: 'transparent' as const, label: 'None' },
  { id: 'subtle' as const, label: 'Tint' },
  { id: 'solid' as const, label: 'Solid' },
];

const DIRECTION_OPTIONS = [
  { id: 'unidirectional' as const, label: 'One-way' },
  { id: 'bidirectional' as const, label: 'Two-way' },
];

const SHORTCUTS = [
  { label: 'Pan Board', keys: 'Space + Drag' },
  { label: 'Zoom', keys: 'Ctrl + Scroll' },
  { label: 'Duplicate', keys: 'Ctrl + D' },
  { label: 'Delete Selected', keys: 'Backspace' },
];

interface PropertiesPanelProps {
  selectedNode?: NodeEntity | null;
  selectedConnection?: ConnectionEntity | null;
  onUpdateNode?: (nodeId: string, updates: Partial<NodeEntity>) => void;
  onUpdateConnection?: (edgeId: string, updates: Partial<ConnectionEntity>) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDeleteConnection?: (edgeId: string) => void;
}

/** Toggleable circular `?` button in the bottom-right corner displaying canvas shortcuts. */
function QuickKeysToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-20 select-none font-poppins">
      {isOpen && (
        <div className="absolute bottom-10 right-0 w-56 rounded-xl border border-subtle bg-panel/95 backdrop-blur-md shadow-2xl p-3 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-subtle/70">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-dim">
              Shortcuts
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-dim hover:text-heading text-xs leading-none cursor-pointer"
              title="Close"
            >
              ×
            </button>
          </div>
          <div className="space-y-1.5 text-[11px] text-muted">
            {SHORTCUTS.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-2">
                <span>{item.label}</span>
                <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-card border border-subtle rounded text-dim">
                  {item.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="Keyboard shortcuts"
        className={`w-8 h-8 rounded-full border backdrop-blur-md shadow-lg flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${
          isOpen
            ? 'bg-card-hover border-subtle-hover text-heading'
            : 'bg-panel/90 border-subtle text-muted hover:text-heading hover:bg-card'
        }`}
      >
        ?
      </button>
    </div>
  );
}

export default function PropertiesPanel({
  selectedNode = null,
  selectedConnection = null,
  onUpdateNode = () => {},
  onUpdateConnection = () => {},
  onDuplicateNode = () => {},
  onDeleteNode = () => {},
  onDeleteConnection = () => {},
}: PropertiesPanelProps) {
  if (!selectedNode && !selectedConnection) {
    return <QuickKeysToggle />;
  }

  const activeColor = selectedNode?.color ?? selectedConnection?.color ?? '#3b82f6';
  const strokeWidth = selectedNode?.strokeWidth ?? selectedConnection?.strokeWidth ?? 2;
  const strokeStyle = selectedNode?.strokeStyle ?? selectedConnection?.style ?? 'solid';
  const fill = selectedNode?.fill ?? 'transparent';
  const direction = selectedConnection?.direction ?? 'unidirectional';
  const opacity = selectedNode?.opacity ?? selectedConnection?.opacity ?? 100;

  const tileClass = (isSelected: boolean) =>
    `h-8 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
      isSelected
        ? 'bg-brand/15 border-brand/60 text-heading'
        : 'bg-card border-subtle text-muted hover:bg-card-hover hover:border-subtle-hover hover:text-heading'
    }`;

  return (
    <>
      <aside className="absolute top-16 right-4 w-56 max-h-[calc(100vh-6rem)] rounded-xl border border-subtle bg-panel/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col select-none z-20 font-poppins">
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-5">
          {/* 1. Stroke Color */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-muted">Stroke</label>
              <span className="text-[10px] font-mono text-dim">{activeColor}</span>
            </div>
            <div className="flex items-center justify-between gap-1.5">
              {COLOR_PALETTE.map((c) => {
                const isSelected = activeColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    onClick={() =>
                      selectedNode
                        ? onUpdateNode(selectedNode.id, { color: c.hex })
                        : selectedConnection && onUpdateConnection(selectedConnection.id, { color: c.hex })
                    }
                    className={`w-6 h-6 rounded-md cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-white/80 ring-1 ring-white/50 ring-offset-2 ring-offset-panel scale-105'
                        : 'border-white/10 hover:scale-105 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>

          {/* 2. Stroke Width */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-muted block">Stroke width</label>
            <div className="grid grid-cols-3 gap-2">
              {STROKE_WIDTHS.map((w) => (
                <button
                  key={w.id}
                  onClick={() =>
                    selectedNode
                      ? onUpdateNode(selectedNode.id, { strokeWidth: w.value })
                      : selectedConnection && onUpdateConnection(selectedConnection.id, { strokeWidth: w.value })
                  }
                  title={w.label}
                  className={tileClass(strokeWidth === w.value)}
                >
                  <span
                    className="w-5 rounded-full bg-current"
                    style={{ height: `${w.barHeight}px` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 3. Stroke Style */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-muted block">Stroke style</label>
            <div className="grid grid-cols-3 gap-2">
              {STROKE_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    selectedNode
                      ? onUpdateNode(selectedNode.id, { strokeStyle: s.id })
                      : selectedConnection && onUpdateConnection(selectedConnection.id, { style: s.id })
                  }
                  title={s.label}
                  className={tileClass(strokeStyle === s.id)}
                >
                  <svg width="20" height="6" viewBox="0 0 20 6" className="stroke-current">
                    <line
                      x1="1"
                      y1="3"
                      x2="19"
                      y2="3"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeDasharray={s.dash}
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Background Fill (Nodes only) */}
          {selectedNode && (
            <div className="space-y-2.5">
              <label className="text-[11px] font-medium text-muted block">Background</label>
              <div className="grid grid-cols-3 gap-2">
                {FILL_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onUpdateNode(selectedNode.id, { fill: f.id })}
                    className={`${tileClass(fill === f.id)} text-[11px] font-medium`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Arrowheads (Connections only) */}
          {selectedConnection && (
            <div className="space-y-2.5">
              <label className="text-[11px] font-medium text-muted block">Arrowheads</label>
              <div className="grid grid-cols-2 gap-2">
                {DIRECTION_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onUpdateConnection(selectedConnection.id, { direction: d.id })}
                    title={d.label}
                    className={`${tileClass(direction === d.id)} gap-1.5 text-[11px] font-medium`}
                  >
                    <svg width="18" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {d.id === 'bidirectional' ? (
                        <path d="M7 4l-4 4 4 4M17 4l4 4-4 4M3 8h18" />
                      ) : (
                        <path d="M3 8h18m-5-4 5 4-5 4" />
                      )}
                    </svg>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. Opacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-muted">Opacity</label>
              <span className="text-[10px] font-mono text-dim">{opacity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={opacity}
              onChange={(e) => {
                const nextOpacity = Number(e.target.value);
                if (selectedNode) {
                  onUpdateNode(selectedNode.id, { opacity: nextOpacity });
                } else if (selectedConnection) {
                  onUpdateConnection(selectedConnection.id, { opacity: nextOpacity });
                }
              }}
              className="w-full h-1.5 bg-card rounded-lg appearance-none cursor-pointer accent-brand"
            />
          </div>

          {/* 7. Actions */}
          <div className="space-y-2 pt-1 border-t border-subtle/60">
            <label className="text-[11px] font-medium text-muted block">Actions</label>
            <div className={`grid gap-2 ${selectedNode ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {selectedNode && (
                <button
                  onClick={() => onDuplicateNode(selectedNode.id)}
                  className="h-8 rounded-lg border border-subtle bg-card hover:bg-card-hover hover:border-subtle-hover text-muted hover:text-heading text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Duplicate
                </button>
              )}
              <button
                onClick={() =>
                  selectedNode
                    ? onDeleteNode(selectedNode.id)
                    : selectedConnection && onDeleteConnection(selectedConnection.id)
                }
                className="h-8 rounded-lg border border-subtle bg-card hover:bg-red-500/10 hover:border-red-500/40 text-muted hover:text-red-400 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </aside>

      <QuickKeysToggle />
    </>
  );
}
