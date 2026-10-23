import { useState } from 'react';
import CanvasHeader from './CanvasHeader';
import LeftSidebar from './LeftSidebar';
import Canvas from './Canvas';
import PropertiesPanel from '../UserPresence/PropertiesPanel';

/**
 * WhiteboardView:
 * The application shell for the whiteboard editor.
 * Layout Structure:
 * - Row 1: Fixed Top Bar (CanvasHeader: title, undo/redo, room, peers, export, share)
 * - Row 2: 3-column body:
 *     - Left Docked Sidebar (LeftSidebar: saved architectures, primitives, connections)
 *     - Center Viewport (Canvas: dual-layer canvases + bottom floating toolbar)
 *     - Right Docked Sidebar (PropertiesPanel: stroke styling, colors, fill)
 */

export default function WhiteboardView({ onBackToHome }) {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedColor, setSelectedColor] = useState('#f4f4f5');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState('solid');
  const [fill, setFill] = useState('transparent');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

  const handleSelectPrimitive = (primitive) => {
    // In Milestone 2/3, this will drop the shape onto the canvas center.
    console.log('Selected system primitive:', primitive.label);
  };

  const handleUndo = () => {
    console.log('Undo triggered');
  };

  const handleRedo = () => {
    console.log('Redo triggered');
  };

  const handleExport = () => {
    alert('Export diagram feature coming in Milestone 3!');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Room link copied to clipboard!');
  };


function filterAndGroupComponents(items, query) {

}



  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-canvas text-heading select-none font-poppins">
      {/* 1. Top Navigation Bar */}
      <CanvasHeader
        title="Distributed System Arch"
        roomName="sys-design-prod"
        isLeftSidebarOpen={isLeftSidebarOpen}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen((prev) => !prev)}
        onBackToHome={onBackToHome}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={handleExport}
        onShare={handleShare}
      />

      {/* 2. Workspace Row */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Docked Sidebar (Primitives & Connections) - toggled via CanvasHeader */}
        {isLeftSidebarOpen && (
          <LeftSidebar onSelectPrimitive={handleSelectPrimitive} />
        )}

        {/* Center Workspace (Canvas + Floating Island Toolbar) */}
        <Canvas
          activeTool={activeTool}
          onSelectTool={setActiveTool}
        />

        {/* Right Docked Sidebar (Properties & Styling) */}
        <PropertiesPanel
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          strokeWidth={strokeWidth}
          onSelectStrokeWidth={setStrokeWidth}
          strokeStyle={strokeStyle}
          onSelectStrokeStyle={setStrokeStyle}
          fill={fill}
          onSelectFill={setFill}
        />
      </div>
    </div>
  );
}
