import { useEffect, useRef, useState } from 'react';
import { ConnectionEntity, NodeEntity, MultiplayerEvent } from '../types/whiteboard';   


export interface RemotePeer {
  userId: string;
  name: string;
  color: string;
  cursor: { x: number; y: number } | null;
}

type IncomingSocketEvents =
    | MultiplayerEvent
    | { type: 'cursor_move'; userId: string; name?: string; color?: string; x: number; y: number }
    | { type: 'user_left'; userId: string };

export function useMultiplayer(roomId: string | undefined, setNodes: React.Dispatch<React.SetStateAction<NodeEntity[]>>,
  setConnections: React.Dispatch<React.SetStateAction<ConnectionEntity[]>>) {
    const [peers, setPeers] = useState<Record<string, RemotePeer>>({});
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    const userProfiles = [
        { color: '#3b82f6', name: 'Falcon' },
        { color: '#a855f7', name: 'Panther' },
        { color: '#10b981', name: 'Wolf' },
        { color: '#f59e0b', name: 'Fox' },
        { color: '#f43f5e', name: 'Hawk' },
        { color: '#06b6d4', name: 'Otter' },

    ];

    const [myUserId] = useState(() => {
        let id = sessionStorage.getItem('canvas_device_id');
        if (!id) {
            id = `user-${crypto.randomUUID().slice(0, 5)}`;
            sessionStorage.setItem('canvas_device_id', id);
        }
        return id;
    });

    const [myProfile] = useState(() => {
        const saved = sessionStorage.getItem('canvas_user_profile');
        if (saved) {
            try {
                return JSON.parse(saved) as { color: string; name: string };
            } catch {}
        }
        const picked = userProfiles[Math.floor(Math.random() * userProfiles.length)];
        sessionStorage.setItem('canvas_user_profile', JSON.stringify(picked));
        return picked;
    });

    useEffect(() => {
        if (!roomId) return;
        let isUnmounted = false;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

        const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
       
        
        function connect() {

        const socket = new WebSocket(`${wsBaseUrl}?room=${roomId}&userId=${myUserId}`);
        socketRef.current = socket;

        // listend to the onConnetion from the server
        socket.onopen = () => {
            console.log(`[Multiplayer] Connected to room: ${roomId}`);
            setIsConnected(true);
        };

        // Listenting to evetns from room members(message) from the server
        socket.onmessage = (event) => {
            try{
                const data = JSON.parse(event.data) as IncomingSocketEvents
                console.log(data)

                switch(data.type) {
                    case "cursor_move": 
                        setPeers((prev) => ({
                            ...prev,
                            [data.userId]: {
                                userId: data.userId,
                                name: data.name || data.userId,
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

                        case('node_updated'):
                            setNodes((prevNodes) =>
                                prevNodes.map((prevNode) => (
                                    prevNode.id === data.nodeId ? {...prevNode, ...data.updates} : prevNode
                            )))
                        break;

                        case('edge_updated'):
                            setConnections((prevConnections) =>
                                prevConnections.map((prevConnection) => (
                                    prevConnection.id === data.edgeId ? {...prevConnection, ...data.updates} : prevConnection
                            )))
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
            if(!isUnmounted) {
                reconnectTimer = setTimeout(connect, 2000);
            }
            
        }}

        connect()


        return () => {
            isUnmounted = true
            if (reconnectTimer) clearTimeout(reconnectTimer);
            socketRef.current?.close();
        socketRef.current = null;
        };
    }, [roomId]);

    const lastCursorSendRef = useRef(0);

    const broadcastCursor = (x: number, y: number) => {
        const now = Date.now();
        if (now - lastCursorSendRef.current < 30) return;
        lastCursorSendRef.current = now;

        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        socket.send(
            JSON.stringify({
                type: 'cursor_move',
                userId: myUserId,
                name: myProfile.name,
                x: Math.round(x),
                y: Math.round(y),
                color: myProfile.color,
            })
        );
    };

    const broadcastEvent = (payload: MultiplayerEvent) => {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify(payload));
    };

    const currentUser = {
        userId: myUserId,
        name: myProfile.name,
        color: myProfile.color,
        isSelf: true,
    };

    return { isConnected, peers, currentUser, broadcastCursor, broadcastEvent };

// 1. takes the roomId
// 2. list of remote users(name id color and cursior coordinates)

}


// Build like a modal like t he YT share one that helps select
//  perimisons for the type of shring of llink
//  to dtermine ehat the user can do and invitations.