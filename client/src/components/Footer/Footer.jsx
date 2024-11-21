import React, { useState } from 'react';
import { 
  Facebook, Instagram, Twitter, Mail, Phone, MapPin, 
  Calendar, Users, BookOpen, Shield, Heart 
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Implement newsletter signup logic
    console.log(`Subscribing email: ${email}`);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h5 className="text-xl font-bold mb-4 flex items-center">
              <Heart className="mr-2 text-rose-500" size={24} />
              About Easy Yoga
            </h5>
            <p className="text-gray-300 text-sm leading-relaxed">
              More than a studio, we're a holistic wellness community dedicated to transforming lives through mindful movement, breathwork, and inner peace.
            </p>
            <div className="mt-4 flex items-center text-gray-300">
              <MapPin className="mr-2" size={18} />
              <span className="text-sm">123 Harmony Lane, Wellness City</span>
            </div>
            <div className="mt-2 flex items-center text-gray-300">
              <Phone className="mr-2" size={18} />
              <span className="text-sm">(555) 123-YOGA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xl font-bold mb-4 flex items-center">
              <BookOpen className="mr-2 text-emerald-500" size={24} />
              Quick Links
            </h5>
            <ul className="space-y-3">
              {[
                { href: "/classes", icon: <Calendar size={16} className="mr-2" />, label: "Class Schedule" },
                { href: "/instructors", icon: <Users size={16} className="mr-2" />, label: "Our Teachers" },
                { href: "/workshops", icon: <Heart size={16} className="mr-2" />, label: "Workshops" },
                { href: "/membership", icon: <Shield size={16} className="mr-2" />, label: "Membership" }
              ].map(({ href, icon, label }) => (
                <li key={href}>
                  <a 
                    href={href} 
                    className="text-gray-300 hover:text-white transition-colors flex items-center text-sm"
                  >
                    {icon}
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xl font-bold mb-4 flex items-center">
              <Mail className="mr-2 text-sky-500" size={24} />
              Stay Connected
            </h5>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button 
                type="submit" 
                className="w-full bg-sky-600 text-white py-2 rounded text-sm hover:bg-sky-700 transition-colors"
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>

          {/* Social & Legal */}
          <div>
            <h5 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="mr-2 text-purple-500" size={24} />
              Connect & Legal
            </h5>
            <div className="flex space-x-4 mb-4">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Twitter, href: "https://twitter.com" }
              ].map(({ Icon, href }) => (
                <a 
                  key={href} 
                  href={href} 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => setShowPrivacyModal(true)}
                className="text-sm text-gray-300 hover:text-white flex items-center"
              >
                <Shield size={16} className="mr-2" />
                Privacy Policy
              </button>
              <button 
                className="text-sm text-gray-300 hover:text-white flex items-center"
              >
                <Shield size={16} className="mr-2" />
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400 mb-4">
            &copy; 2024 Easy Yoga. Cultivating Wellness, One Breath at a Time.
          </p>
        </div>
      </div>

      {/* Privacy Modal (placeholder) */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded max-w-md">
            <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
            <p className="text-sm mb-4">Placeholder for privacy policy content...</p>
            <button 
              onClick={() => setShowPrivacyModal(false)}
              className="bg-gray-200 text-black px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
