// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import Peer from 'simple-peer';
// import io from 'socket.io-client';
// import { Video, Mic, MicOff, VideoOff, PhoneOff, Copy, Check } from 'lucide-react';

// // Create socket connection outside component to prevent reconnection on re-renders
// let socket;
// if (typeof window !== 'undefined') {  // Check if we're in the browser
//   socket = io('http://localhost:8080', {
//     withCredentials: true,
//     transports: ['websocket'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000
//   });
// }

// const VideoCall = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [error, setError] = useState(null);
//   const [roomId, setRoomId] = useState('');
//   const [isHost, setIsHost] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [peer, setPeer] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const localVideoRef = useRef();
//   const remoteVideoRef = useRef();
//   const socketRef = useRef(socket);
//   const peerRef = useRef();

//   const cleanup = useCallback(() => {
//     if (localStream) {
//       localStream.getTracks().forEach(track => {
//         track.stop();
//       });
//     }
//     if (peerRef.current) {
//       peerRef.current.destroy();
//     }
//     if (roomId) {
//       socketRef.current?.emit('leave-room', { roomId });
//     }
//     setRemoteStream(null);
//     setIsConnected(false);
//     setRoomId('');
//     setIsHost(false);
//     setPeer(null);
//     peerRef.current = null;
//   }, [localStream, roomId]);

//   const initializeStream = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//       });
      
//       setLocalStream(stream);
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }
//       setIsInitialized(true);
//     } catch (err) {
//       console.error('Media stream error:', err);
//       setError('Failed to access camera and microphone. Please ensure they are connected and you have given permission to use them.');
//     }
//   }, []);

//   const createPeer = useCallback((stream, initiator = false) => {
//     try {
//       const newPeer = new Peer({
//         initiator,
//         stream,
//         trickle: false,
//         config: {
//           iceServers: [
//             { urls: 'stun:stun.l.google.com:19302' },
//             { urls: 'stun:global.stun.twilio.com:3478' }
//           ]
//         }
//       });

//       newPeer.on('signal', signal => {
//         socketRef.current?.emit('signal', {
//           roomId,
//           signalData: signal
//         });
//       });

//       newPeer.on('stream', remoteStream => {
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = remoteStream;
//           setRemoteStream(remoteStream);
//           setIsConnected(true);
//         }
//       });

//       newPeer.on('error', err => {
//         console.error('Peer error:', err);
//         setError('Connection error occurred');
//       });

//       newPeer.on('close', () => {
//         console.log('Peer connection closed');
//         cleanup();
//       });

//       peerRef.current = newPeer;
//       setPeer(newPeer);
//       return newPeer;
//     } catch (err) {
//       console.error('Error creating peer:', err);
//       setError('Failed to establish connection');
//       return null;
//     }
//   }, [cleanup, roomId]);

//   useEffect(() => {
//     if (!isInitialized && typeof window !== 'undefined') {
//       initializeStream();
//     }

//     return () => {
//       cleanup();
//     };
//   }, [isInitialized, initializeStream, cleanup]);

//   useEffect(() => {
//     if (!isInitialized || !socketRef.current) return;

//     const handleRoomCreated = ({ roomCode }) => {
//       setRoomId(roomCode);
//       setIsHost(true);
//     };

//     const handleRoomJoined = () => {
//       if (!isHost && localStream) {
//         createPeer(localStream, true);
//       }
//     };

//     const handleUserJoined = () => {
//       if (isHost && localStream) {
//         createPeer(localStream, false);
//       }
//     };

//     const handleSignal = ({ signalData }) => {
//       if (peerRef.current && !peerRef.current.destroyed) {
//         peerRef.current.signal(signalData);
//       }
//     };

//     const handleRoomError = ({ message }) => {
//       setError(message);
//       cleanup();
//     };

//     const handleUserLeft = () => {
//       cleanup();
//     };

//     socketRef.current.on('room-created', handleRoomCreated);
//     socketRef.current.on('room-joined', handleRoomJoined);
//     socketRef.current.on('user-joined', handleUserJoined);
//     socketRef.current.on('signal', handleSignal);
//     socketRef.current.on('room-error', handleRoomError);
//     socketRef.current.on('user-left', handleUserLeft);

//     return () => {
//       socketRef.current?.off('room-created', handleRoomCreated);
//       socketRef.current?.off('room-joined', handleRoomJoined);
//       socketRef.current?.off('user-joined', handleUserJoined);
//       socketRef.current?.off('signal', handleSignal);
//       socketRef.current?.off('room-error', handleRoomError);
//       socketRef.current?.off('user-left', handleUserLeft);
//     };
//   }, [isInitialized, createPeer, cleanup, isHost, localStream]);

//   const createRoom = useCallback((e) => {
//     e?.preventDefault();
//     if (!localStream) {
//       setError('Please ensure camera access is granted');
//       return;
//     }
//     socketRef.current?.emit('create-room');
//   }, [localStream]);

//   const joinRoom = useCallback((e) => {
//     e?.preventDefault();
//     if (!localStream || !roomId) {
//       setError('Please ensure camera access and enter room ID');
//       return;
//     }
//     socketRef.current?.emit('join-room', { roomCode: roomId });
//   }, [localStream, roomId]);

//   const copyRoomId = (e) => {
//     e.preventDefault();
//     navigator.clipboard.writeText(roomId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const toggleMute = (e) => {
//     e.preventDefault();
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsMuted(!audioTrack.enabled);
//       }
//     }
//   };

//   const toggleVideo = (e) => {
//     e.preventDefault();
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoOn(videoTrack.enabled);
//       }
//     }
//   };

//   const endCall = (e) => {
//     e.preventDefault();
//     cleanup();
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       <header className="bg-gray-800 text-white p-4">
//         <div className="container mx-auto">
//           <h1 className="text-xl font-bold">Video Chat</h1>
//           {roomId && (
//             <div className="flex items-center gap-2 mt-2">
//               <p className="text-sm">Room ID: {roomId}</p>
//               <button
//                 onClick={copyRoomId}
//                 className="p-1 hover:bg-gray-700 rounded"
//                 title={copied ? 'Copied!' : 'Copy Room ID'}
//               >
//                 {copied ? <Check size={16} /> : <Copy size={16} />}
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="flex-grow container mx-auto p-4">
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//             <span className="block sm:inline">{error}</span>
//             <button 
//               className="absolute top-0 right-0 px-4 py-3"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setError(null);
//               }}
//             >
//               ×
//             </button>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               playsInline
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
//               You {isMuted && '(Muted)'} {!isVideoOn && '(Video Off)'}
//             </div>
//           </div>

//           <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
//             <video
//               ref={remoteVideoRef}
//               autoPlay
//               playsInline
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
//               Remote {isConnected ? 'Connected' : 'Waiting...'}
//             </div>
//           </div>
//         </div>

//         {!isConnected && (
//           <div className="flex flex-col space-y-4 items-center mb-4">
//             <div className="flex gap-4">
//               <button
//                 onClick={createRoom}
//                 className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
//               >
//                 Create Room
//               </button>
//               <span className="text-gray-500 self-center">or</span>
//               <form onSubmit={joinRoom} className="flex gap-2">
//                 <input
//                   type="text"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                   placeholder="Enter Room ID"
//                   className="border rounded px-4 py-2"
//                 />
//                 <button
//                   type="submit"
//                   className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
//                 >
//                   Join Room
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </main>

//       <footer className="bg-gray-800 text-white p-4">
//         <div className="container mx-auto flex justify-center items-center space-x-4">
//           <button
//             onClick={toggleMute}
//             className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'}`}
//           >
//             {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
//           </button>
//           <button
//             onClick={toggleVideo}
//             className={`p-3 rounded-full ${!isVideoOn ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'}`}
//           >
//             {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
//           </button>
//           <button
//             onClick={endCall}
//             className="p-3 rounded-full bg-red-500 hover:bg-red-600"
//           >
//             <PhoneOff size={24} />
//           </button>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default VideoCall;