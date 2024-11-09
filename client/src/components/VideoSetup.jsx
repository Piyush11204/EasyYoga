import React, { useState, useEffect } from "react";
import { Camera, Mic, Video, VideoOff, MicOff, User } from "lucide-react";

const VideoSetup = ({ setName, setDeviceOptions, startCall }) => {
  const [userName, setUserName] = useState("");
  const [devices, setDevices] = useState({ cameras: [], microphones: [] });
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableAudio, setEnableAudio] = useState(true);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const cameras = deviceInfos.filter(device => device.kind === "videoinput");
      const microphones = deviceInfos.filter(device => device.kind === "audioinput");
      setDevices({ cameras, microphones });
      if (cameras.length) setSelectedCamera(cameras[0].deviceId);
      if (microphones.length) setSelectedMicrophone(microphones[0].deviceId);
    });
  }, []);

  useEffect(() => {
    if (enableVideo && selectedCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: { deviceId: selectedCamera } })
        .then(stream => {
          setVideoStream(stream);
        })
        .catch(err => console.error("Error accessing camera:", err));

      return () => {
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
        }
      };
    } else {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
    }
  }, [enableVideo, selectedCamera]);

  const handleStart = () => {
    setName(userName);
    setDeviceOptions({
      video: enableVideo ? { deviceId: selectedCamera } : false,
      audio: enableAudio ? { deviceId: selectedMicrophone } : false
    });
    startCall();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Video Preview */}
        <div className="space-y-4">
            <h2 className="text-3xl font-bold">VideoCall Preview</h2>
           
          <div className="aspect-video bg-gray-800/50 backdrop-blur rounded-lg overflow-hidden relative">
            {enableVideo ? (
              <video
                ref={video => {
                  if (video && videoStream) {
                    video.srcObject = videoStream;
                    video.play();
                  }
                }}
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <VideoOff className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={() => setEnableVideo(!enableVideo)}
                className={`p-3 rounded-full ${
                  enableVideo ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {enableVideo ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={() => setEnableAudio(!enableAudio)}
                className={`p-3 rounded-full ${
                  enableAudio ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {enableAudio ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Settings */}
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold">Join Video Call</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-gray-200 block">Your Name</label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 text-white pl-10 p-3 rounded-lg w-full"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {enableVideo && (
              <div className="space-y-2">
                <label className="text-gray-200 block">Camera</label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 text-white w-full p-3 rounded-lg"
                >
                  {devices.cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || "Camera"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {enableAudio && (
              <div className="space-y-2">
                <label className="text-gray-200 block">Microphone</label>
                <select
                  value={selectedMicrophone}
                  onChange={(e) => setSelectedMicrophone(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 text-white w-full p-3 rounded-lg"
                >
                  {devices.microphones.map((mic) => (
                    <option key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || "Microphone"}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={!userName}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Camera className="w-5 h-5 mr-2" />
            Join Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSetup;