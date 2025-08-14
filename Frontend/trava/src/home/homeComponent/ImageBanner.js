import React, { useState, useEffect, useRef } from 'react';
import img1 from "../../assets/img/javalandscape.jpg";
import img2 from "../../assets/img/yogyakarta.jpg";
import img3 from "../../assets/img/lombok.jpg";

const images = [
  {
    src: img1,
    alt: "Java Landscape",
    caption: "Explore the beauty of Java",
    description: "See the breathtaking landscapes and culture of Java island.",
  },
  {
    src: img2,
    alt: "Yogyakarta",
    caption: "Discover the charm of Yogyakarta",
    description: "Enjoy cultural heritage, majestic temples, and local arts in Yogyakarta.",
  },
  {
    src: img3,
    alt: "Lombok Adventure",
    caption: "Discover wild Lombok",
    description: "Adventure through Lombok's mountains and pristine beaches.",
  },
];

const ImageBanner = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  // Auto-slide every 4 seconds
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-4xl h-[200px] md:h-[320px] mx-auto mt-12 overflow-hidden rounded-xl shadow-lg">
      {/* Carousel items */}
      {images.map((img, idx) => (
        <div
          key={img.alt}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="block w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent py-6 text-center text-white">
            <h5 className="text-xl md:text-2xl font-bold mb-1">{img.caption}</h5>
            <p className="text-base md:text-lg">{img.description}</p>
          </div>
        </div>
      ))}

      {/* Carousel controls */}
      <button
        className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center w-[15%] text-white opacity-50 hover:opacity-90 transition"
        type="button"
        onClick={prevSlide}
        aria-label="Previous"
      >
        <span className="inline-block h-8 w-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </span>
      </button>
      <button
        className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center w-[15%] text-white opacity-50 hover:opacity-90 transition"
        type="button"
        onClick={nextSlide}
        aria-label="Next"
      >
        <span className="inline-block h-8 w-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ImageBanner;