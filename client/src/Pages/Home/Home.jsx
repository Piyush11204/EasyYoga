import React, { useState } from 'react';
import { ArrowRight, Star, Users, Calendar, Mail} from 'lucide-react';

const Home = () => {


  return (
    <>
    <div className="mt-16">

      
        

    <section className="relative text-white h-[400px] py-20 overflow-hidden">
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    src="https://cdn.pixabay.com/video/2020/05/28/40401-425442542_large.mp4"
    autoPlay
    muted
    loop
  />
  {/* Overlay Layer */}
  <div className="absolute inset-0 bg-black opacity-50" />

  <div className="relative container mx-auto px-4 text-center z-10">
    <h2 className="text-4xl font-bold mb-4">Find Your Inner Peace</h2>
    <p className="text-xl mb-8">
      Join our yoga community and transform your mind, body, and soul
    </p>
    <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
      Start Your Journey
    </button>
  </div>
</section>


      {/* Featured Classes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Featured Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Hatha Yoga', 'Vinyasa Flow', 'Yin Yoga'].map((yogaStyle) => (
              <div key={yogaStyle} className="border rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-2">{yogaStyle}</h3>
                <p className="mb-4">Experience the transformative power of {yogaStyle} in our serene studio.</p>
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 mr-1" />
                  <span>4.8 (120 reviews)</span>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                  Learn More <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            ))}
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
    </>
  );
};

export default Home;