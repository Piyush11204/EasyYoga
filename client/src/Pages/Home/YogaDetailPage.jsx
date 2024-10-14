import React, { useState, useRef, useEffect } from 'react';
import { Heart, Award, List, Apple, ArrowLeft, Camera } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import yogaData from './yogaData.json';

const YogaDetailPage = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { id } = useParams();
    const yoga = yogaData[id];
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate(); // Initialize navigate here

    useEffect(() => {
        if (isAnalyzing) {
            startVideoStream();
        } else {
            stopVideoStream();
        }

        // Cleanup function to stop the video stream on unmount
        return () => {
            stopVideoStream();
        };
    }, [isAnalyzing]);

    const startVideoStream = async () => {
        if (videoRef.current) {  // Check if videoRef is valid
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                requestAnimationFrame(analyzeFrame);
            } catch (err) {
                console.error("Error accessing the camera", err);
            }
        } else {
            console.error("Video reference is not set");
        }
    };

    const stopVideoStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null; // Clear the srcObject
        }
    };

    const analyzeFrame = async () => {
        if (videoRef.current && canvasRef.current && isAnalyzing) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            const frame = canvasRef.current.toDataURL('image/jpeg').split(',')[1];

            try {
                const response = await fetch('http://localhost:3000/analyze-pose', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ frame }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const img = new Image();
                img.onload = () => {
                    context.drawImage(img, 0, 0);
                };
                img.src = `data:image/jpeg;base64,${data.processedFrame}`;
            } catch (error) {
                console.error('Error:', error);
            }

            requestAnimationFrame(analyzeFrame);
        }
    };

    const handleStartAnalysis = () => {
        setIsAnalyzing(prev => !prev);
    };

    return (
        <div className="bg-violet-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <Link to="/" className="inline-flex items-center text-violet-600 hover:text-violet-800 mb-6">
                    <ArrowLeft className="mr-2" size={20} />
                    Back to All Styles
                </Link>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src={yoga.image} alt={yoga.name} className="w-full h-64 object-cover" />
                        <div className="absolute inset-0 bg-violet-900 opacity-50"></div>
                        <h1 className="absolute bottom-4 left-4 text-4xl font-bold text-white">{yoga.name}</h1>
                    </div>
                    <div className="bg-violet-50 min-h-screen flex flex-col items-center justify-center">
                        <h1 className="text-3xl font-bold mb-6">Pose Analysis</h1>
                        <video ref={videoRef} className="w-full max-w-md" autoPlay />
                        <canvas ref={canvasRef} className="hidden" width="640" height="480" />
                        <button onClick={handleStartAnalysis} className={`mt-4 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                        </button>
                        <button onClick={() => navigate(-1)} className="mt-4 text-violet-600 underline">Back</button>
                    </div>
                    <div className="p-6">
                        <section className="mb-8">
                            <p className="text-lg text-gray-700 leading-relaxed">{yoga.description}</p>
                        </section>
                        <button
                            onClick={handleStartAnalysis}
                            disabled={isAnalyzing}
                            className={`mb-8 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded flex items-center ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Camera className="mr-2" size={20} />
                            {isAnalyzing ? "Analyzing..." : "Start Pose Analysis"}
                        </button>
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-violet-800 flex items-center">
                                <Heart className="mr-2" size={24} />
                                Benefits
                            </h2>
                            <div className="bg-violet-100 rounded-lg p-4">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {yoga.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start">
                                            <Award className="mr-2 text-violet-500 flex-shrink-0" size={20} />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-violet-800 flex items-center">
                                <List className="mr-2" size={24} />
                                Step-by-Step Guide
                            </h2>
                            <div className="bg-violet-50 rounded-lg p-4">
                                <ol className="space-y-4">
                                    {yoga.steps.map((step, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="bg-violet-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3">{index + 1}</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-violet-800 flex items-center">
                                <Apple className="mr-2" size={24} />
                                Recommended Food Routine
                            </h2>
                            <div className="bg-violet-100 rounded-lg p-4">
                                <ul className="space-y-2">
                                    {yoga.foodRoutine.map((item, index) => (
                                        <li key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YogaDetailPage;
