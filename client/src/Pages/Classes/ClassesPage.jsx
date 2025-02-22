import React, { useState } from "react";
import { Play, Book, FileText, ChevronDown, ChevronUp } from "lucide-react";

const ClassesPage = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const [expandedVideo, setExpandedVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: "Beginner's Yoga Flow",
      duration: "35 min",
      level: "Beginner",
      url: "https://www.youtube.com/embed/x49fSQAHn7o",
    },
    {
      id: 2,
      title: "Power Vinyasa",
      duration: "45 min",
      level: "Intermediate",
      url: "https://www.youtube.com/embed/IvVX4Gxkp7A",
    },
    {
      id: 3,
      title: "Gentle Yin Yoga",
      duration: "60 min",
      level: "All Levels",
      url: "https://www.youtube.com/embed/S3sAj3VgacQ",
    },
    {
      id: 4,
      title: "Yoga for Flexibility",
      duration: "15 min",
      level: "Beginner",
      url: "https://www.youtube.com/embed/__CtvEjdJ78",
    },
    {
      id: 5,
      title: "Advanced Ashtanga Practice",
      duration: "60 min",
      level: "Advanced",
      url: "https://www.youtube.com/embed/-kUrGKBWUrM",
    },
    {
      id: 6,
      title: "Meditation and Breathwork",
      duration: "15 min",
      level: "All Levels",
      url: "https://www.youtube.com/embed/5y0XOCQNL5E",
    },
  ];

  const blogs = [
    {
      id: 1,
      title: "The Benefits of Daily Yoga Practice",
      author: "Sarah Johnson",
      date: "2023-05-15",
    },
    {
      id: 2,
      title: "Understanding the 8 Limbs of Yoga",
      author: "Michael Chen",
      date: "2023-06-02",
    },
    {
      id: 3,
      title: "Yoga for Stress Relief: 5 Poses to Try",
      author: "Emma Davis",
      date: "2023-06-20",
    },
    {
      id: 4,
      title: "The History and Philosophy of Yoga",
      author: "David Smith",
      date: "2023-07-10",
    },
  ];

  const articles = [
    {
      id: 1,
      title: "Yoga and Mental Health: A Scientific Perspective",
      source: "Yoga Journal",
    },
    {
      id: 2,
      title: "The Role of Yoga in Modern Fitness",
      source: "Fitness Today",
    },
    {
      id: 3,
      title: "Yoga for Athletes: Enhancing Performance and Recovery",
      source: "Sports Illustrated",
    },
    {
      id: 4,
      title: "The Global Rise of Yoga: Cultural Appropriation or Appreciation?",
      source: "Cultural Studies Quarterly",
    },
  ];

  const toggleVideoExpansion = (id) => {
    setExpandedVideo(expandedVideo === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto p-5 text-gray-800">
      <h1 className="text-4xl mt-14 font-bold text-violet-600 mb-8">
        EasyYoga Classes and Resources
      </h1>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`mr-4 py-2 px-4 focus:outline-none ${activeTab === "videos"
              ? "text-violet-600 border-b-2 border-violet-600 font-medium"
              : "text-gray-500"
            }`}
          onClick={() => setActiveTab("videos")}
        >
          <Play className="inline-block mr-2" size={20} />
          Videos
        </button>
        <button
          className={`mr-4 py-2 px-4 focus:outline-none ${activeTab === "blogs"
              ? "text-violet-600 border-b-2 border-violet-600 font-medium"
              : "text-gray-500"
            }`}
          onClick={() => setActiveTab("blogs")}
        >
          <Book className="inline-block mr-2" size={20} />
          Blogs
        </button>
        <button
          className={`py-2 px-4 focus:outline-none ${activeTab === "articles"
              ? "text-violet-600 border-b-2 border-violet-600 font-medium"
              : "text-gray-500"
            }`}
          onClick={() => setActiveTab("articles")}
        >
          <FileText className="inline-block mr-2" size={20} />
          Articles
        </button>
      </div>

      {/* Content Area */}
      <div className="mb-8">
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-48 object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Duration: {video.duration}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Level: {video.level}
                  </p>
                  <button
                    className="text-violet-600 font-medium flex items-center"
                    onClick={() => toggleVideoExpansion(video.id)}
                  >
                    {expandedVideo === video.id ? (
                      <>
                        Less info
                        <ChevronUp className="ml-1" size={16} />
                      </>
                    ) : (
                      <>
                        More info
                        <ChevronDown className="ml-1" size={16} />
                      </>
                    )}
                  </button>
                  {expandedVideo === video.id && (
                    <p className="mt-2 text-sm text-gray-700">
                      This {video.duration} {video.level} class focuses on improving your flexibility and strength.

                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-violet-600 font-medium block mt-2"
                      >
                        Watch on YouTube
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}


        {activeTab === "blogs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  By {blog.author} on {blog.date}
                </p>
                <button
                  className="text-violet-600 font-medium"
                  onClick={() => alert('Read More clicked')}
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "articles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Source: {article.source}
                </p>
                <button
                  className="text-violet-600 font-medium"
                  onClick={() => alert('Read More clicked')}
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassesPage;

