import React, { useEffect, useState } from "react";
import {  Link } from 'react-router-dom';
import axios from "axios";
import { icons, Menu, LogOut, User } from 'lucide-react'; // Import Lucide
 
import YogaLogo from "../../img/YogaLogin.png";


const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    fetchCurrentUser();
  }, []);

  return (
    <div className="w-full">
      <header className="fixed  inset-x-0 top-0 z-30 bg-violet-600/80 py-1 shadow-lg backdrop-blur-lg border-gray-100">
        <div className="px-4 mt-2">
          <div className="flex mb-2 items-center justify-between">
            {/* Logo Section */}
            <div className="flex shrink-0">
              <Link to="/" className="flex items-center">
                <img className="h-10 w-auto bg-white rounded-lg" src={YogaLogo} alt="Logo" />
                <h1 className="flex items-center ml-2 text-2xl font-bold text-white">EasyYoga</h1>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex justify-between items-center space-x-4">
              <nav>
                <ul className="flex space-x-4 text-white">
                  <li>
                    <Link to="/" className=" font-bold relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/classes" className=" font-bold relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                      Classes
                    </Link>
                  </li>
                  <li>
                    <Link to="/schedule" className=" font-bold relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                      Schedule
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className=" font-bold relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className=" font-bold relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="flex items-center space-x-2">
                {currentUser ? (
                  <>
<span className="text-white rounded-full font-bold bg-purple-600 w-8 h-8 border-white border-2 flex items-center justify-center">
  {currentUser.name[0]}
</span>   <div className="flex flex-col">
<span className="text-white text-[12px] font-bold">{currentUser.name}</span>
                   <span className="text-white text-[12px]">{currentUser.email}</span>
  </div>                 
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-violet-600 shadow-sm"
                    >
                      <LogOut size={20} className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-violet-600 shadow-sm"
                  >
                    <User size={20} className="mr-2" />
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="md:hidden text-white"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Dropdown Menu for Mobile */}
          {isDropdownOpen && (
            <div className="md:hidden bg-violet-600 text-white shadow-lg rounded-lg mt-2 py-2 px-4 space-y-4 transition-all">
              <Link to="/" className="block hover:bg-violet-500 rounded-lg px-4 py-2" onClick={() => setIsDropdownOpen(false)}>Home</Link>
              <Link to="/classes" className="block hover:bg-violet-500 rounded-lg px-4 py-2" onClick={() => setIsDropdownOpen(false)}>Classes</Link>
              <Link to="/schedule" className="block hover:bg-violet-500 rounded-lg px-4 py-2" onClick={() => setIsDropdownOpen(false)}>Schedule</Link>
              <Link to="/about" className="block hover:bg-violet-500 rounded-lg px-4 py-2" onClick={() => setIsDropdownOpen(false)}>About</Link>
              <Link to="/contact" className="block hover:bg-violet-500 rounded-lg px-4 py-2" onClick={() => setIsDropdownOpen(false)}>Contact</Link>

              {currentUser ? (
                <>
                  <div className="mt-4">
                    <span>{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 bg-white text-violet-600 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 bg-white text-violet-600 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={20} className="mr-2" />
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
