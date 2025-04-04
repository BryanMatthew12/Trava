import React, { useState } from 'react';
import HeaderSection from './rootPageComponent/HeaderSection';
import FeaturesComponent from './rootPageComponent/FeaturesComponent';
import CarouselSection from './rootPageComponent/CarouselSection';
import PopularSection from './rootPageComponent/PopularSection';
import carouselSlides from './rootPageComponent/carouselSlides';
import destinations from './rootPageComponent/destinations';

const RootPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id="top" className="flex items-center justify-center flex-col py-10 px-4 sm:px-8">
      <HeaderSection />
      <FeaturesComponent />
      <CarouselSection
        carouselSlides={carouselSlides}
        currentSlide={currentSlide}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <PopularSection destinations={destinations} />
    </div>
  );
};

export default RootPage;