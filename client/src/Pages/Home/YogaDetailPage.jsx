import React, { useState } from 'react';
import { 
    Heart, Award, List, Apple, ArrowLeft, Camera, Play, Square, 
    CheckCircle, AlertCircle, RefreshCw, Clock, Users, BookOpen,
    Calendar, Star, ChevronRight,
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import yogaData from './yogaData.json';

const YogaDetailPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [notification, setNotification] = useState(null);
    const { id } = useParams();
    const yoga = yogaData[id];
    const navigate = useNavigate();
    const tabsContainerRef = React.useRef(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handlePoseDetection = () => {
        navigate('/yoga-detection'); // Updated to match the route path
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
                    <div className="flex gap-4 p-6 bg-violet-50" ref={tabsContainerRef}>
                        <TabButton label="Overview" tabName="overview" icon={List} />
                        <TabButton label="Practice" tabName="practice" icon={Camera} />
                        <TabButton label="Benefits" tabName="benefits" icon={Heart} />
                        <TabButton label="Food Guide" tabName="food" icon={Apple} />
                        <TabButton label="Schedule" tabName="schedule" icon={Calendar} />
                        <TabButton label="Reviews" tabName="reviews" icon={Star} />
                        <TabButton label="Resources" tabName="resources" icon={BookOpen} />
                    </div>

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
                            <div className="flex flex-col items-center justify-center space-y-6">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-violet-800 mb-4">Ready to Practice?</h2>
                                    <p className="text-lg text-gray-600 mb-8">Start your yoga session with real-time pose detection</p>
                                    <button
                                        onClick={handlePoseDetection}
                                        className="bg-violet-600 text-white px-8 py-4 rounded-lg flex items-center hover:bg-violet-700 transition-colors mx-auto"
                                    >
                                        <Camera className="mr-2" />
                                        Go to Pose Detection
                                    </button>
                                </div>
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
