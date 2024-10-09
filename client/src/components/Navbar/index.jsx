import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { Menu, LogOut, User } from 'lucide-react'; // Import Lucide icons
import YogaLogo from "../../img/YogaLogin.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.open("http://localhost:8080/api/auth/logout", "_self");
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/login/success", {
          withCredentials: true,
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
      }
    };

    // Check if the user is authenticated via token or OAuth
    if (localStorage.getItem("token")) {
      fetchCurrentUser();
    } else {
      fetchCurrentUser();
    }
  }, []);

  return (
    <div className="w-full">
      <header className="fixed inset-x-0 top-0 z-30 bg-violet-600/80 py-1 shadow-lg backdrop-blur-lg border-gray-100">
        <div className="px-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex shrink-0">
              <Link to="/" className="flex items-center">
                <img className="h-10 w-auto bg-white rounded-lg" src={YogaLogo} alt="Logo" />
                <h1 className="flex items-center ml-2 text-2xl font-bold text-white">EasyYoga</h1>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <nav className="">
                  <ul className="md:flex text-white space-y-2 md:space-y-0 md:space-x-4">
                    <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
                    <li><Link to="/classes" className="hover:text-blue-500">Classes</Link></li>
                    <li><Link to="/schedule" className="hover:text-blue-500">Schedule</Link></li>
                    <li><Link to="/about" className="hover:text-blue-500">About</Link></li>
                    <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white ml-64"
            >
              <Menu size={24} />
            </button>

            {/* User and Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              {currentUser && (
                <div className="hidden md:flex items-center space-x-2">
                  <h3 className="text-white">{currentUser.name}</h3>
                </div>
              )}
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-violet-600 shadow-sm transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-violet-600 shadow-sm transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <User size={20} className="mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Sidebar Menu */}
          <div
            className={`fixed top-0 right-0 w-2/3 h-full bg-violet-600 text-white transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
          >
            <div className="flex flex-col p-4">
              <Link
                to="/addlocation"
                className="py-2 px-4 hover:bg-violet-500 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Add Yours
              </Link>
              <Link
                to="/pricing"
                className="py-2 px-4 hover:bg-violet-500 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              {currentUser && (
                <>
                  <div className="flex items-center space-x-2 mt-4">
                    <h3>{currentUser.name}</h3>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-4 px-4 py-2 bg-white text-violet-600 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </button>
                </>
              )}
              {!currentUser && (
                <Link
                  to="/login"
                  className="mt-4 px-4 py-2 bg-white text-violet-600 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} className="mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
