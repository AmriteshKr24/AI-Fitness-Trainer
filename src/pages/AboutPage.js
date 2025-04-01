import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              About <span className="text-orange-500">InertiaFit</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
              Where fitness meets passion and results are achieved
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-300 mb-6">
                At InertiaFit, our mission is to provide an environment that inspires and motivates individuals to achieve their fitness goals. We believe that fitness is not just about physical strength but also about mental wellness and building a community of like-minded individuals.
              </p>
              <p className="text-gray-300">
                We are dedicated to offering top-notch equipment, expert trainers, and a supportive atmosphere to help our members transform their lives through fitness.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">State-of-the-art equipment and facilities</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Expert trainers with years of experience</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Personalized fitness plans for optimal results</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Supportive community environment</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Flexible membership options to suit your lifestyle</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-2">John Smith</h3>
                <p className="text-orange-500 text-center mb-3">Founder & Head Trainer</p>
                <p className="text-gray-300 text-center">
                  With over 15 years of experience in fitness training, John leads our team with passion and expertise.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-2">Sarah Johnson</h3>
                <p className="text-orange-500 text-center mb-3">Nutrition Specialist</p>
                <p className="text-gray-300 text-center">
                  Sarah helps our members optimize their nutrition to complement their fitness journey.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-2">Mike Williams</h3>
                <p className="text-orange-500 text-center mb-3">Strength Training Coach</p>
                <p className="text-gray-300 text-center">
                  Mike specializes in helping members build strength and achieve their fitness goals safely.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Our Story</h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto">
              Founded in 2015, InertiaFit began with a simple idea: to create a fitness center that focuses on individual needs while building a community. What started as a small gym has now grown into a premier fitness destination with state-of-the-art equipment and expert trainers dedicated to helping members achieve their fitness goals.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage; 