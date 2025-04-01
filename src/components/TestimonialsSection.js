import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "InertiaFit transformed my fitness journey. The trainers are exceptional and the results speak for themselves!",
      name: "Sarah Johnson",
      role: "Member since 2021",
    },
    {
      quote: "The coaches here are top-notch. They pushed me beyond what I thought was possible and helped me achieve my fitness goals.",
      name: "Michael Williams",
      role: "Member since 2020",
    },
    {
      quote: "Great atmosphere, professional staff, and state-of-the-art equipment. I wouldn't train anywhere else.",
      name: "Emma Davis",
      role: "Member since 2022",
    }
  ];

  return (
    <div className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            What Our <span className="text-orange-500">Members</span> Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Hear from our community about their experience at InertiaFit
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-orange-500 transition-colors duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </div>
              <blockquote className="text-lg italic mb-4">"{testimonial.quote}"</blockquote>
              <div className="font-bold">{testimonial.name}</div>
              <div className="text-orange-500 text-sm">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection; 