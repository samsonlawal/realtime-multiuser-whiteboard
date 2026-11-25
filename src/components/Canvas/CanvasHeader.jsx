import Button from '../reusables/Button';
import Logo from '../reusables/Logo';

export default function CanvasHeader({
  peers = [
    { name: 'You', color: '#3b82f6', isSelf: true },
    { name: 'Sarah', color: '#a855f7' },
    { name: 'Alex', color: '#10b981' },
  ],
  isLeftSidebarOpen = true,
  onToggleLeftSidebar = () => {},
  onBackToHome = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onExport = () => {},
  onShare = () => {},
  onOpenSettings = () => {},
  roomId,
}) {
  return (
    <header className="absolute top-0 left-0 right-0 h-12 border-b border-subtle bg-panel px-3 sm:px-4 flex items-center justify-between select-none z-30 font-poppins">
      {/* 1. Left Section: Return to Home, Reeley Identity & Sidebar Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="p-1.5 rounded-md hover:bg-card text-muted hover:text-heading cursor-pointer transition-colors flex items-center justify-center border border-transparent hover:border-subtle"
          title="Return to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        {/* Brand Wordmark */}
        <Logo size="sm" />

        {/* Subtle Divider */}
        <div className="w-px h-3.5 bg-subtle mx-0.5" />

        {/* Left Sidebar Toggle Button */}
        <button
          onClick={onToggleLeftSidebar}
          className={`p-1.5 rounded-md transition-colors cursor-pointer border ${
            isLeftSidebarOpen
              ? 'bg-card text-heading border-subtle'
              : 'text-dim hover:text-heading hover:bg-card border-transparent hover:border-subtle'
          }`}
          title={isLeftSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
      </div>

      {/* 2. Center Section: History (Undo/Redo) & Room Indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-subtle rounded-md bg-card p-0.5 shadow-sm">
          <button
            onClick={onUndo}
            className="p-1 rounded text-muted hover:text-heading hover:bg-panel cursor-pointer transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6"/>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
            </svg>
          </button>
          <div className="w-px h-3.5 bg-subtle mx-0.5" />
          <button
            onClick={onRedo}
            className="p-1 rounded text-muted hover:text-heading hover:bg-panel cursor-pointer transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6"/>
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-subtle text-xs text-muted font-montserrat">
          <span>{roomId}</span>
        </div>
      </div>

      {/* 3. Right Section: Peer Avatars, Export & Share */}
      <div className="flex items-center gap-2">
        <div className="flex items-center -space-x-1.5 mr-1">
          {peers.map((peer, idx) => (
            <div
              key={idx}
              className="w-6 h-6 rounded-full border-2 border-panel flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-subtle cursor-default"
              style={{ backgroundColor: peer.color }}
              title={`${peer.name} ${peer.isSelf ? '(You)' : ''}`}
            >
              {peer.name[0]}
            </div>
          ))}
        </div>

        <button
          onClick={onExport}
          className="text-xs px-2.5 py-1 bg-card hover:bg-card-hover border border-subtle rounded-md text-heading font-medium cursor-pointer transition-colors hidden sm:flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={onShare}
          className="!h-7 !px-3 !text-xs font-medium flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </Button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md bg-card hover:bg-card-hover border border-subtle text-muted hover:text-heading cursor-pointer transition-colors flex items-center justify-center"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </header>
  );
}
