import { useState } from 'react';
import Logo from '../reusables/Logo';
import SectionHeader from './Sidebar/SectionHeader';
import ComponentPickerModal from './Sidebar/ComponentPickerModal';

/* ─────────────────────────────────────────────────────────────
   Mock / Placeholder Data
   - SAVED_ARCHITECTURES: Represents user-saved board snapshots (named, persisted).
───────────────────────────────────────────────────────────── */

// Pre-saved architecture diagrams (mock data until backend persistence is wired)
const SAVED_ARCHITECTURES = [
  {
    id: '1',
    name: 'System Architecture v1',
    description: 'CDN → API Gateway → three microservices → Postgres.',
    updatedAt: '2h ago',
  },
  {
    id: '2',
    name: 'Auth Flow & Token Refresh',
    description: 'Client → Auth service → Redis session → JWT refresh loop.',
    updatedAt: 'Yesterday',
  },
  {
    id: '3',
    name: 'Event-Driven Pipeline',
    description: 'Producer → Kafka → Consumer group → Postgres + dead-letter queue.',
    updatedAt: '3d ago',
  },
];

/* ─────────────────────────────────────────────────────────────
   Saved Architecture Item (Accordion Card)
   Renders a single saved architecture snapshot with expandable details.
   Props:
     - arch: { id, name, description, updatedAt }
     - isOpen: boolean — whether this specific card's detail drawer is open
     - onToggle: function — toggles this card's open state
     - onLoad: function — loads this architecture onto the canvas
───────────────────────────────────────────────────────────── */
function ArchItem({ arch, isOpen, onToggle, onLoad }) {
  return (
    <div className="border border-subtle rounded-lg overflow-hidden">
      {/* Clickable Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-card hover:bg-card-hover cursor-pointer transition-colors text-left"
      >
        <span className="text-xs font-medium text-heading truncate pr-2">{arch.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg" width="11" height="11"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`text-dim shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Expandable Details Drawer */}
      {isOpen && (
        <div className="px-3 pt-2 pb-3 bg-panel border-t border-subtle space-y-2.5">
          <p className="text-[11px] text-muted leading-relaxed">{arch.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-dim">Updated {arch.updatedAt}</span>
            <div className="flex items-center gap-1.5">
              {/* Load onto canvas */}
              <button
                onClick={() => onLoad(arch)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 cursor-pointer transition-colors font-medium"
              >
                Load
              </button>
              {/* Delete architecture */}
              <button
                className="p-1 rounded-md text-dim hover:text-red-400 hover:bg-red-400/10 cursor-pointer transition-colors"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
export default function LeftSidebar({ onSelectPrimitive = () => {}, connections = [] }) {
  // Modal visibility state
  const [showPicker, setShowPicker] = useState(false);

  // Accordion open/collapse states for the two sidebar sections
  const [connectionsOpen, setConnectionsOpen] = useState(true);
  const [savedOpen, setSavedOpen] = useState(true);

  // ID of currently expanded saved architecture item (null if none are open)
  const [openArchId, setOpenArchId] = useState(null);

  // Toggles single accordion item open/shut
  const toggleArch = (id) => setOpenArchId((prev) => (prev === id ? null : id));

  // Placeholder handler for loading an architecture snapshot onto the board
  const handleLoad = (arch) => console.log('Load architecture:', arch.name);

  return (
    <>
      <aside className="w-60 border-r border-subtle bg-panel flex flex-col shrink-0 select-none z-20 font-poppins">

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

        {/* ── 2 & 3. Middle Body: Flexible container holding both sections ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── CONNECTIONS SECTION (Live from canvas arrows) ──
              style={{ flex: isOpen ? '1 1 auto' : '0 0 auto' }} ensures:
              - When open: takes available height and scrolls its contents
              - When closed: shrinks down to just the header height */}
          <div className="flex flex-col border-b border-subtle" style={{ flex: connectionsOpen ? '1 1 auto' : '0 0 auto' }}>
            <SectionHeader
              label="Connections"
              count={connections.length}
              isOpen={connectionsOpen}
              onToggle={() => setConnectionsOpen((o) => !o)}
            />
            {connectionsOpen && (
              <div className="overflow-y-auto flex-1 px-3 pb-3 pt-1">
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
                  /* Populated list: one row per arrow (Source -> Target) */
                  <div className="space-y-1 mt-1">
                    {connections.map((conn, i) => (
                      <div key={i} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-card border border-subtle text-xs">
                        <span className="text-heading font-medium truncate">{conn.from}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-dim shrink-0">
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                        <span className="text-heading font-medium truncate">{conn.to}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── SAVED ARCHITECTURES SECTION (Named snapshots) ── */}
          <div className="flex flex-col" style={{ flex: savedOpen ? '1 1 auto' : '0 0 auto' }}>
            <SectionHeader
              label="Saved Architectures"
              count={SAVED_ARCHITECTURES.length}
              isOpen={savedOpen}
              onToggle={() => setSavedOpen((o) => !o)}
            />
            {savedOpen && (
              <div className="overflow-y-auto flex-1 p-3 space-y-2">
                {SAVED_ARCHITECTURES.map((arch) => (
                  <ArchItem
                    key={arch.id}
                    arch={arch}
                    isOpen={openArchId === arch.id}
                    onToggle={() => toggleArch(arch.id)}
                    onLoad={handleLoad}
                  />
                ))}
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
