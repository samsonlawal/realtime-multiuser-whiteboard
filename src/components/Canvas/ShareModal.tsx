import { useEffect, useState } from 'react';

interface PeerItem {
  userId?: string;
  name: string;
  color: string;
  isSelf?: boolean;
}

interface ShareModalProps {
  roomId?: string;
  peers?: PeerItem[];
  onClose: () => void;
}

export default function ShareModal({ roomId = 'default-room', peers = [], onClose }: ShareModalProps) {
  const [linkRole, setLinkRole] = useState<'editor' | 'viewer'>('editor');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [copied, setCopied] = useState(false);
  const [invitedList, setInvitedList] = useState<{ email: string; role: 'editor' | 'viewer' }[]>([]);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${linkRole === 'viewer' ? '?role=viewer' : ''}`
      : '';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inviteEmail.trim();
    if (!trimmed) return;
    setInvitedList((prev) => [...prev, { email: trimmed, role: inviteRole }]);
    setInviteEmail('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-poppins"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-subtle bg-panel shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Header */}
        <div className="px-5 pt-4 pb-3.5 border-b border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-heading">Share Architecture Room</h2>
            <p className="text-[11px] text-dim mt-0.5">
              Room <span className="font-mono text-muted">{roomId}</span>
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

        {/* 2. Modal Body */}
        <div className="p-5 space-y-5">

            {/* URL bar + Copy button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 h-9 px-3 rounded-lg bg-card border border-subtle text-[11px] font-mono text-muted outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`h-9 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-sm ${
                  copied
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-brand hover:bg-brand-hover border-transparent text-white'
                }`}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy link
                  </>
                )}
              </button>
            </div>
          {/* </div> */}


          {/* Invite by email */}
          {/* <form onSubmit={handleInvite} className="space-y-2">
            <label className="text-[11px] font-medium text-muted block">Invite teammates</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-card border border-subtle focus-within:border-brand/60 rounded-lg px-2.5 h-9 transition-colors">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="samwalsh@gmail.com"
                  className="flex-1 bg-transparent text-xs text-heading placeholder:text-dim outline-none"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  className="bg-transparent text-[11px] text-muted hover:text-heading outline-none cursor-pointer pl-1.5 border-l border-subtle"
                >
                  <option value="editor" className="bg-panel text-heading">Can edit</option>
                  <option value="viewer" className="bg-panel text-heading">Can view</option>
                </select>
              </div>
              <button
                type="submit"
                className="h-9 px-3.5 rounded-md bg-brand hover:bg-brand-hover text-white text-xs font-medium cursor-pointer transition-colors shrink-0"
              >
                Invite
              </button>
            </div>
          </form> */}

          {/* Active & Invited People */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-muted block">
              People with access ({peers.length + invitedList.length})
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {peers.map((peer, idx) => (
                <div
                  key={peer.userId || idx}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: peer.color }}
                    >
                      {peer.name?.[0] || 'U'}
                    </div>
                    <span className="text-xs text-heading truncate">
                      {peer.name} {peer.isSelf && <span className="text-dim text-[11px]">(You)</span>}
                    </span>
                  </div>
                  <span className="text-[11px] text-dim font-medium">
                    {peer.isSelf ? 'Owner' : 'Editor'}
                  </span>
                </div>
              ))}

              {invitedList.map((inv, idx) => (
                <div
                  key={`${inv.email}-${idx}`}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-subtle flex items-center justify-center text-[10px] font-semibold text-muted shrink-0">
                      @
                    </div>
                    <span className="text-xs text-muted truncate">{inv.email}</span>
                  </div>
                  <span className="text-[10px] text-brand bg-brand/10 border border-brand/20 px-1.5 py-0.5 rounded">
                    Invited ({inv.role === 'editor' ? 'Can edit' : 'Can view'})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* General Link Access & Copy Link */}
          {/* <div className="pt-3 space-y-3"> */}
            {/* <div className="flex items-center justify-between"> */}
              {/* <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-card border border-subtle flex items-center justify-center text-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-heading">Anyone with the link</div>
                  <div className="text-[10.5px] text-dim">
                    {linkRole === 'editor'
                      ? 'Can place, move, and edit components'
                      : 'Can inspect the board in read-only mode'}
                  </div>
                </div>
              </div> */}

              {/* <div className="flex items-center bg-card border border-subtle rounded-lg p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setLinkRole('editor')}
                  className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    linkRole === 'editor'
                      ? 'bg-brand/15 text-heading font-medium'
                      : 'text-dim hover:text-heading'
                  }`}
                >
                  Can edit
                </button>
                <button
                  type="button"
                  onClick={() => setLinkRole('viewer')}
                  className={`px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    linkRole === 'viewer'
                      ? 'bg-brand/15 text-heading font-medium'
                      : 'text-dim hover:text-heading'
                  }`}
                >
                  Can view
                </button>
              </div> */}
            {/* </div> */}

            {/* URL bar + Copy button
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 h-9 px-3 rounded-lg bg-card border border-subtle text-[11px] font-mono text-muted outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`h-9 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-sm ${
                  copied
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-brand hover:bg-brand-hover border-transparent text-white'
                }`}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy link
                  </>
                )}
              </button>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
