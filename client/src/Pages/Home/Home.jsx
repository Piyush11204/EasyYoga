import React from 'react';
import { ArrowBigDown, Star, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Yoga poses data structure
const yogaPoses = [
  {
    id: 'tree',
    name: 'Tree',
    description: 'A balancing pose that strengthens your legs and core while improving your focus and concentration.',
    benefits: ['Improves balance', 'Strengthens legs and core', 'Enhances focus'],
    difficulty: 'Beginner',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'chair',
    name: 'Chair',
    description: 'A powerful standing pose that strengthens the lower body while improving posture and stability.',
    benefits: ['Strengthens thighs and ankles', 'Tones abdominals', 'Improves posture'],
    difficulty: 'Beginner',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'cobra',
    name: 'Cobra',
    description: 'A gentle backbend that opens the chest and strengthens the spine while stretching the front of the body.',
    benefits: ['Strengthens spine', 'Opens chest and lungs', 'Improves posture'],
    difficulty: 'Beginner',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'A strong standing pose that builds strength and stability while improving focus and circulation.',
    benefits: ['Strengthens legs and core', 'Opens hips and chest', 'Improves stamina'],
    difficulty: 'Intermediate',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'dog',
    name: 'Dog',
    description: 'Also known as Downward Dog, this pose stretches and strengthens the entire body while calming the mind.',
    benefits: ['Stretches hamstrings and calves', 'Strengthens arms and shoulders', 'Energizes the body'],
    difficulty: 'Beginner',
    image: '/api/placeholder/400/300'
  },
  {
    id: 'shoulderstand',
    name: 'Shoulderstand',
    description: 'An inverted pose that calms the nervous system while strengthening the upper body and improving circulation.',
    benefits: ['Improves circulation', 'Calms nervous system', 'Strengthens shoulders and neck'],
    difficulty: 'Advanced',
    image: '/api/placeholder/400/300'
  }
];

const Home = () => {
  const navigate = useNavigate();
  
  // Function to get appropriate color classes based on difficulty
  const getDifficultyColors = (difficulty) => {
    switch(difficulty) {
      case 'Beginner':
        return {
          border: 'border-l-green-500',
          badge: 'bg-green-100 text-green-800'
        };
      case 'Intermediate':
        return {
          border: 'border-l-blue-500',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'Advanced':
        return {
          border: 'border-l-purple-500',
          badge: 'bg-purple-100 text-purple-800'
        };
      default:
        return {
          border: 'border-l-gray-500',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  // Function to handle learn more click
  const handleLearnMore = (poseName) => {
    navigate('/yoga', { state: { selectedPose: poseName } });
  };

  return (
    <div className="mt-16">
      {/* Hero Section */}
      <section className="relative text-white h-[400px] py-20 overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://cdn.pixabay.com/video/2020/05/28/40401-425442542_large.mp4"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative container mx-auto px-4 text-center z-10">
          <h2 className="text-4xl font-bold mb-4">Find Your Inner Peace</h2>
          <p className="text-xl mb-8">
            Join our yoga community and transform your mind, body, and soul
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
            Scroll to Start <ArrowBigDown className="inline" />
          </button>
        </div>
      </section>

      {/* Yoga Poses Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Yoga Poses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yogaPoses.map((pose) => {
              const colors = getDifficultyColors(pose.difficulty);
              return (
                <div key={pose.id} className={`rounded-lg shadow-lg overflow-hidden border-l-4 ${colors.border} hover:shadow-xl transition-transform hover:scale-105`}>
                  <img src={pose.image} alt={pose.name} className="w-full h-48 object-cover" />
                  <div className="p-6 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">{pose.name} Pose</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                        {pose.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{pose.description}</p>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Benefits:</h4>
                      <ul className="list-disc pl-5 text-gray-600">
                        {pose.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 w-4 h-4 mr-1" />
                        <span className="text-sm">4.8 (120 reviews)</span>
                      </div>
                      <button 
                        onClick={() => handleLearnMore(pose.name)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Peaceful Yoga</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p>Learn from certified yoga teachers with years of experience.</p>
            </div>
            <div className="text-center">
              <Calendar size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
              <p>Choose from a variety of class times to fit your busy lifestyle.</p>
            </div>
            <div className="text-center">
              <Star size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Welcoming Community</h3>
              <p>Join a supportive and inclusive yoga family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-violet-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Yoga Journey?</h2>
          <p className="text-xl mb-8">Sign up now and get your first class free!</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;