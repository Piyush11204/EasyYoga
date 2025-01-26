import React, { useEffect, useRef, useState } from "react";
import { Copy, Phone, PhoneOff, Video, User, Camera, CameraOff, Mic, MicOff, Settings, CheckCircle, XCircle, Info } from "lucide-react";
import toast from 'react-hot-toast';
import Peer from "simple-peer";
import io from "socket.io-client";
import VideoSetup from "../components/VideoSetup";

const socket = io.connect('http://localhost:8080');
// const socket = io.connect('https://videocall-metl.onrender.com', {
//     reconnection: true,
//     reconnectionAttempts: 5,
//    reconnectionDelay: 1000,

// });

socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
    // toast.error("Connection error. Please try again.", {
    //     icon: <XCircle className="w-5 h-5 text-red-500" />
    // });
});

const VideoCall = () => {
    const [me, setMe] = useState("");
    const [stream, setStream] = useState();
    const [deviceOptions, setDeviceOptions] = useState({});
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const [showSetup, setShowSetup] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        if (!showSetup) {
            navigator.mediaDevices.getUserMedia(deviceOptions)
                .then((stream) => {
                    setStream(stream);
                    if (myVideo.current) {
                        myVideo.current.srcObject = stream;
                    }
                    toast.success("Camera and microphone connected", {
                        icon: <CheckCircle className="w-5 h-5 text-green-500" />
                    });
                })
                .catch((err) => {
                    toast.error("Failed to access camera or microphone", {
                        icon: <XCircle className="w-5 h-5 text-red-500" />
                    });
                });

            socket.on("me", (id) => {
                setMe(id);
                toast.success("Connected! Your ID is ready to share", {
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />
                });
            });

            socket.on("callUser", (data) => {
                setReceivingCall(true);
                setCaller(data.from);
                setCallerSignal(data.signal);
                toast((t) => (
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        <span>{data.name || 'Someone'} is calling you</span>
                    </div>
                ), { duration: 6000 });
            });
        }
    }, [showSetup, deviceOptions]);

    const startCall = () => {
        setShowSetup(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("ID copied to clipboard!", {
            icon: <Copy className="w-5 h-5 text-green-500" />
        });
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsCameraOn(!isCameraOn);
            toast.success(isCameraOn ? "Camera turned off" : "Camera turned on", {
                icon: isCameraOn ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />
            });
        }
    };

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMicOn(!isMicOn);
            toast.success(isMicOn ? "Microphone muted" : "Microphone unmuted", {
                icon: isMicOn ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />
            });
        }
    };

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            });
            toast.loading("Calling...", {
                icon: <Phone className="w-5 h-5 text-blue-500 animate-pulse" />
            });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
            toast.success("Call connected!", {
                icon: <CheckCircle className="w-5 h-5 text-green-500" />
            });
        });
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
            toast.success("Call accepted!", {
                icon: <CheckCircle className="w-5 h-5 text-green-500" />
            });
        });
        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
            toast.success("Call connected!", {
                icon: <CheckCircle className="w-5 h-5 text-green-500" />
            });
        });
        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        toast.success("Call ended", {
            icon: <PhoneOff className="w-5 h-5 text-red-500" />
        });
    };
    socket.on("me", (id) => {
        setMe(id);
    });
    return showSetup ? (
        <VideoSetup
            setName={setName}
            setDeviceOptions={setDeviceOptions}
            startCall={startCall}
            setIdToCall={setIdToCall}
        />
    ) : (
        <div className="min-h-screen mt-16 bg-gray-900 text-white relative">
           
               
            {/* Main video (other person or placeholder) */}
            <div className="w-full h-screen">
                {callAccepted && !callEnded ? (
                    <video
                        playsInline
                        ref={userVideo}
                        autoPlay
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-800">
                        <Video className="w-24 h-24 text-gray-600" />
                    </div>
                )}
            </div>

            {/* Picture-in-picture (your video) */}
            <div className="absolute left-4 bottom-4 w-64 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                {stream && (
                    <div className="relative">
                        <video
                            playsInline
                            muted
                            ref={myVideo}
                            autoPlay
                            className="w-full aspect-video object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-gray-900/80 px-2 py-1 rounded-full">
                            <div className="flex items-center space-x-2">
                                <User size={14} />
                                <span className="text-sm">{name || 'You'}</span>
                            </div>
                        </div>
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <button
                                onClick={toggleCamera}
                                className={`
                                    p-2.5 rounded-full transition-all duration-200
                                    flex items-center justify-center
                                    shadow-lg hover:shadow-xl
                                    transform hover:scale-105 active:scale-95
                                    ${isCameraOn 
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-400/50' 
                                        : 'bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-400/50'
                                    }
                                    focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    group
                                `}
                                title={isCameraOn ? "Turn off camera" : "Turn on camera"}
                            >
                                {isCameraOn ? (
                                    <Camera 
                                        size={16} 
                                        className="transform transition-transform group-hover:rotate-12" 
                                    />
                                ) : (
                                    <CameraOff 
                                        size={16} 
                                        className="transform transition-transform group-hover:-rotate-12" 
                                    />
                                )}
                            </button>
                            
                            <button
                                onClick={toggleMic}
                                className={`
                                    p-2.5 rounded-full transition-all duration-200
                                    flex items-center justify-center
                                    shadow-lg hover:shadow-xl
                                    transform hover:scale-105 active:scale-95
                                    ${isMicOn 
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-400/50' 
                                        : 'bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-400/50'
                                    }
                                    focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    group
                                `}
                                title={isMicOn ? "Mute microphone" : "Unmute microphone"}
                            >
                                {isMicOn ? (
                                    <Mic 
                                        size={16} 
                                        className="transform transition-transform group-hover:translate-y-0.5" 
                                    />
                                ) : (
                                    <MicOff 
                                        size={16} 
                                        className="transform transition-transform group-hover:-translate-y-0.5" 
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating controls */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-colors"
                >
                    <Settings size={24} />
                </button>
            </div>

            {/* Controls popup */}
            {showControls && (
                <div className="absolute top-20 right-4 w-80 bg-gray-800 rounded-lg p-4 shadow-lg backdrop-blur-sm bg-opacity-90">
                    <div className="space-y-4">
                        {me && (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={me}
                                    readOnly
                                    className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-sm"
                                    placeholder="Your ID"
                                />
                                <button
                                    onClick={() => copyToClipboard(me)}
                                    className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={idToCall}
                                onChange={(e) => setIdToCall(e.target.value)}
                                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-sm"
                                placeholder="Enter ID to call"
                            />
                            <button
                                onClick={() => callUser(idToCall)}
                                className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!idToCall}
                            >
                                <Phone size={20} />
                            </button>
                        </div>

                        {callAccepted && !callEnded && (
                            <button
                                onClick={leaveCall}
                                className="w-full px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                            >
                                <PhoneOff size={20} />
                                <span>End Call</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Incoming call popup */}
            {receivingCall && !callAccepted && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4 animate-in fade-in duration-300">
                        <p className="font-semibold text-lg">Would you like to answer the call❓</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={answerCall}
                                className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Phone size={20} />
                                <span>Answer</span>
                            </button>
                            <button
                                onClick={() => setReceivingCall(false)}
                                className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <XCircle size={20} />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCall;