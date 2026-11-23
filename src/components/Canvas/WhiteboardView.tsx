import { useEffect, useRef, useState } from 'react';
import CanvasHeader from './CanvasHeader';
import LeftSidebar from './LeftSidebar';
import Canvas from './Canvas';
import ShareModal from './ShareModal';
import PropertiesPanel from '../UserPresence/PropertiesPanel';
import type { NodeEntity, ConnectionEntity, PortDirection, ComponentPrimitive, ToolType, MultiplayerEvent  } from '../../types/whiteboard';
import { useParams, useNavigate } from 'react-router-dom';
import { useMultiplayer } from './../../hooks/useMultiplayer';

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

interface HistoryEntry {
  undo: MultiplayerEvent[];
  redo: MultiplayerEvent[]
}


export default function WhiteboardView({ onBackToHome }: WhiteboardViewProps) {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [nodes, setNodes] = useState<NodeEntity[]>([]);
  const [connections, setConnections] = useState<ConnectionEntity[]>([]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const navigate = useNavigate()
  const { roomId } = useParams<{ roomId: string }>();

  const undoStackRef = useRef<HistoryEntry[]>([])
  const redoStackRef = useRef<HistoryEntry[]>([])


  const { isConnected, peers, currentUser, broadcastCursor, broadcastEvent } = useMultiplayer(roomId, setNodes, setConnections);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null;
  const selectedConnection = selectedEdgeId ? connections.find((c) => c.id === selectedEdgeId) ?? null : null;



  function handleSelectNode(nodeId: string | null) {
    setSelectedNodeId(nodeId || null);
    if (nodeId) {
      setSelectedEdgeId(null);
    }
  }

  function handleSelectEdge(edgeId: string | null) {
    setSelectedEdgeId(edgeId);
    if (edgeId) {
      setSelectedNodeId(null);
    }
  }

  function handleUpdateNode(nodeId: string, updates: Partial<NodeEntity>) {
    const currentNode = nodes.find((n) => n.id === nodeId);
    if (currentNode) {
      const prevValues: Partial<NodeEntity> = {};
      (Object.keys(updates) as (keyof NodeEntity)[]).forEach((key) => {
        (prevValues as Record<string, unknown>)[key] = currentNode[key];
      });
      pushHistory({
        undo: [{ type: 'node_updated', nodeId, updates: prevValues }],
        redo: [{ type: 'node_updated', nodeId, updates }],
      });
    }

    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)));

    broadcastEvent({type: 'node_updated', nodeId, updates})

  }

  function handleUpdateConnection(edgeId: string, updates: Partial<ConnectionEntity>) {
    const currentConn = connections.find((c) => c.id === edgeId);
    if (currentConn) {
      const prevValues: Partial<ConnectionEntity> = {};
      (Object.keys(updates) as (keyof ConnectionEntity)[]).forEach((key) => {
        (prevValues as Record<string, unknown>)[key] = currentConn[key];
      });
      pushHistory({
        undo: [{ type: 'edge_updated', edgeId, updates: prevValues }],
        redo: [{ type: 'edge_updated', edgeId, updates }],
      });
    }

    setConnections((prev) => prev.map((c) => (c.id === edgeId ? { ...c, ...updates } : c)));

    broadcastEvent({type: 'edge_updated', edgeId, updates})

  }

  // Delete Node and its connections
  function handleDeleteNode(nodeId: string) {
    const deletedNode = nodes.find((n) => n.id === nodeId);
    const attachedEdges = connections.filter(
      (c) => c.fromNodeId === nodeId || c.toNodeId === nodeId
    );

    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    );
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }

    broadcastEvent({type: 'node_deleted', nodeId: nodeId})

    if (deletedNode) {
      pushHistory({
        undo: [
          { type: 'nodes_added', nodes: [deletedNode] },
          ...attachedEdges.map((c) => ({ type: 'edge_added' as const, connection: c })),
        ],
        redo: [{ type: 'node_deleted', nodeId }],
      });
    }
  }

  function handleDeleteConnection(edgeId: string) {
    const deletedConn = connections.find((c) => c.id === edgeId);

    setConnections((prev) => prev.filter((c) => c.id !== edgeId));
    if (selectedEdgeId === edgeId) {
      setSelectedEdgeId(null);
    }

    broadcastEvent({type: 'edge_deleted', edgeId: edgeId})

    if (deletedConn) {
      pushHistory({
        undo: [{ type: 'edge_added', connection: deletedConn }],
        redo: [{ type: 'edge_deleted', edgeId }],
      });
    }
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
      fill: sourceNode.fill,
      strokeWidth: sourceNode.strokeWidth,
      strokeStyle: sourceNode.strokeStyle,
      opacity: sourceNode.opacity,
      x: sourceNode.x + 35,
      y: sourceNode.y + 35,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setSelectedEdgeId(null);

    broadcastEvent({type: 'nodes_added', nodes: [newNode] })

    pushHistory({
      undo: [{ type: 'node_deleted', nodeId: newNode.id }],
      redo: [{ type: 'nodes_added', nodes: [newNode] }],
    });
  }

  // Keyboard Event Listener: Delete & Duplicate (Ctrl+D / Cmd+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;


      // 1. ALWAYS prevent browser bookmarking on Ctrl+D / Cmd+D in whiteboard
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedNodeId) {
          handleDuplicateNode(selectedNodeId);
        }
        return;
      }

      // 2. Delete selected node or edge on Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          handleDeleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          handleDeleteConnection(selectedEdgeId);
        }
      }


      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo()
        return;
      }


      if ((e.ctrlKey || e.metaKey)  && e.key.toLowerCase() === 'y') {
        e.preventDefault();
                handleRedo()

        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, nodes, connections]);

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
    broadcastEvent({ type: 'nodes_added', nodes: newNodes });

    pushHistory({
      undo: newNodes.map((n) => ({type: "node_deleted", nodeId: n.id})),
      redo: [{type: 'nodes_added', nodes: newNodes}]
    })


  };


  function pushHistory(entry: HistoryEntry) {
    undoStackRef.current.push(entry)
    redoStackRef.current = [];
  }

  function applyHistoryEvent(event: MultiplayerEvent) {
                    switch(event.type) {

                    case 'nodes_added':
                        setNodes((prev) => [...prev, ...event.nodes])
                    break;

                    case 'node_moved':
                        setNodes((prevNodes) =>
                            prevNodes.map((prevNode) => (
                            prevNode.id === event.id ? {...prevNode, x: event.x, y: event.y} : prevNode
                            )))
                        break;

                    case 'node_deleted':
                        setNodes((prevNodes) => 
                            prevNodes.filter((n) => 
                            n.id !== event.nodeId
                        )
                        )

                        setConnections((prevConnections) => 
                            prevConnections.filter((c) => 
                                c.fromNodeId !== event.nodeId && c.toNodeId !== event.nodeId
                            )
                        )
                        break;

                    case 'edge_added':
                        setConnections((prevConnections) => [...prevConnections, event.connection])
                        break;

                    case 'edge_deleted':
                        setConnections((prevConnections) => 
                            prevConnections.filter((c) => 
                                c.id !== event.edgeId
                            )
                        )
                        break;

                        case('node_updated'):
                            setNodes((prevNodes) =>
                                prevNodes.map((prevNode) => (
                                    prevNode.id === event.nodeId ? {...prevNode, ...event.updates} : prevNode
                            )))
                        break;

                        case('edge_updated'):
                            setConnections((prevConnections) =>
                                prevConnections.map((prevConnection) => (
                                    prevConnection.id === event.edgeId ? {...prevConnection, ...event.updates} : prevConnection
                            )))
                        break;
            }

    broadcastEvent(event)

  }

  const handleUndo = () => {
    let popoff = undoStackRef.current.pop()

    if(!popoff) return;
    redoStackRef.current.push(popoff)

    popoff.undo.forEach((event) => {
      applyHistoryEvent(event)
    })
  };

  const handleRedo = () => {
    let popoff = redoStackRef.current.pop()

    if(!popoff) return;
    undoStackRef.current.push(popoff)

    popoff.redo.forEach((event) => {
      applyHistoryEvent(event)
    })
  };

  const handleExport = () => {
    alert('Export diagram feature coming in Milestone 3!');
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };


function filterAndGroupComponents(items: ComponentPrimitive[], query: string) {

}

const lastMoveref = useRef<{id: string; time: number} | null>(null)

function handleUpdateNodePosition(id: string, newX: number, newY: number) {

  const oldNode = nodes.find((n) => n.id === id);

     if (oldNode && (oldNode.x !== newX || oldNode.y !== newY)) {
      const now = Date.now();
      
      if (
        lastMoveref.current &&
        lastMoveref.current.id === id &&
        now - lastMoveref.current.time < 400
      ) {
        const lastEntry = undoStackRef.current.pop();
        if (lastEntry) {
          pushHistory({
            undo: lastEntry.undo,
            redo: [{ type: 'node_moved', id, x: newX, y: newY }],
          });
        }
      } else {
        pushHistory({
          undo: [{ type: 'node_moved', id, x: oldNode.x, y: oldNode.y }],
          redo: [{ type: 'node_moved', id, x: newX, y: newY }],
        });
      }
      lastMoveref.current = { id, time: now };
    }

  setNodes((prevNodes) => 
  prevNodes.map((prevNode) => (
    prevNode.id === id ? {...prevNode, x: newX, y: newY  } : prevNode)))

    broadcastEvent({type: 'node_moved', id: id, x:newX, y: newY})

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

    broadcastEvent({type: 'edge_added', connection: newConnection })

    pushHistory({
      undo: [{ type: 'edge_deleted', edgeId: newConnection.id }],
      redo: [{ type: 'edge_added', connection: newConnection }],
    });
  };










  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-canvas text-heading select-none font-poppins">
      {/* 1. Top Navigation Bar */}
      <CanvasHeader
        // title="Distributed System Arch"
        // roomName="sys-design-prod"
        peers={[currentUser, ...Object.values(peers)]}
        isLeftSidebarOpen={isLeftSidebarOpen}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen((prev) => !prev)}
        onBackToHome={() => navigate('/')}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={handleExport}
        onShare={handleShare}
        roomId={roomId}
      />

      {/* 2. Workspace Row */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
      <div className="w-full h-full overflow-hidden">
        {/* Left Docked Sidebar (Primitives & Connections) - toggled via CanvasHeader */}
        {isLeftSidebarOpen && (
          <LeftSidebar 
            nodes={nodes}
            onSelectPrimitive={handleSelectPrimitive}
            connections={connections}
            onDeleteConnection={handleDeleteConnection}
            selectedEdgeId={selectedEdgeId}
            onSelectEdge={handleSelectEdge}
          />
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
          selectedEdgeId={selectedEdgeId}
          onSelectEdge={handleSelectEdge}
          onDeleteNode={handleDeleteNode}
          onDuplicateNode={handleDuplicateNode}
          onCursorMove={broadcastCursor}
          peers={peers}
        />

        {/* Right Floating Inspector (Properties & Styling + QuickKeysToggle) */}
        <PropertiesPanel
          selectedNode={selectedNode}
          selectedConnection={selectedConnection}
          onUpdateNode={handleUpdateNode}
          onUpdateConnection={handleUpdateConnection}
          onDuplicateNode={handleDuplicateNode}
          onDeleteNode={handleDeleteNode}
          onDeleteConnection={handleDeleteConnection}
        />

        {isShareModalOpen && (
          <ShareModal
            roomId={roomId}
            peers={[currentUser, ...Object.values(peers)]}
            onClose={() => setIsShareModalOpen(false)}
          />
        )}
      </div>
    </div>
    </div>

  );
}
