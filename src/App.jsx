import { useState } from 'react';
import Home from './components/Home/Home';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <>
      {currentView === 'home' ? (
        <Home onStartDrawing={() => setCurrentView('canvas')} />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
          <h2>Canvas Playground (Ready for next step)</h2>
          <button
            onClick={() => setCurrentView('home')}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            ← Back to Homepage
          </button>
        </div>
      )}
    </>
  );
}

export default App;
