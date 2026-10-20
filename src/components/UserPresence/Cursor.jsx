import { forwardRef } from 'react';

const Cursor = forwardRef(function Cursor(
  {
    x,
    y,
    name,
    colorClass = 'bg-brand',
    fillHex = '#3b82f6',
    className = '',
    style,
    ...props
  },
  ref
) {
  const isTransform = typeof x === 'number' && typeof y === 'number';

  return (
    <div
      ref={ref}
      className={`absolute pointer-events-none select-none z-50 ${
        isTransform ? 'top-0 left-0 transition-transform duration-75 ease-out' : ''
      } ${className}`}
      style={
        style
          ? style
          : isTransform
          ? { transform: `translate3d(${x}px, ${y}px, 0)` }
          : undefined
      }
      {...props}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <path
          d="M5.65 2.15C5.17 1.67 4.35 2.01 4.35 2.69V19.81C4.35 20.57 5.3 20.92 5.79 20.35L10.38 15.04C10.58 14.81 10.87 14.68 11.18 14.68H18.82C19.57 14.68 19.93 13.75 19.37 13.25L5.65 2.15Z"
          fill={fillHex}
        />
      </svg>

      <div
        className={`absolute left-3.5 top-3.5 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md tracking-wider ${colorClass}`}
      >
        {name}
      </div>
    </div>
  );
});

export default Cursor;
