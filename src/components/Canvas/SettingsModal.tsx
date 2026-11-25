import { useEffect } from 'react';

interface SettingsModalProps {
  theme: 'dark' | 'light';
  onChangeTheme: (theme: 'dark' | 'light') => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapToGrid: boolean;
  onToggleSnapToGrid: () => void;
  showCursors: boolean;
  onToggleCursors: () => void;
  roomId?: string;
  onClose: () => void;
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors cursor-pointer ${
        checked ? 'bg-brand border-brand' : 'bg-card border-subtle-hover'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function SettingsModal({
  theme,
  onChangeTheme,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnapToGrid,
  showCursors,
  onToggleCursors,
  roomId = 'default-room',
  onClose,
}: SettingsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-poppins"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-subtle bg-panel shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="px-5 pt-4 pb-3.5 border-b border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-heading">Board Settings</h2>
            <p className="text-[11px] text-dim mt-0.5">
              Preferences for room <span className="font-mono text-muted">{roomId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-dim hover:text-heading hover:bg-card flex items-center justify-center cursor-pointer transition-colors"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. Body */}
        <div className="p-5 space-y-5">
          {/* Appearance: Light / Dark Mode */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-dim block">
              Appearance
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onChangeTheme('dark')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'bg-brand/10 border-brand/60 text-heading'
                    : 'bg-card border-subtle text-muted hover:bg-card-hover'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                  <span className="text-xs font-medium">Dark</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    theme === 'dark' ? 'border-brand bg-brand/20' : 'border-subtle'
                  }`}
                >
                  {theme === 'dark' && <span className="w-2 h-2 rounded-full bg-brand" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTheme('light')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  theme === 'light'
                    ? 'bg-brand/10 border-brand/60 text-heading'
                    : 'bg-card border-subtle text-muted hover:bg-card-hover'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                  <span className="text-xs font-medium">Light</span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    theme === 'light' ? 'border-brand bg-brand/20' : 'border-subtle'
                  }`}
                >
                  {theme === 'light' && <span className="w-2 h-2 rounded-full bg-brand" />}
                </span>
              </button>
            </div>
          </div>

          {/* Canvas Settings */}
          <div className="space-y-3 pt-4 border-t border-subtle">
            <label className="text-[11px] font-medium uppercase tracking-wider text-dim block">
              Canvas
            </label>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-heading">Show Grid</div>
                <div className="text-[11px] text-dim">Display the background alignment grid</div>
              </div>
              <ToggleSwitch checked={showGrid} onChange={onToggleGrid} />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-heading">Snap to Grid</div>
                <div className="text-[11px] text-dim">Align dragged cards to 25px increments</div>
              </div>
              <ToggleSwitch checked={snapToGrid} onChange={onToggleSnapToGrid} />
            </div>
          </div>

          {/* Collaboration Settings */}
          <div className="space-y-3 pt-4 border-t border-subtle">
            <label className="text-[11px] font-medium uppercase tracking-wider text-dim block">
              Collaboration
            </label>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-heading">Show Live Cursors</div>
                <div className="text-[11px] text-dim">Display teammates&apos; pointers on the board</div>
              </div>
              <ToggleSwitch checked={showCursors} onChange={onToggleCursors} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
