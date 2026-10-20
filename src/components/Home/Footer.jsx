export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-subtle bg-panel flex flex-col items-center">
      <div className="w-full py-14 sm:py-20 px-6 flex items-center justify-center select-none overflow-hidden">
        <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter text-dim/25 hover:text-dim/40 transition-colors duration-300 font-display leading-none text-center">
          Reeley
        </span>
      </div>

      <div className="w-full border-t border-subtle">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-dim gap-3">
          <div>© 2026 Reeley • Realtime Multiuser Canvas</div>
          <div className="flex items-center gap-4">
            <span className="text-dim">React + Vite + Tailwind v4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
