/**
 * SectionHeader:
 * Reusable accordion section header toggle used inside LeftSidebar.
 *
 * Props:
 *  - label: string (e.g. 'Connections', 'Saved Architectures')
 *  - count: number (optional badge count e.g. 3)
 *  - isOpen: boolean (controls the 180deg rotating chevron)
 *  - onToggle: function (called when the user clicks the header bar)
 */
export default function SectionHeader({ label, count, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-3 py-2 hover:bg-card-hover cursor-pointer transition-colors group shrink-0"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-dim group-hover:text-muted transition-colors">
          {label}
        </span>
        {/* Count badge: Only renders if count is provided */}
        {count !== undefined && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-card border border-subtle text-dim font-mono leading-none">
            {count}
          </span>
        )}
      </div>

      {/* Chevron Arrow: Rotates 180deg when open */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-dim shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}
