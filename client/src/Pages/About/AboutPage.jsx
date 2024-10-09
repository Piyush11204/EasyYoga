import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

const AboutPage = () => {
  const [isOpen, setIsOpen] = useState({
    yogaApproach: false,
    classes: false,
    instructors: false,
  });

  const [faqOpen, setFaqOpen] = useState({
    flexible: false,
    practice: false,
    attire: false,
    benefits: false,
    beginners: false,
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleDropdown = (section) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const toggleFaq = (question) => {
    setFaqOpen((prevState) => ({
      ...prevState,
      [question]: !prevState[question],
    }));
  };

  const slides = [
    {
      src: "https://img.freepik.com/free-photo/group-people-performing-stretching-exercise_1170-228.jpg?t=st=1728499903~exp=1728503503~hmac=5db84ef4f2a3bdce5dcd670af9810814a61fa20ea41e645a426e63311e2049bc&w=996",
      alt: "Yoga class in session",
      caption: "Join our vibrant yoga community",
    },
    {
      src: "https://img.freepik.com/free-photo/trainer-assisting-group-people-with-stretching-exercise_1170-189.jpg?t=st=1728500489~exp=1728504089~hmac=d311096ef7b5300846d6b53ae808d46ac068d6e310287afa7925a3ae1a9d8416&w=996",
      alt: "Yoga pose demonstration",
      caption: "Learn proper techniques from expert instructors",
    },
    {
      src: "https://img.freepik.com/free-photo/group-people-coming-together-outdoor-yoga_1262-20178.jpg?t=st=1728499825~exp=1728503425~hmac=fe1073ff003bab0b028386378c2f54b83b19d544f523e84cee469526151eefc8&w=996",
      alt: "Meditation session",
      caption: "Find inner peace through our meditation classes",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="max-w-4xl lg:max-w-7xl mx-auto p-5 lg:p-10 text-gray-800">
      <h1 className="text-4xl mt-14 font-bold text-violet-600 mb-5">About EasyYoga</h1>

      {/* Image Slider */}
      <div className="relative mb-10">
        <img
          src={slides[currentSlide].src}
          alt={slides[currentSlide].alt}
          className="w-full h-64 object-cover rounded-lg lg:h-[450px]"
        />
        <p className="absolute bottom-4  bg-black bg-opacity-50 text-white p-2 rounded">
          {slides[currentSlide].caption}
        </p>
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <p className="mb-5 text-lg">
        Welcome to EasyYoga, your ultimate destination for accessible and
        enjoyable yoga practice. Our mission is to make yoga easy and
        approachable for everyone, regardless of age, fitness level, or
        experience. At EasyYoga, we believe in the transformative power of yoga
        to improve both physical and mental well-being.
      </p>

      <h2 className="text-3xl font-semibold text-violet-600 mb-3">
        Our Philosophy
      </h2>

      {/* Dropdown: Our Approach to Yoga */}
      <div className="mb-5">
        <button
          onClick={() => toggleDropdown("yogaApproach")}
          className="flex justify-between items-center bg-violet-500 text-white w-full p-3 text-left rounded-lg hover:bg-violet-600 focus:outline-none transition duration-300"
        >
          Our Approach to Yoga
          {isOpen.yogaApproach ? (
            <ChevronUp className="ml-2" />
          ) : (
            <ChevronDown className="ml-2" />
          )}
        </button>
        {isOpen.yogaApproach && (
          <div className="mt-3 bg-gray-100 p-4 rounded-lg">
            <p className="mb-3">
              At EasyYoga, we believe that yoga should be accessible to all. Our
              approach focuses on creating a welcoming environment where everyone
              can explore and deepen their practice at their own pace.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>Simplifying complex poses for better understanding</li>
              <li>Providing clear, easy-to-follow instructions</li>
              <li>Offering modifications for different skill levels and physical abilities</li>
              <li>Creating a supportive, non-judgmental environment</li>
              <li>Emphasizing the mind-body connection in our practices</li>
              <li>Encouraging self-awareness and personal growth</li>
            </ul>
          </div>
        )}
      </div>

      {/* Dropdown: Our Classes */}
      <div className="mb-5">
        <button
          onClick={() => toggleDropdown("classes")}
          className="flex justify-between items-center bg-violet-500 text-white w-full p-3 text-left rounded-lg hover:bg-violet-600 focus:outline-none transition duration-300"
        >
          Our Classes
          {isOpen.classes ? (
            <ChevronUp className="ml-2" />
          ) : (
            <ChevronDown className="ml-2" />
          )}
        </button>
        {isOpen.classes && (
          <div className="mt-3 bg-gray-100 p-4 rounded-lg">
            <p className="mb-3">We offer a variety of classes to suit different needs and preferences:</p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>Beginner Basics: Perfect for those new to yoga</li>
              <li>Gentle Flow: A slow-paced, relaxing practice</li>
              <li>Power Yoga: For those seeking a more intense workout</li>
              <li>Restorative Yoga: Focus on relaxation and healing</li>
              <li>Chair Yoga for Seniors: Adapted poses for improved mobility</li>
              <li>Prenatal Yoga: Safe practices for expectant mothers</li>
              <li>Kids Yoga: Fun and engaging sessions for children</li>
              <li>Meditation and Mindfulness: Cultivate inner peace and awareness</li>
            </ul>
          </div>
        )}
      </div>

      {/* Dropdown: Our Instructors */}
      <div className="mb-5">
        <button
          onClick={() => toggleDropdown("instructors")}
          className="flex justify-between items-center bg-violet-500 text-white w-full p-3 text-left rounded-lg hover:bg-violet-200 focus:outline-none transition duration-300"
        >
          Our Instructors
          {isOpen.instructors ? (
            <ChevronUp className="ml-2" />
          ) : (
            <ChevronDown className="ml-2" />
          )}
        </button>
        {isOpen.instructors && (
          <div className="mt-3 bg-gray-100 p-4 rounded-lg">
            <p className="mb-3">
              Our team of certified instructors brings a wealth of experience and
              diverse backgrounds to EasyYoga. Each instructor is committed to
              creating a supportive and inspiring environment for our students.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>Sarah: Specializes in Vinyasa and Power Yoga</li>
              <li>Michael: Expert in Restorative Yoga and Meditation</li>
              <li>Emma: Focuses on Prenatal and Postnatal Yoga</li>
              <li>David: Leads our Kids Yoga and Mindfulness sessions</li>
              <li>Sophia: Combines Yoga with holistic wellness practices</li>
            </ul>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <h2 className="text-3xl font-semibold text-violet-600 mb-5">FAQs</h2>
      <div className="space-y-5">
        {/* FAQ Question */}
        <div>
          <button
            onClick={() => toggleFaq("flexible")}
            className="flex justify-between items-center border-2 border-violet-500 text-violet-500 w-full p-3 text-left rounded-lg hover:bg-violet-200 focus:outline-none transition duration-300"
          >
            Do I need to be flexible to practice yoga?
            {faqOpen.flexible ? <ChevronUp /> : <ChevronDown />}
          </button>
          {faqOpen.flexible && (
            <div className="mt-2 bg-gray-100 p-4 rounded-lg">
              <p>
                No, yoga is for everyone! Flexibility is not a requirement to
                start practicing yoga. Over time, you’ll naturally improve your
                flexibility through consistent practice.
              </p>
            </div>
          )}
        </div>

        {/* FAQ Question */}
        <div>
          <button
            onClick={() => toggleFaq("practice")}
            className="flex justify-between items-center border-2 border-violet-500 text-violet-500 w-full p-3 text-left rounded-lg hover:bg-violet-200 focus:outline-none transition duration-300"
          >
            How often should I practice yoga?
            {faqOpen.practice ? <ChevronUp /> : <ChevronDown />}
          </button>
          {faqOpen.practice && (
            <div className="mt-2 bg-gray-100 p-4 rounded-lg">
              <p>
                The frequency of your practice depends on your goals and
                lifestyle. Even practicing once or twice a week can offer
                benefits. For more noticeable improvements in strength, flexibility,
                and mental clarity, consider practicing 3-5 times a week.
              </p>
            </div>
          )}
        </div>

        {/* FAQ Question */}
        <div>
          <button
            onClick={() => toggleFaq("attire")}
            className="flex justify-between items-center border-2 border-violet-500 text-violet-500 w-full p-3 text-left rounded-lg hover:bg-violet-200 focus:outline-none transition duration-300"
          >
            What should I wear to a yoga class?
            {faqOpen.attire ? <ChevronUp /> : <ChevronDown />}
          </button>
          {faqOpen.attire && (
            <div className="mt-2 bg-gray-100 p-4 rounded-lg">
              <p>
                Wear comfortable, breathable clothing that allows you to move
                freely. Yoga is typically practiced barefoot, so no special
                footwear is required.
              </p>
            </div>
          )}
        </div>

        {/* FAQ Question */}
        <div>
          <button
            onClick={() => toggleFaq("benefits")}
            className="flex justify-between items-center border-2 border-violet-500 text-violet-500 w-full p-3 text-left rounded-lg hover:bg-violet-200 focus:outline-none transition duration-300"
          >
            What are the benefits of practicing yoga?
            {faqOpen.benefits ? <ChevronUp /> : <ChevronDown />}
          </button>
          {faqOpen.benefits && (
            <div className="mt-2 bg-gray-100 p-4 rounded-lg">
              <p>
                Yoga offers numerous benefits, including improved flexibility,
                strength, balance, and mental clarity. Regular practice can also
                reduce stress, improve sleep, and enhance overall well-being.
              </p>
            </div>
          )}
        </div>

        {/* FAQ Question */}
        <div>
          <button
            onClick={() => toggleFaq("beginners")}
            className="flex justify-between items-center border-2 border-violet-500 text-violet-500 w-full p-3 text-left rounded-lg hover:bg-violet-200 focus:outline-none transition duration-300"
          >
            Is yoga suitable for beginners?
            {faqOpen.beginners ? <ChevronUp /> : <ChevronDown />}
          </button>
          {faqOpen.beginners && (
            <div className="mt-2 bg-gray-100 p-4 rounded-lg">
              <p>
                Absolutely! Yoga is suitable for all levels, and we offer beginner-friendly classes that focus on building a strong foundation in the basic postures and techniques.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
