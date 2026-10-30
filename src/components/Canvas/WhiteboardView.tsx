import { useEffect, useState } from 'react';
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

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);


  function handleSelectNode(nodeId: string | null) {
    setSelectedNodeId(nodeId);
    console.log(connections);
  }

  // Delete Node and its connections
  function handleDeleteNode(nodeId: string) {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    );
  }

  function handleDeleteConnection(edgeId: string) {
    setConnections((prev) => prev.filter((c) => c.id !== edgeId));
  }

  // Duplicate Node with next Roman numeral and offset position
  function handleDuplicateNode(nodeId: string) {
    const sourceNode = nodes.find((n) => n.id === nodeId);
    if (!sourceNode) return;

    // 1. Count how many nodes of this primitiveId already exist
    const count = nodes.filter((n) => n.primitiveId === sourceNode.primitiveId).length;
    const instanceNumber = count + 1;

    // 2. Extract base label (strips any existing Roman numerals or numbers)
    const baseLabel = sourceNode.label.replace(/\s+(I|II|III|IV|V|\d+)$/, '');
    const roman = ['', 'I', 'II', 'III', 'IV', 'V'];
    const label = instanceNumber > 1
      ? `${baseLabel} ${roman[instanceNumber] || instanceNumber}`
      : baseLabel;

    // 3. Mint duplicated node with an offset
    const newNode: NodeEntity = {
      id: crypto.randomUUID(),
      primitiveId: sourceNode.primitiveId,
      label,
      icon: sourceNode.icon,
      category: sourceNode.category,
      color: sourceNode.color,
      x: sourceNode.x + 35,
      y: sourceNode.y + 35,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  }

  // Keyboard Event Listener: Delete & Duplicate (Ctrl+D / Cmd+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ALWAYS prevent browser bookmarking on Ctrl+D / Cmd+D in whiteboard
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedNodeId) {
          handleDuplicateNode(selectedNodeId);
        }
        return;
      }

      // 2. Delete selected node on Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        handleDeleteNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, nodes]);

  const handleSelectPrimitive = (primitives: ComponentPrimitive[]) => {
    const counts: Record<string, number> = {};
    for (const node of nodes) {
      counts[node.primitiveId] = (counts[node.primitiveId] || 0) + 1;
    }

    const newNodes: NodeEntity[] = primitives.map((primitive, index) => {
      // 1. Calculate Next Instance Number & Update Counts
      const instanceNumber = (counts[primitive.id] || 0) + 1;
      counts[primitive.id] = instanceNumber;

      // 2. Deterministic Label Generation
      const roman = ['', 'I', 'II', 'III', 'IV', 'V'];
      const label = instanceNumber > 1
        ? `${primitive.label} ${roman[instanceNumber] || instanceNumber}`
        : primitive.label;

      return {
        id: crypto.randomUUID(),
        primitiveId: primitive.id,
        label: label,
        icon: primitive.icon,
        category: primitive.category,
        color: primitive.color,
        x: 300 + (nodes.length + index) * 25,
        y: 180 + (nodes.length + index) * 25,
      };
    });

    setNodes((prev) => [...prev, ...newNodes]);
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
          <LeftSidebar 
          nodes={nodes}
          onSelectPrimitive={handleSelectPrimitive} connections={connections} onDeleteConnection={handleDeleteConnection}  />
        )}

        {/* Center Workspace (Canvas + Floating Island Toolbar) */}
        <Canvas
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          nodes={nodes}
          onUpdateNodePosition={handleUpdateNodePosition}
          connections={connections}
          onConnect={handleConnect}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          onDeleteNode={handleDeleteNode}
          onDuplicateNode={handleDuplicateNode}
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
