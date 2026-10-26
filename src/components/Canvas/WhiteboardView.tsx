import { useState } from 'react';
import CanvasHeader from './CanvasHeader';
import LeftSidebar from './LeftSidebar';
import Canvas from './Canvas';
import PropertiesPanel from '../UserPresence/PropertiesPanel';
import type { NodeEntity, ConnectionEntity, PortDirection, ComponentPrimitive, ToolType  } from '../../types/whiteboard';

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

interface WhiteboardViewProps {
  onBackToHome?: () => void;
}


export default function WhiteboardView({ onBackToHome }: WhiteboardViewProps) {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [selectedColor, setSelectedColor] = useState('#f4f4f5');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeStyle, setStrokeStyle] = useState('solid');
  const [fill, setFill] = useState('transparent');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [nodes, setNodes] = useState<NodeEntity[]>([]);
  const [connections, setConnections] = useState<ConnectionEntity[]>([]);


  const handleSelectPrimitive = (primitive: ComponentPrimitive) => {
    const newNode = {
      id: crypto.randomUUID(),
      primitiveId: primitive.id,
      label: primitive.label,
      icon: primitive.icon,
      category: primitive.category,
      x: 300 + (nodes.length * 20),
      y: 180 + (nodes.length * 20),
    };

    setNodes((prev) => [...prev, newNode]);
    console.log(primitive)
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


function filterAndGroupComponents(items: ComponentPrimitive[], query: string) {

}

function handleUpdateNodePosition(id: string, newX: number, newY: number) {

  setNodes((prevNodes) => 
    // How do you check if n.id === id, and update its x and y?
  prevNodes.map((prevNode) => (
    prevNode.id === id ? {...prevNode, x: newX, y: newY  } : prevNode)))

}

  // Creates a permanent connection between two card ports
  const handleConnect = (
    fromNodeId: string,
    fromPort: PortDirection,
    toNodeId: string,
    toPort: PortDirection
  ) => {
    const newConnection: ConnectionEntity = {
      id: crypto.randomUUID(),
      fromNodeId,
      fromPort,
      toNodeId,
      toPort,
    };
    setConnections((prev) => [...prev, newConnection]);
  };



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
          <LeftSidebar onSelectPrimitive={handleSelectPrimitive} connections={connections} />
        )}

        {/* Center Workspace (Canvas + Floating Island Toolbar) */}
        <Canvas
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          nodes={nodes}
         onUpdateNodePosition={handleUpdateNodePosition}
         connections={connections}
          onConnect={handleConnect}
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
