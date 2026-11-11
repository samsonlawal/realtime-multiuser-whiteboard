import { useEffect, useRef, useState } from 'react';
import { ConnectionEntity, NodeEntity, MultiplayerEvent } from '../types/whiteboard';   


export interface RemotePeer {
  userId: string;
  name?: string;
  color: string;
  cursor: { x: number; y: number } | null;
}

export function useMultiplayer(roomId: string | undefined, setNodes: React.Dispatch<React.SetStateAction<NodeEntity[]>>,
  setConnections: React.Dispatch<React.SetStateAction<ConnectionEntity[]>>) {
    const [peers, setPeers] = useState<Record<string, RemotePeer>>({});
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    const [myUserId] = useState(() => {
    let id = localStorage.getItem('canvas_device_id');
    if (!id) {
        id = `user-${crypto.randomUUID().slice(0, 5)}`;
        localStorage.setItem('canvas_device_id', id);
    }
    return id;
    });

    useEffect(() => {
        if (!roomId) return;

        const socket = new WebSocket(`ws://localhost:8080?room=${roomId}&userId=${myUserId}`);
        socketRef.current = socket;
        
        // listend to the onConnetion from the server
        socket.onopen = () => {
            console.log(`[Multiplayer] Connected to room: ${roomId}`);
            setIsConnected(true);
        };

        // Listenting to evetns from room members(message) from the server
        socket.onmessage = (event) => {
            try{
                const data = JSON.parse(event.data)

                switch(data.type) {
                    case "cursor_move": 
                        setPeers((prev) => ({
                            ...prev,
                            [data.userId]: {
                                userId: data.userId,
                                name: data.userId,
                                color: data.color || '#3b82f6',
                                cursor: { x: data.x, y: data.y },
                            }
                        }))

                    break;

                    case 'user_left':
                        setPeers((prev) => {
                            const next = { ...prev };
                            delete next[data.userId]
                            return next
                        })
                        break;

                    case 'nodes_added':
                        setNodes((prev) => [...prev, ...data.nodes])
                    break;

                    case 'node_moved':
                        setNodes((prevNodes) =>
                            prevNodes.map((prevNode) => (
                            prevNode.id === data.id ? {...prevNode, x: data.x, y: data.y} : prevNode
                            )))
                        break;

                    case 'node_deleted':
                        setNodes((prevNodes) => 
                            prevNodes.filter((n) => 
                            n.id !== data.nodeId
                        )
                        )

                        setConnections((prevConnections) => 
                            prevConnections.filter((c) => 
                                c.fromNodeId !== data.nodeId && c.toNodeId !== data.nodeId
                            )
                        )
                        break;

                    case 'edge_added':
                        setConnections((prevConnections) => [...prevConnections, data.connection])
                        break;

                    case 'edge_deleted':
                        setConnections((prevConnections) => 
                            prevConnections.filter((c) => 
                                c.id !== data.edgeId
                            )
                        )
                        break;

                        case('init_room'):
                            setNodes(data.nodes)
                            setConnections(data.connections)
                            break;
              }


            } catch (err) {
                console.error('[Multiplayer] Failed to parse message:', err);    
            }
        } 

        // when you leave and it listens to close from the server
        socket.onclose = () => {
            console.log('[Multiplayer] Disconnected from server');
            setIsConnected(false);
        };

        return () => {
            socket.close();
            socketRef.current = null;
        };
    }, [roomId]);

    const broadcastCursor = (x: number, y: number) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
        JSON.stringify({
        type: 'cursor_move',
        userId: myUserId,
        x: Math.round(x),
        y: Math.round(y),
        })
    );
    };




    const broadcastEvent = (payload: MultiplayerEvent) => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
            socket.send(JSON.stringify(payload));
    }

    return { isConnected, peers, broadcastCursor, broadcastEvent  };

// 1. takes the roomId
// 2. list of remote users(name id color and cursior coordinates)

}


// Build like a modal like t he YT share one that helps select
//  perimisons for the type of shring of llink
//  to dtermine ehat the user can do and invitations.