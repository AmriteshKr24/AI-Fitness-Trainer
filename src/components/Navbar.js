import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-orange-500">InertiaFit AI</Link>
          </div>
          
          <div className="flex-1 flex justify-end items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="text-orange-500 hover:text-orange-300 px-3 py-2 text-sm font-medium">Home</Link>
                <Link to="/about" className="text-white hover:text-orange-300 px-3 py-2 text-sm font-medium">About Us</Link>
                <Link to="/nutrition" className="text-white hover:text-orange-300 px-3 py-2 text-sm font-medium">Nutrition</Link>
                <Link to="/contact" className="text-white hover:text-orange-300 px-3 py-2 text-sm font-medium">Contact</Link>
                <Link
                  to="/custom-nutrition"
                  className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Custom Nutrition
                </Link>
                <Link
                  to="/auth"
                  className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block ml-6">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded">
                Join Now
              </button>
            </div>
          </div>
          
          <div className="flex md:hidden ml-4">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-orange-500 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-gray-800 rounded-b-lg">
            <Link to="/" className="text-orange-500 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/about" className="text-white hover:text-orange-300 block px-3 py-2 rounded-md text-base font-medium">About Us</Link>
            <Link to="/nutrition" className="text-white hover:text-orange-300 block px-3 py-2 rounded-md text-base font-medium">Nutrition</Link>
            <Link to="/contact" className="text-white hover:text-orange-300 block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
            <Link
              to="/custom-nutrition"
              className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Custom Nutrition
            </Link>
            <Link
              to="/auth"
              className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Sign In
            </Link>
            <button className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded">
              Join Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 