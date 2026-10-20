import Navbar from './Navbar';
import Hero from './Hero';
import ArchitectureCards from './ArchitectureCards';
import Footer from './Footer';

export default function Home({ onStartDrawing }) {
  return (
    <div className="min-h-screen flex flex-col text-heading selection:bg-brand selection:text-white">
      <Navbar onStartDrawing={onStartDrawing} />
      <Hero onStartDrawing={onStartDrawing} />
      <ArchitectureCards />
      <Footer />
    </div>
  );
}
