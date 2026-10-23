import Button from '../reusables/Button';
import Logo from '../reusables/Logo';

export default function CanvasHeader({
  title = 'System Architecture v1',
  roomName = 'sys-design-prod',
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
}) {
  return (
    <header className="h-12 border-b border-subtle bg-panel px-3 sm:px-4 flex items-center justify-between shrink-0 select-none z-30 font-poppins">
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
          <span>{roomName}</span>
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
          className="text-xs px-2.5 py-1 bg-card hover:bg-card-hover border border-subtle rounded-md text-heading font-medium cursor-pointer transition-colors hidden sm:block"
        >
          Export
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={onShare}
          className="!h-7 !px-3 !text-xs font-medium"
        >
          Share
        </Button>
      </div>
    </header>
  );
}
