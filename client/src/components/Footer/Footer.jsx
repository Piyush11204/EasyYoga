import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h5 className="text-xl font-bold mb-4">About Easy Yoga</h5>
            <p className="text-gray-300">
              Easy Yoga is your home for balance, strength, and peace. Whether you're new to yoga or a seasoned practitioner, our community welcomes you with open arms.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h5 className="text-xl font-bold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="/classes" className="text-gray-300 hover:text-white transition-colors">Classes</a></li>
              <li><a href="/schedule" className="text-gray-300 hover:text-white transition-colors">Schedule</a></li>
              <li><a href="/instructors" className="text-gray-300 hover:text-white transition-colors">Instructors</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          {/* Contact Info & Social Icons */}
          <div>
            <h5 className="text-xl font-bold mb-4">Get In Touch</h5>
            <p className="flex items-center mb-4">
              <Mail className="mr-2" size={18} />
              <span>info@easyyoga.com</span>
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="mb-2">&copy; 2024 Easy Yoga. All Rights Reserved.</p>
          <button className="px-4 py-2 border border-white text-sm rounded hover:bg-white hover:text-gray-800 transition-colors">
            Privacy Policy
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;