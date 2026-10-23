import { useState } from 'react';
import Home from './components/Home/Home';
import WhiteboardView from './components/Canvas/WhiteboardView';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <>
      {currentView === 'home' ? (
        <Home onStartDrawing={() => setCurrentView('canvas')} />
      ) : (
        <WhiteboardView onBackToHome={() => setCurrentView('home')} />
      )}
    </>
  );
}

export default App;
