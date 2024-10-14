import React, { useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Camera, CameraOff } from 'lucide-react';

const VideoCall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [peer, setPeer] = useState(null);
  const [error, setError] = useState(null);
  const [peerCode, setPeerCode] = useState('');
  const [remotePeerCode, setRemotePeerCode] = useState(''); // To hold the remote peer code for connection

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    startLocalStream();
    return () => {
      endCall(); // Clean up on component unmount
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize peer after local stream starts
      initializePeer(stream);
    } catch (err) {
      handleMediaError(err);
    }
  };

  const handleMediaError = (err) => {
    console.error('Error accessing media devices:', err);
    setError('Failed to access camera and microphone. Please ensure they are connected and you have given permission to use them.');
  };

  const initializePeer = (stream) => {
    const newPeer = new Peer({
      initiator: window.location.hash === '#init',
      trickle: false,
      stream: stream,
    });

    newPeer.on('signal', data => {
      // Send the signal data (peer code) to the other peer (this could be done via a server or any signaling mechanism)
      console.log('Signal data (send this to the other peer):', JSON.stringify(data));
    });

    newPeer.on('stream', stream => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    newPeer.on('error', err => {
      console.error('Peer error:', err);
      setError('An error occurred during the connection.');
    });

    setPeer(newPeer);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled; // Toggle the audio track
        setIsMuted(!audioTrack.enabled); // Update mute state
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; // Toggle the video track
        setIsVideoOn(videoTrack.enabled); // Update video state
      }
    }
  };

  const endCall = () => {
    if (peer) {
      peer.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  const generatePeerCode = () => {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPeerCode(code);
    console.log(`Generated peer code: ${code}`);
  };

  const connectPeer = () => {
    if (remotePeerCode) {
      // Assuming remotePeerCode is received from another user through some signaling
      console.log(`Connecting to peer with code: ${remotePeerCode}`);
      
      // Signal the connection to the other peer
      peer.signal(remotePeerCode);
    } else {
      setError('Please enter a valid peer code to connect.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow flex flex-col md:flex-row justify-center items-center p-4 space-y-4 md:space-y-0 md:space-x-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="w-full md:w-1/2 aspect-w-16 aspect-h-9">
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            {localStream ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <CameraOff size={48} className="text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              You
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 aspect-w-16 aspect-h-9">
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            {remoteStream ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera size={48} className="text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              Remote User
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4">
        <div className="flex flex-wrap justify-center items-center space-x-2 space-y-2">
          <button onClick={toggleMute} className={`p-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'}`}>
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button onClick={toggleVideo} className={`p-2 rounded-full ${!isVideoOn ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-700'}`}>
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button onClick={endCall} className="p-2 rounded-full bg-red-500 hover:bg-red-600">
            <PhoneOff size={24} />
          </button>
          <button onClick={generatePeerCode} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
            Generate Peer Code
          </button>
          {peerCode && (
            <div className="mt-4">
              <input
                type="text"
                value={peerCode}
                readOnly
                className="bg-gray-200 text-gray-800 p-2 rounded"
                placeholder="Share this peer code"
              />
              <div className="flex flex-col mt-2">
                <input
                  type="text"
                  value={remotePeerCode}
                  onChange={(e) => setRemotePeerCode(e.target.value)}
                  className="bg-gray-200 text-gray-800 p-2 rounded mb-2"
                  placeholder="Enter peer code to connect"
                />
                <button onClick={connectPeer} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded">
                  Connect to Peer
                </button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default VideoCall;
