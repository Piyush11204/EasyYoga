import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const DropDown = ({ poseList, currentPose, setCurrentPose }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl pt-16 mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="text-xl font-bold text-indigo-600">
              Yoga Poses
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {poseList.map((pose) => (
              <button
                key={pose}
                onClick={() => setCurrentPose(pose)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${currentPose === pose 
                    ? 'bg-indigo-500 text-white' 
                    : 'text-gray-700 hover:bg-indigo-100'
                  }`}
              >
                {pose}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-500 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {poseList.map((pose) => (
                <button
                  key={pose}
                  onClick={() => {
                    setCurrentPose(pose);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${currentPose === pose 
                      ? 'bg-indigo-500 text-white' 
                      : 'text-gray-700 hover:bg-indigo-100'
                    }`}
                >
                  {pose}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DropDown;