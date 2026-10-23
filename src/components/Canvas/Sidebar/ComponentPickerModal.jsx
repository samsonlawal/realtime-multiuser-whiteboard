import { useState, useRef, useEffect } from 'react';
import ComponentIcon from '../../reusables/ComponentIcon';
import { COMPONENT_LIBRARY, COMPONENT_CATEGORIES } from '../../../constants/components';

/**
 * ComponentPickerModal:
 * Spotlight search dialog for system design architecture primitives.
 *
 * Props:
 *  - onSelect: function(item) — callback when a primitive is picked
 *  - onClose: function() — callback to dismiss the modal
 *
 * Features:
 *  - Auto-focuses search bar on mount
 *  - Closes on Escape key or backdrop click
 *  - Horizontal category tabs strip ([All], [Compute], [Databases & Storage], etc.)
 *  - Rock-solid fixed height (h-[460px]) to prevent layout jumping
 *  - Clean 2-column list rows with hover states
 */
export default function ComponentPickerModal({ onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const inputRef = useRef(null);

  // 1. Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 2. Escape key dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 3. Filter: normalized query computed ONCE outside the loop (prevents loop invariant recalculation)
  const normalizedQuery = query.toLowerCase().trim();
  const filtered = COMPONENT_LIBRARY.filter((c) => {
    const matchesQuery =
      !normalizedQuery ||
      c.label.toLowerCase().includes(normalizedQuery) ||
      c.category.toLowerCase().includes(normalizedQuery);
    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  // 4. Group by Category
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    /* BACKDROP: Centered dimmed overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      {/* MODAL WINDOW: Fixed height h-[460px] so it never jumps, max-w-2xl */}
      <div
        className="w-full max-w-2xl rounded-2xl border border-subtle bg-panel shadow-2xl flex flex-col overflow-hidden h-[460px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ROW 1: SEARCH BAR HEADER */}
        <div className="px-5 pt-4 pb-3 border-b border-subtle flex items-center gap-2.5 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-dim shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 32+ system primitives (e.g. Postgres, Kafka, Redis, Gateway)…"
            className="flex-1 bg-transparent text-sm text-heading placeholder:text-dim outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-dim hover:text-heading cursor-pointer transition-colors text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* ROW 2: HORIZONTAL CATEGORY TABS (Scrollbar-free) */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-subtle overflow-x-auto no-scrollbar shrink-0 bg-card/30">
          {['All', ...COMPONENT_CATEGORIES].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-dim hover:text-heading hover:bg-card-hover'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ROW 3: CLEAN SIMPLE LISTING (Fixed height scroll container, no-scrollbar) */}
        <div className="overflow-y-auto no-scrollbar flex-1 p-5 space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <p className="w-full text-center text-xs text-dim py-14">
              No components match &ldquo;{query}&rdquo;
            </p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                {/* Category Header */}
                <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-dim">
                  {category}
                </p>

                {/* Clean, unboxed 2-column list rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-card-hover text-left cursor-pointer transition-colors group"
                    >
                      <span className="text-brand/70 group-hover:text-brand transition-colors shrink-0">
                        <ComponentIcon type={item.icon} size={16} />
                      </span>
                      <span className="text-xs font-medium text-heading group-hover:text-white transition-colors truncate">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
