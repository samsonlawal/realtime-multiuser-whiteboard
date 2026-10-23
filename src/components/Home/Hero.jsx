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
                <p>New Canvas </p>

                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z"></path></svg>
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => alert('Room codes coming up in the next step!')}
              >
                <p>Join with Code</p>

                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" viewBox="0 0 256 256"><path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path></svg>
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
