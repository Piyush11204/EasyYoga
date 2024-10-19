import React, { useState, useRef, useEffect } from 'react';
import { Heart, Award, List, Apple, ArrowLeft, Camera } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import yogaData from './yogaData.json';
import axios from 'axios';

const YogaDetailPage = () => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { id } = useParams();
    const yoga = yogaData[id];
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            return canvas.toDataURL('image/jpeg').split(',')[1]; // Get base64 data
        }
        return null;
    };

    const analyzeFrame = async () => {
        setIsAnalyzing(true);
        const frame = captureFrame();
        if (frame) {
            try {
                const response = await axios.post('http://localhost:8080/api/pose/analyze-pose', { frame });
                setAnalysisResult(response.data);
            } catch (error) {
                console.error('Error analyzing pose:', error);
                setAnalysisResult({ error: 'Failed to analyze pose' });
            }
        } else {
            setAnalysisResult({ error: 'Failed to capture frame' });
        }
        setIsAnalyzing(false);
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
                        <div className="video-container mb-4">
                            <video ref={videoRef} className="w-full max-w-md" autoPlay playsInline />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                        <button onClick={analyzeFrame} disabled={isAnalyzing} className="mt-4 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded">
                            {isAnalyzing ? "Analyzing..." : "Analyze Pose"}
                        </button>
                        {analysisResult && (
                            <div className="analysis-result mt-4">
                                <h3>Analysis Result:</h3>
                                {analysisResult.error ? (
                                    <p className="error">{analysisResult.error}</p>
                                ) : (
                                    <>
                                        <p>Pose: {analysisResult.poseAnalysis}</p>
                                        <img src={`data:image/jpeg;base64,${analysisResult.processedFrame}`} alt="Analyzed Pose" />
                                    </>
                                )}
                            </div>
                        )}
                        <button onClick={() => navigate(-1)} className="mt-4 text-violet-600 underline">Back</button>
                    </div>
                    <div className="p-6">
                        <section className="mb-8">
                            <p className="text-lg text-gray-700 leading-relaxed">{yoga.description}</p>
                        </section>
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
