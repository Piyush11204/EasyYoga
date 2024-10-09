import React from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/full-shot-people-doing-yoga-together_23-2151084081.jpg?t=st=1728503119~exp=1728506719~hmac=1e14024e8ccb774ba4222401a15a562b243551ac5237937d21a9795e4000687a&w=996')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-bold">Get in Touch</h1>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="container mx-auto py-12 px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address */}
          <div className="flex items-center space-x-4">
            <MapPin className="text-purple-500" size={40} />
            <div>
              <h2 className="text-lg font-semibold">Our Office</h2>
              <p className="text-gray-600">123 Business Avenue, Suite 456, New York, NY 10001</p>
            </div>
          </div>
          
          {/* Phone */}
          <div className="flex items-center space-x-4">
            <Phone className="text-purple-500" size={40} />
            <div>
              <h2 className="text-lg font-semibold">Phone</h2>
              <p className="text-gray-600">+1 (800) 123-4567</p>
            </div>
          </div>
          
          {/* Email */}
          <div className="flex items-center space-x-4">
            <Mail className="text-purple-500" size={40} />
            <div>
              <h2 className="text-lg font-semibold">Email</h2>
              <p className="text-gray-600">contact@business.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-3xl font-bold text-center mb-8">Send Us a Message</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-gray-600">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-gray-600">Your Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-gray-600">Your Message</label>
                <textarea
                  id="message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Write your message"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition duration-300 flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-64 md:h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2330916671195!2d-122.085872084682!3d37.42206557982469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5a4f7431b77%3A0xe0d6f8cddfaedf5a!2sGoogleplex!5e0!3m2!1sen!2sus!4v1639602049174!5m2!1sen!2sus"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          title="Google Maps"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;

