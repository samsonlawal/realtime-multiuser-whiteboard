import { useEffect, useState } from 'react';

interface ExportModalProps {
  roomId?: string;
  nodeCount: number;
  connectionCount: number;
  onExportJson: () => void;
  onClose: () => void;
}

export default function ExportModal({
  roomId = 'architecture',
  nodeCount,
  connectionCount,
  onExportJson,
  onClose,
}: ExportModalProps) {
  const [format, setFormat] = useState<'json' | 'png'>('json');
  const previewDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDownload = () => {
    if (format === 'json') {
      onExportJson();
      onClose();
    }
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
        {/* 1. Header */}
        <div className="px-5 pt-4 pb-3.5 border-b border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-heading">Export Architecture</h2>
            {/* <p className="text-[11px] text-dim mt-0.5">
              {nodeCount} {nodeCount === 1 ? 'component' : 'components'} · {connectionCount}{' '}
              {connectionCount === 1 ? 'connection' : 'connections'}
            </p> */}
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
        <div className="p-5 space-y-4">
          {/* Side-by-side Format Selectors */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* JSON Option */}
            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`relative flex items-start justify-between p-3 rounded-lg border text-left cursor-pointer transition-all ${
                format === 'json'
                  ? 'bg-brand/10 border-brand/60'
                  : 'bg-card border-subtle hover:bg-card-hover'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={format === 'json' ? 'text-brand' : 'text-muted'}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-xs font-semibold text-heading">JSON</span>
                </div>
                {/* <p className="text-[10.5px] text-dim">Structured data</p> */}
              </div>

              {/* Radio Circle */}
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  format === 'json' ? 'border-brand bg-brand/20' : 'border-subtle'
                }`}
              >
                {format === 'json' && <span className="w-2 h-2 rounded-full bg-brand" />}
              </span>
            </button>

            {/* PNG Option (Disabled) */}
            <button
              type="button"
              disabled
              className="relative flex items-start justify-between p-3 rounded-lg border border-subtle bg-card/50 text-left opacity-50 cursor-not-allowed"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dim">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span className="text-xs font-semibold text-muted">PNG</span>
                  <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-panel border border-subtle text-dim">
                    Soon
                  </span>
                </div>
                {/* <p className="text-[10.5px] text-dim">Image snapshot</p> */}
              </div>

              {/* Empty Radio Circle */}
              <span className="w-4 h-4 rounded-full border border-subtle shrink-0 mt-0.5" />
            </button>
          </div>

          {/* Middle Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-medium uppercase tracking-wider text-dim">
                Preview
              </span>
              {/* <span className="text-[10.5px] font-mono text-dim">
                {roomId}.{format}
              </span> */}
            </div>

            {format === 'json' && (
              <div className="rounded-lg border border-subtle bg-canvas p-3.5 font-mono text-[11.5px] leading-relaxed overflow-x-auto">
                <div className="text-dim">{'{'}</div>
                <div className="pl-4">
                  <span className="text-sky-400">&quot;roomId&quot;</span>
                  <span className="text-dim">: </span>
                  <span className="text-emerald-400">&quot;{roomId}&quot;</span>
                  <span className="text-dim">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">&quot;exportedAt&quot;</span>
                  <span className="text-dim">: </span>
                  <span className="text-emerald-400">&quot;{previewDate}&quot;</span>
                  <span className="text-dim">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">&quot;nodes&quot;</span>
                  <span className="text-dim">: {'{}'}, </span>
                  <span className="text-dim/60 text-[10.5px]">// {nodeCount} items</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">&quot;connections&quot;</span>
                  <span className="text-dim">: {'{}'} </span>
                  <span className="text-dim/60 text-[10.5px]">// {connectionCount} items</span>
                </div>
                <div className="text-dim">{'}'}</div>
              </div>
            )}
          </div>

          {/* Full-width Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="w-full h-10 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
