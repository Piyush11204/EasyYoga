import React from 'react';
import './Instructions.css'
import { poseImages } from '../../utils/pose_images'
import { poseInstructions } from '../../utils/data/index'

const Instructions = ({ currentPose }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="md:flex">
        {/* Instructions Section */}
        <div className="md:w-2/3 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {currentPose} Pose Instructions
          </h2>
          <ul className="space-y-4">
            {poseInstructions[currentPose].map((instruction, index) => (
              <li 
                key={index} 
                className="flex items-start"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm mr-3 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-600 leading-relaxed">
                  {instruction}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Image Section */}
        <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center">
          <div className="relative aspect-square w-full max-w-sm">
            <img 
              src={poseImages[currentPose]}
              alt={`${currentPose} pose demonstration`}
              className="rounded-lg shadow-md object-contain w-full h-full"
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-black ring-opacity-5"></div>
          </div>
        </div>
      </div>

      {/* Optional Tips Section */}
      <div className="bg-indigo-50 p-6 border-t border-indigo-100">
        <div className="flex items-center space-x-3 mb-3">
          <svg 
            className="w-5 h-5 text-indigo-500" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-lg font-semibold text-indigo-900">Pro Tips</h3>
        </div>
        <p className="text-indigo-700">
          Take deep breaths and maintain proper alignment. If you feel any discomfort, ease out of the pose gently.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Difficulty Level
          </span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < 2 ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;