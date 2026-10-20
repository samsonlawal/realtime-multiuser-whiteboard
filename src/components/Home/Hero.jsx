import { useRef } from 'react';
import Button from '../reusables/Button';
import HeroDiagram from './HeroDiagram';
import HeroPresence from '../UserPresence/HeroPresence';

export default function Hero({ onStartDrawing }) {
  const heroRef = useRef(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full py-20 sm:py-28 text-left flex flex-col justify-center min-h-[480px] overflow-hidden cursor-crosshair"
    >
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="w-full h-full bg-grid"
          style={{
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 95%)',
          }}
        />
      </div>

      {/* Isolated presence layer: zero-re-render local cursor & peers */}
      <HeroPresence containerRef={heroRef} />

      <div className="relative max-w-6xl mx-auto w-full px-6 sm:px-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col items-start">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-tight text-heading max-w-xl leading-[1.16] mb-3 font-poppins">
              Realtime whiteboard built for engineers.
            </h1>

            <p className="text-sm sm:text-base text-muted max-w-lg leading-relaxed mb-6 font-poppins font-normal">
              A high-performance vector canvas for sketching system architectures and collaborating with low-latency live cursors.
            </p>

            <div className="flex items-center gap-3.5">
              <Button variant="white" size="md" onClick={onStartDrawing}>
                New Canvas
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => alert('Room codes coming up in the next step!')}
              >
                Join with Code
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 w-full">
            <HeroDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
