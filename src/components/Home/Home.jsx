import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import ArchitectureCards from './ArchitectureCards';
import Footer from './Footer';

export default function Home() {

  const navigate = useNavigate();

    const handleStartDrawing = () => {
    const newRoomId = `rly-${crypto.randomUUID().slice(0, 8)}`;
    navigate(`/${newRoomId}`);
  };


  return (
    <div className="min-h-screen flex flex-col text-heading selection:bg-brand selection:text-white">
      <Navbar onStartDrawing={handleStartDrawing} />
      <Hero onStartDrawing={handleStartDrawing} />
      <ArchitectureCards />
      <Footer />
    </div>
  );
}


