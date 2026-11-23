import { useState } from 'react';
import Logo from '../reusables/Logo';
import SectionHeader from './Sidebar/SectionHeader';
import ComponentPickerModal from './Sidebar/ComponentPickerModal';
import type { ComponentPrimitive, ConnectionEntity, NodeEntity } from '../../types/whiteboard';


interface LeftSidebarProps {
  onSelectPrimitive?: (primitives: ComponentPrimitive[]) => void;
  connections?: ConnectionEntity[];
  nodes: NodeEntity[];
  onDeleteConnection: (edgeId: string) => void;
  selectedEdgeId?: string | null;
  onSelectEdge?: (edgeId: string | null) => void;
}

/* ─────────────────────────────────────────────────────────────
   LeftSidebar Main Component
   Layout (vertical stack, fixed 240px width `w-60`):
     1. Top Action: "Add Component" button (triggers ComponentPickerModal)
     2. Middle Body: Scrollable area with 2 independently collapsible sections:
        - "Connections": Live arrow links currently drawn on the canvas
        - "Saved Architectures": Persisted board snapshots
     3. Bottom Footer: Subtle ghosted "Reeley" wordmark
───────────────────────────────────────────────────────────── */
export default function LeftSidebar({
  onSelectPrimitive = () => {},
  connections = [],
  nodes = [],
  onDeleteConnection = () => {},
  selectedEdgeId = null,
  onSelectEdge = () => {},
}: LeftSidebarProps) {
  
  // Modal visibility state
  const [showPicker, setShowPicker] = useState(false);

  // Accordion open/collapse states for the two sidebar sections
  const [connectionsOpen, setConnectionsOpen] = useState(true);
  const [savedOpen, setSavedOpen] = useState(true);

  return (
    <>
      <aside className="absolute top-12 left-0 bottom-0 w-60 border-r border-subtle bg-panel flex flex-col select-none z-20 font-poppins">

        {/* ── 1. Top Action: Add Component (pinned at top) ── */}
        <div className="p-3 border-b border-subtle shrink-0">
          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-brand/40 bg-brand/5 hover:bg-brand/10 hover:border-brand/60 text-brand cursor-pointer transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="text-xs font-semibold">Add Component</span>
          </button>
        </div>

        {/* ── 2 & 3. Middle Body: Bottom-anchored container holding both sections ── */}
        <div className="flex-1 flex flex-col justify-end overflow-hidden min-h-0">

          {/* ── CONNECTIONS SECTION (Live from canvas arrows) ──
              flex: '0 1 auto' + min-h-0 keeps collapsed/short sections anchored to the
              bottom while still shrinking and scrolling cleanly if lists overflow. */}
          <div className="flex flex-col border-t border-b border-subtle min-h-0 overflow-hidden" style={{ flex: '0 1 auto' }}>
            <SectionHeader
              label="Connections"
              count={connections.length}
              isOpen={connectionsOpen}
              onToggle={() => setConnectionsOpen((o) => !o)}
            />
            {connectionsOpen && (
              <div className="overflow-y-auto flex-1 min-h-0 px-3 pb-3 pt-1">
                {connections.length === 0 ? (
                  
                  /* Empty state: shown when no arrows exist on canvas yet */
                  <div className="mt-1 px-3 py-4 rounded-xl border border-dashed border-subtle flex flex-col items-center gap-2 text-center">
                    <div className="w-7 h-7 rounded-full bg-card border border-subtle flex items-center justify-center text-dim">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-heading">No connections yet</p>
                      <p className="text-[10px] text-dim mt-0.5 leading-relaxed">
                        Draw arrows between components on the canvas — they appear here automatically.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Populated list: compact borderless edge rows (distinct from Saved Architecture cards) */
                  <div className="space-y-0.5 mt-1">
                    {connections.map((conn, i) => { 

                      const fromNode = nodes.find(n => n.id === conn.fromNodeId);
                      const toNode   = nodes.find(n => n.id === conn.toNodeId);
                      const dotColor = conn.color || fromNode?.color || 'var(--color-bezier)';
                      
                      const isSelected = selectedEdgeId === conn.id;

                      return (
                        <div
                          key={conn.id || i}
                          onClick={() => onSelectEdge(isSelected ? null : conn.id)}
                          className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-brand/15 ring-1 ring-brand/40 text-heading'
                              : 'hover:bg-card/80'
                          }`}
                        >  
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 opacity-75"
                          style={{ backgroundColor: dotColor }}
                        />
                        <span className="text-muted group-hover:text-heading font-normal truncate transition-colors">{fromNode?.label || 'Unknown'}</span>

                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dim/70 shrink-0">
                          {conn.direction === 'bidirectional' ? (
                            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M3 12h18" />
                          ) : (
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                          )}
                        </svg>

                        <span className="text-muted group-hover:text-heading font-normal truncate transition-colors">{toNode?.label || 'Unknown'}</span>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteConnection(conn.id); }} 
                          className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 text-dim hover:text-red-400 hover:bg-red-400/10 rounded transition-all shrink-0 cursor-pointer"
                          title="Delete connection"
                          >
                           <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </button>
                      </div>
                    )})}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── SAVED ARCHITECTURES SECTION (Named snapshots) ── */}
          <div className="flex flex-col min-h-0 overflow-hidden" style={{ flex: '0 1 auto' }}>
            <SectionHeader
              label="Saved Architectures"
              isOpen={savedOpen}
              onToggle={() => setSavedOpen((o) => !o)}
              count
            />
            {savedOpen && (
              <div className="px-3 py-4 text-center">
                <span className="inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-card border border-subtle text-dim">
                  Coming soon
                </span>
                <p className="text-[11px] text-dim/80 mt-2 leading-relaxed">
                  Save &amp; reload named architecture snapshots.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* ── 3. Bottom Footer: Reusable Reeley brand wordmark ── */}
        <div className="py-3 px-4 border-t border-subtle flex items-center justify-center select-none overflow-hidden shrink-0">
          <Logo size="lg" />
        </div>
      </aside>

      {/* Conditionally rendered modal dialog when showPicker is true */}
      {showPicker && (
        <ComponentPickerModal
          onSelect={onSelectPrimitive}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
