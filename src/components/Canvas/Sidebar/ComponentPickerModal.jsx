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

  // quantities dictionary: { [primitiveId: string]: number }
  const [quantities, setQuantities] = useState({});

  const getCount = (id) => quantities[id] || 0;

  const handleIncrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const totalCount = Object.values(quantities).reduce((sum, n) => sum + n, 0);



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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  {items.map((item) => {
                    const count = getCount(item.id);
                    const isSelected = count > 0;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleIncrement(item.id)}
                        className={`relative w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left cursor-pointer transition-all border ${
                          isSelected
                            ? 'border-brand/40 bg-brand/10 shadow-sm'
                            : 'border-transparent hover:bg-card-hover'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-6 h-6 rounded flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: `${item.color || '#3b82f6'}18`,
                              color: item.color || '#3b82f6',
                            }}
                          >
                            <ComponentIcon type={item.icon} size={14} color={item.color} />
                          </span>
                          <span className="text-xs font-medium text-heading truncate">
                            {item.label}
                          </span>
                        </div>

                        {/* Inline Micro Stepper */}
                        {isSelected && (
                          <div
                            className="flex items-center gap-1 bg-panel border border-subtle rounded-md px-1 py-0.5 shrink-0 shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => handleDecrement(item.id)}
                              className="w-4 h-4 flex items-center justify-center rounded text-dim hover:text-heading hover:bg-card text-xs font-bold transition-colors cursor-pointer"
                              title="Decrease count"
                            >
                              −
                            </button>
                            <span className="min-w-[14px] text-center text-[11px] font-semibold text-brand px-0.5">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrement(item.id)}
                              className="w-4 h-4 flex items-center justify-center rounded text-dim hover:text-heading hover:bg-card text-xs font-bold transition-colors cursor-pointer"
                              title="Increase count"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        {/* ROW 4: PINNED BOTTOM FOOTER */}
        <div className="px-5 py-3 border-t border-subtle bg-card/40 flex items-center justify-between shrink-0">
          {/* Left: Count summary */}
          <span className="text-xs text-muted">
            {totalCount === 0
              ? 'Click components to select'
              : `${totalCount} component${totalCount > 1 ? 's' : ''} ready to add`}
          </span>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-dim hover:text-heading transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              disabled={totalCount === 0}
              onClick={() => {
                // Expand dictionary quantities into an array of ComponentPrimitive
                const itemsToAdd = [];
                for (const [id, count] of Object.entries(quantities)) {
                  const primitive = COMPONENT_LIBRARY.find((c) => c.id === id);
                  if (primitive && count > 0) {
                    for (let i = 0; i < count; i++) {
                      itemsToAdd.push(primitive);
                    }
                  }
                }
                onSelect(itemsToAdd);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand text-white hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              Add to Board {totalCount > 0 && `(${totalCount})`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
