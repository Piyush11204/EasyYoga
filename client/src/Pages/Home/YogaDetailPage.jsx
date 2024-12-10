import React, { useState, useRef, useEffect } from 'react';
import { 
    Heart, Award, List, Apple, ArrowLeft, Camera, Play, Square, 
    CheckCircle, AlertCircle, RefreshCw, Clock, Users, BookOpen,
    Calendar, Star , ChevronRight,
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import yogaData from './yogaData.json';

const YogaDetailPage = () => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [stream, setStream] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [notification, setNotification] = useState(null);
    
    const { id } = useParams();
    const yoga = yogaData[id];
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const tabsContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const startCamera = async () => {
        try {
            setCameraError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsCameraActive(true);
            showNotification('Camera started successfully');
        } catch (error) {
            console.error('Error accessing camera:', error);
            setCameraError('Failed to access camera. Please ensure camera permissions are granted.');
            showNotification('Failed to access camera', 'error');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
        showNotification('Camera stopped');
    };

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            return canvas.toDataURL('image/jpeg').split(',')[1];
        }
        return null;
    };

const analyzeFrame = async () => {
    if (!isCameraActive) {
        showNotification('Please start the camera first', 'error');
        return;
    }

    setIsAnalyzing(true);

    try {
        const frame = captureFrame();

        if (!frame) {
            setAnalysisResult({ error: 'Failed to capture frame' });
            showNotification('Failed to capture frame', 'error');
            return;
        }

        const response = await axios.post('http://localhost:8080/api/pose/analyze-pose', { frame });
        
        if (response.status === 200 && response.data) {
            setAnalysisResult(response.data);
            showNotification('Pose analysis completed successfully');
        } else {
            setAnalysisResult({ error: 'Unexpected response from server' });
            showNotification('Unexpected response from server', 'error');
        }
        
    } catch (error) {
        console.error('Error analyzing pose:', error);
        setAnalysisResult({ error: 'Failed to analyze pose. Please try again.' });
        showNotification('Failed to analyze pose', 'error');
    } finally {
        setIsAnalyzing(false);
    }
};


    const TabButton = ({ label, tabName, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300
                ${activeTab === tabName 
                    ? 'bg-violet-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white text-violet-600 hover:bg-violet-50'}`}
        >
            <Icon size={20} className="mr-2" />
            {label}
        </button>
    );

    return (
        <div className="bg-gradient-to-br from-violet-50 to-purple-100 min-h-screen">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-500 z-50
                    ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    <div className="flex items-center">
                        {notification.type === 'error' ? 
                            <AlertCircle className="mr-2" /> : 
                            <CheckCircle className="mr-2" />}
                        {notification.message}
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center text-violet-600 hover:text-violet-800 transition-colors">
                        <ArrowLeft className="mr-2" size={24} />
                        <span className="text-lg font-semibold">Back to All Styles</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Hero Section */}
                    <div className="relative h-96">
                        <img 
                            src={yoga.image} 
                            alt={yoga.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h1 className="text-5xl font-bold text-white mb-2">{yoga.name}</h1>
                            <p className="text-violet-200 text-lg max-w-2xl">{yoga.description}</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <style jsx>{`
                            .hide-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                            .hide-scrollbar {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                    <div className="flex gap-4 p-6 bg-violet-50">
                        <TabButton label="Overview" tabName="overview" icon={List} />
                        <TabButton label="Practice" tabName="practice" icon={Camera} />
                        <TabButton label="Benefits" tabName="benefits" icon={Heart} />
                        <TabButton label="Food Guide" tabName="food" icon={Apple} />
                        <TabButton label="Schedule" tabName="schedule" icon={Calendar} />
                            <TabButton label="Reviews" tabName="reviews" icon={Star} />
                            <TabButton label="Resources" tabName="resources" icon={BookOpen} />
                    </div>
                    <button 
                        onClick={() => {
                            if (tabsContainerRef.current) {
                                tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                            }
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-2 
                            bg-gradient-to-l from-violet-50 to-transparent z-10 flex items-center md:hidden"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6 text-violet-600" />
                    </button>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-3xl font-bold text-violet-800 mb-6">Step-by-Step Guide</h2>
                                    <div className="grid gap-6">
                                        {yoga.steps.map((step, index) => (
                                            <div key={index} className="flex items-start bg-violet-50 p-6 rounded-xl">
                                                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </span>
                                                <p className="ml-4 text-lg">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'practice' && (
                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-black">
                                        <video
                                            ref={videoRef}
                                            className="w-full h-[600px] object-cover"
                                            autoPlay
                                            playsInline
                                        />
                                        <canvas ref={canvasRef} className="hidden" />
                                        
                                        {!isCameraActive && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-violet-900/50">
                                                <button
                                                    onClick={startCamera}
                                                    className="bg-violet-600 text-white px-8 py-4 rounded-lg flex items-center hover:bg-violet-700 transition-colors"
                                                >
                                                    <Camera className="mr-2" />
                                                    Start Camera
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    {isCameraActive && (
                                        <>
                                            <button
                                                onClick={stopCamera}
                                                className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-red-600 transition-colors"
                                            >
                                                <Square className="mr-2" />
                                                Stop Camera
                                            </button>
                                            <button
                                                onClick={analyzeFrame}
                                                disabled={isAnalyzing}
                                                className={`bg-violet-600 text-white px-6 py-3 rounded-lg flex items-center
                                                    ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-700'}
                                                    transition-colors`}
                                            >
                                                {isAnalyzing ? (
                                                    <RefreshCw className="mr-2 animate-spin" />
                                                ) : (
                                                    <Play className="mr-2" />
                                                )}
                                                {isAnalyzing ? 'Analyzing...' : 'Analyze Pose'}
                                            </button>
                                        </>
                                    )}
                                </div>

                                {analysisResult && (
                                    <div className="mt-8 p-6 bg-violet-50 rounded-xl">
                                        <h3 className="text-2xl font-bold text-violet-800 mb-4">Analysis Result</h3>
                                        {analysisResult.error ? (
                                            <div className="text-red-500 flex items-center">
                                                <AlertCircle className="mr-2" />
                                                {analysisResult.error}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="text-lg">{analysisResult.poseAnalysis}</p>
                                                {analysisResult.processedFrame && (
                                                    <img
                                                        src={`data:image/jpeg;base64,${analysisResult.processedFrame}`}
                                                        alt="Analyzed Pose"
                                                        className="rounded-lg shadow-lg max-w-full"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'benefits' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {yoga.benefits.map((benefit, index) => (
                                    <div key={index} className="bg-violet-50 p-6 rounded-xl">
                                        <div className="flex items-start">
                                            <Award className="text-violet-600 mr-3 flex-shrink-0" size={24} />
                                            <p className="text-lg">{benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'food' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-violet-800 mb-6">Recommended Food Routine</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {yoga.foodRoutine.map((item, index) => (
                                        <div key={index} className="bg-violet-50 p-6 rounded-xl">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-violet-600 rounded-full mr-3" />
                                                <p className="text-lg">{item}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                         {activeTab === 'schedule' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-violet-800 mb-6">Weekly Schedule</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {['Monday', 'Wednesday', 'Friday'].map((day) => (
                                        <div key={day} className="bg-violet-50 p-6 rounded-xl">
                                            <h3 className="text-xl font-semibold mb-3">{day}</h3>
                                            <div className="flex items-center mb-2">
                                                <Clock size={18} className="mr-2 text-violet-600" />
                                                <span>6:00 AM - 7:30 AM</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users size={18} className="mr-2 text-violet-600" />
                                                <span>Max 12 participants</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-violet-800 mb-6">Student Reviews</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { name: "Sarah M.", rating: 5, comment: "Amazing practice session! Really helped with my flexibility." },
                                        { name: "John D.", rating: 4, comment: "Great instructor and peaceful environment." }
                                    ].map((review, index) => (
                                        <div key={index} className="bg-violet-50 p-6 rounded-xl">
                                            <div className="flex items-center mb-3">
                                                <h3 className="font-semibold mr-3">{review.name}</h3>
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-violet-800 mb-6">Learning Resources</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { title: "Beginner's Guide", type: "PDF", size: "2.3 MB" },
                                        { title: "Breathing Techniques", type: "Video", size: "15 MB" },
                                        { title: "Pose Reference", type: "Images", size: "5.1 MB" }
                                    ].map((resource, index) => (
                                        <div key={index} className="bg-violet-50 p-6 rounded-xl">
                                            <h3 className="font-semibold mb-2">{resource.title}</h3>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>{resource.type}</span>
                                                <span>{resource.size}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YogaDetailPage;