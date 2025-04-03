import React from 'react';

const CarouselSection = ({ carouselSlides, currentSlide, handlePrev, handleNext }) => {
  return (
    <div className="mt-16 w-[85%] text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8">Explore more of Java</h2>
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselSlides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-48 sm:h-64 object-cover rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full shadow-md transition duration-300"
        >
          &#8592;
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full shadow-md transition duration-300"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default CarouselSection;