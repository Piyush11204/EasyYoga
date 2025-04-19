import React, { useState } from 'react';
import { poseImages } from '../../utils/pose_images';
import { poseInstructions } from '../../utils/data/index';

const Instructions = ({ currentPose }) => {
  const [activeTab, setActiveTab] = useState('instructions');
  
  // Calculate difficulty level based on number of instructions
  const difficultyLevel = poseInstructions[currentPose].length >= 7 ? 3 : 
                         poseInstructions[currentPose].length >= 5 ? 2 : 1;
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto transform transition-all hover:shadow-xl">
      {/* Header with Pose Image */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {currentPose} Pose
          </h1>
          <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
            {poseImages[currentPose] && (
              <img 
                src={poseImages[currentPose]} 
                alt={currentPose} 
                className="h-full w-full object-cover rounded-full"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('instructions')}
          className={`flex-1 py-4 px-6 font-medium text-sm focus:outline-none ${
            activeTab === 'instructions'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Step-by-Step Instructions
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-4 px-6 font-medium text-sm focus:outline-none ${
            activeTab === 'tips'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tips & Benefits
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3 bg-gray-50">
        {activeTab === 'instructions' && (
          <div className="space-y-6">
            <ul className="space-y-5">
              {poseInstructions[currentPose].map((instruction, index) => (
                <li
                  key={index}
                  className="flex items-start group transition-all hover:bg-indigo-50 p-3 rounded-lg"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm mr-4 group-hover:bg-indigo-200 group-hover:text-indigo-700 transition-all">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-1">
                    {instruction}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Pro Tips
              </h3>
              <ul className="space-y-3 text-indigo-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Take deep breaths and maintain proper alignment throughout the pose.
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  If you feel any discomfort, ease out of the pose gently.
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Practice consistently for best results, but avoid forcing your body.
                </li>
              </ul>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Benefits
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <span className="block font-medium text-green-700 mb-1">Improves Flexibility</span>
                  <span className="text-sm text-green-600">Helps increase range of motion in joints</span>
                </li>
                <li className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <span className="block font-medium text-green-700 mb-1">Builds Strength</span>
                  <span className="text-sm text-green-600">Engages core and stabilizing muscles</span>
                </li>
                <li className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <span className="block font-medium text-green-700 mb-1">Reduces Stress</span>
                  <span className="text-sm text-green-600">Encourages mindfulness and deep breathing</span>
                </li>
                <li className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <span className="block font-medium text-green-700 mb-1">Improves Posture</span>
                  <span className="text-sm text-green-600">Strengthens body awareness</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Difficulty & Progress */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <span className="text-sm font-medium text-gray-600 mr-3">
              Difficulty Level:
            </span>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-2 rounded-full ${
                    i < difficultyLevel ? 'bg-indigo-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {difficultyLevel === 1 ? 'Beginner' : difficultyLevel === 2 ? 'Intermediate' : 'Advanced'}
            </span>
          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default Instructions;