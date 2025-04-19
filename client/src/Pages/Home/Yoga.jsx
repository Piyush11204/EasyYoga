import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import { count } from '../../utils/music';
import Instructions from '../../components/Instructions/Instructions';
import { poseImages } from '../../utils/pose_images';
import { POINTS, keypointConnections } from '../../utils/data';
import { drawPoint, drawSegment } from '../../utils/helper';

let skeletonColor = 'rgb(255,255,255)';
let interval;
let flag = false;
let detector;
let poseClassifier;
let countAudio;

function Yoga() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState(
    location.state?.selectedPose || 'Tree'
  );
  const [isStartPose, setIsStartPose] = useState(false);

  // Fixed useEffect dependencies
  const updatePoseTime = useCallback(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) {
      setPoseTime(timeDiff);
    }
    if (timeDiff > bestPerform) {
      setBestPerform(timeDiff);
    }
  }, [currentTime, startingTime, bestPerform]);

  useEffect(() => {
    updatePoseTime();
  }, [currentTime, updatePoseTime]);

  useEffect(() => {
    if (location.state?.selectedPose) {
      setCurrentPose(location.state.selectedPose);
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  useEffect(() => {
    const loadTensorFlow = async () => {
      try {
        await tf.ready();
        setLoading(false);
      } catch (error) {
        console.error("Error loading TensorFlow:", error);
      }
    };
    
    loadTensorFlow();
    
    return () => {
      // Clean up TensorFlow memory when component unmounts
      try {
        tf.disposeVariables();
      } catch (error) {
        console.error("Error disposing TensorFlow variables:", error);
      }
    };
  }, []);

  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
  };

  const get_center_point = (landmarks, left_bodypart, right_bodypart) => {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
    return center;
  };

  const get_pose_size = (landmarks, torso_size_multiplier = 2.5) => {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    let shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center_new = tf.expandDims(pose_center_new, 1);
    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d, 'euclidean', 0));
    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
    return pose_size;
  };

  const normalize_pose_landmarks = (landmarks) => {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, pose_center);
    let pose_size = get_pose_size(landmarks);
    landmarks = tf.div(landmarks, pose_size);
    return landmarks;
  };

  const landmarks_to_embedding = (landmarks) => {
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    let embedding = tf.reshape(landmarks, [1, 34]);
    return embedding;
  };

  // Using a safe tensor disposal pattern
  const safeTensorOperation = (tensorFn) => {
    try {
      return tensorFn();
    } catch (error) {
      console.error("Tensor operation error:", error);
      return null;
    } finally {
      // Clean up intermediate tensors
      tf.engine().endScope();
    }
  };

  const detectPose = async () => {
    if (!detector || !poseClassifier) return;
    
    try {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        let notDetected = 0;
        const video = webcamRef.current.video;
        
        // Start tensor scope to manage memory
        tf.engine().startScope();
        
        const pose = await detector.estimatePoses(video);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const keypoints = pose[0]?.keypoints || [];
        let input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)');
              let connections = keypointConnections[keypoint.name];
              try {
                connections?.forEach((connection) => {
                  let conName = connection.toUpperCase();
                  drawSegment(
                    ctx, 
                    [keypoint.x, keypoint.y],
                    [keypoints[POINTS[conName]]?.x, keypoints[POINTS[conName]]?.y],
                    skeletonColor
                  );
                });
              } catch (err) {
                console.error(err);
              }
            }
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });

        if (notDetected > 4 || input.length === 0) {
          skeletonColor = 'rgb(255,255,255)';
          tf.engine().endScope(); // End tensor scope if early return
          return;
        }

        // Use the safe tensor operation pattern
        const processedInput = safeTensorOperation(() => landmarks_to_embedding(input));
        if (!processedInput) return;
        
        const classification = poseClassifier.predict(processedInput);

        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          if (data[0]?.[classNo] > 0.97) {
            if (!flag) {
              countAudio.play().catch(e => console.error("Audio play error:", e));
              setStartingTime(Date.now());
              flag = true;
            }
            setCurrentTime(Date.now());
            skeletonColor = 'rgb(0,255,0)';
          } else {
            flag = false;
            skeletonColor = 'rgb(255,255,255)';
            if (countAudio) {
              countAudio.pause();
              countAudio.currentTime = 0;
            }
          }
          
          // Dispose of the tensor after use
          classification.dispose();
        }).catch(err => {
          console.error("Classification error:", err);
        });
      }
    } catch (err) {
      console.error("Pose detection error:", err);
    } finally {
      // Always end the tensor scope to prevent memory leaks
      tf.engine().endScope();
    }
  };

  const runMovenet = async () => {
    try {
      await tf.ready();
      tf.engine().startScope();
      
      // Create detector once and reuse
      const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
      detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
      
      // Load model once and reuse
      poseClassifier = await tf.loadLayersModel('https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json');
      
      // Create audio once and reuse
      countAudio = new Audio(count);
      countAudio.loop = true;
      
      tf.engine().endScope();
      
      interval = setInterval(() => {
        detectPose();
      }, 100);
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  const startYoga = async () => {
    setIsStartPose(true);
    await runMovenet();
  };

  const stopPose = () => {
    setIsStartPose(false);
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    
    // Clean up resources
    if (countAudio) {
      countAudio.pause();
      countAudio.currentTime = 0;
    }
    
    // Clean up TensorFlow resources
    if (poseClassifier) {
      try {
        poseClassifier.dispose();
      } catch (error) {
        console.error("Error disposing classifier:", error);
      }
    }
    
    detector = null;
    poseClassifier = null;
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      
      if (countAudio) {
        countAudio.pause();
        countAudio = null;
      }
      
      // Clean up TensorFlow resources
      if (poseClassifier) {
        try {
          poseClassifier.dispose();
          detector = null;
          poseClassifier = null;
        } catch (error) {
          console.error("Error disposing resources on unmount:", error);
        }
      }
      
      // Clean up TensorFlow memory
      try {
        tf.engine().endScope();
        tf.engine().disposeVariables();
      } catch (error) {
        console.error("Error cleaning up TensorFlow memory:", error);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-700">
        <div className="p-10 bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 border-solid rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Preparing Your Yoga Experience
            </h2>
            <p className="text-gray-600 text-center">
              Loading pose detection models... Please wait while we set up your personalized yoga session.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isStartPose) {
    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-violet-900 text-white">
        {/* Top Stats Bar */}
        <div className="w-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg fixed top-0 z-50 py-3 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold">{currentPose} Pose</span>
              <div className={`h-3 w-3 rounded-full ${skeletonColor === 'rgb(0,255,0)' ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`}></div>
              <span className="text-sm font-medium hidden md:inline">
                {skeletonColor === 'rgb(0,255,0)' ? 'Perfect form!' : 'Adjust your pose'}
              </span>
            </div>
            
            <div className="flex space-x-4 md:space-x-8">
              <div className="text-center">
                <p className="text-xs text-gray-300 uppercase tracking-wide">Current</p>
                <p className="text-2xl font-bold">{poseTime.toFixed(1)}s</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-300 uppercase tracking-wide">Best</p>
                <p className="text-2xl font-bold text-green-400">{bestPerform.toFixed(1)}s</p>
              </div>
              <button
                onClick={stopPose}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                <span>END</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto  pt-20 flex flex-col md:flex-row md:space-x-4 mb-4">
          {/* Camera Feed (Main) */}
          <div className="w-full md:w-3/4 relative mb-4 md:mb-0">
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-video">
                <Webcam
                  width="100%"
                  height="100%"
                  id="webcam"
                  ref={webcamRef}
                  className="rounded-2xl"
                  style={{ 
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                />
                <canvas
                  ref={canvasRef}
                  id="my-canvas"
                  width="640"
                  height="480"
                  className="absolute top-0 left-0 w-full h-full z-10"
                />
                
                {/* Live Feedback Badge */}
                <div className="absolute bottom-6 left-6 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${skeletonColor === 'rgb(0,255,0)' ? 'bg-green-400' : 'bg-orange-400'} animate-pulse`}></div>
                  <span className="font-medium text-sm">
                    {skeletonColor === 'rgb(0,255,0)' ? 'Perfect Form!' : 'Adjust Your Pose'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-full md:w-1/4">
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
              {/* Reference Image */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Reference Pose
                </h3>
                <div className="bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-xl p-1">
                  <img
                    src={poseImages[currentPose]}
                    alt={`${currentPose} pose reference`}
                    className="w-full object-contain rounded-lg"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>
              
             
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-900 via-purple-800 to-violet-900 text-white">
      {/* Header */}
      <header className="w-full py-6 pt-32 bg-black bg-opacity-30 backdrop-filter backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">{currentPose} Yoga Practice</h1>
          <p className="text-center text-purple-200 mt-2">Master your yoga form with AI-powered feedback and guidance</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto  py-8">
        {/* Hero Section */}
        <div className="w-full bg-black bg-opacity-30 backdrop-filter backdrop-blur-md rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative">
              <img
                src={poseImages[currentPose]}
                alt={`${currentPose} pose`}
                className="w-full h-full object-cover"
                style={{ minHeight: '500px', maxHeight: '600px' }}
              />
              
              {/* Difficulty Badge */}
              <div className="absolute top-6 left-6 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-full px-4 py-2">
                <div className="flex items-center space-x-2">
                  <span className="uppercase text-xs font-bold tracking-wider">Difficulty:</span>
                  <div className="flex">
                    {[...Array(
                      currentPose === 'Tree' || currentPose === 'Chair' || currentPose === 'Cobra' ? 2 : 
                      currentPose === 'Dog' || currentPose === 'Warrior' ? 3 : 
                      5
                    )].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="w-full lg:w-1/2 p-8">
              <h2 className="text-3xl font-bold mb-6">{currentPose} Pose</h2>
              
              {/* How to Perform */}
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  How to Perform
                </h3>
                <div className="bg-white/10 backdrop-filter backdrop-blur-sm rounded-xl">
                  <Instructions currentPose={currentPose} />
                </div>
              </div>
              
              {/* Start Button */}
              <button
                onClick={startYoga}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg w-full text-lg transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Start Practice
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-md rounded-xl p-6 text-center shadow-xl">
            <div className="bg-purple-500 bg-opacity-20 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Feedback</h3>
            <p className="text-purple-200">Get instant feedback on your form and posture with advanced AI pose detection.</p>
          </div>
          
          <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-md rounded-xl p-6 text-center shadow-xl">
            <div className="bg-purple-500 bg-opacity-20 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
            <p className="text-purple-200">Monitor your progress and see your best pose hold times as you improve.</p>
          </div>
          
          <div className="bg-black bg-opacity-30 backdrop-filter backdrop-blur-md rounded-xl p-6 text-center shadow-xl">
            <div className="bg-purple-500 bg-opacity-20 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Instructions</h3>
            <p className="text-purple-200">Learn proper techniques with clear, step-by-step instructions for each pose.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black bg-opacity-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-purple-200 text-sm">
            © {new Date().getFullYear()} AI Yoga Assistant. All rights reserved. | Made with 💜 for better wellness.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Yoga;