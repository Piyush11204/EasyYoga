import React from 'react';
import { ArrowBigDown, Star, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const yogaStyles = [
  {
    id: 'hatha',
    name: 'Hatha Yoga',
    description: 'A gentle introduction to basic yoga postures.',
    image: 'https://img.freepik.com/premium-photo/warm-sun-group-vibrant-practitioners-joyfully-flows-through-their-hatha-yoga-poses-o_1176614-44791.jpg?w=360',
  },
  {
    id: 'vinyasa',
    name: 'Vinyasa Flow',
    description: 'A dynamic practice that links movement and breath.',
    image: 'https://imgcdn.stablediffusionweb.com/2024/4/12/b37fe927-d74b-4d51-bf65-418124ba978b.jpg',
  },
  {
    id: 'yin',
    name: 'Yin Yoga',
    description: 'A slow-paced style of yoga with seated postures held for longer periods.',
    image: 'https://img.freepik.com/premium-photo/ai-generated-yoga-sequence-core-strength-flexibility_1290175-24922.jpg',
  },
  {
    id: 'ashtanga',
    name: 'Ashtanga Yoga',
    description: 'A rigorous style of yoga that follows a specific sequence of postures.',
    image: 'https://t4.ftcdn.net/jpg/03/17/67/35/360_F_317673534_QczRUjz88Unugb9aOmBZqi5tmMIdHubX.jpg',
  },
  {
    id: 'kundalini',
    name: 'Kundalini Yoga',
    description: 'A practice that incorporates movement, dynamic breathing techniques, meditation, and chanting.',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/023/430/643/small_2x/ai-generated-image-free-photo.jpg',
  },
  {
    id: 'restorative',
    name: 'Restorative Yoga',
    description: 'A relaxing practice that holds yoga poses for longer periods of time with the help of props.',
    image: 'https://thumbs.dreamstime.com/b/woman-pose-fitness-person-stress-spiritual-exercise-class-meditating-yoga-lotus-generative-ai-woman-man-restorative-pranayama-286160078.jpg',
  },
];

const Home = () => {
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

      {/* Yoga Styles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Yoga Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yogaStyles.map((style) => (
              <Link to={`/yoga/${style.id}`} key={style.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <img src={style.image} alt={style.name} className="w-full h-60 object-top" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{style.name}</h3>
                  <p className="mb-4">{style.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-1" />
                      <span>4.8 (120 reviews)</span>
                    </div>
                    <span className="text-blue-600 hover:text-blue-800">Learn More</span>
                  </div>
                </div>
              </Link>
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

            <a href="/signup">SignUp Now</a>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;