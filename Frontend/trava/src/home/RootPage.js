import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faMoneyBillWave, faUsers, faClipboardList } from '@fortawesome/free-solid-svg-icons'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Import images
import image1 from '../assets/img/carousel-java-1.jpeg'
import image2 from '../assets/img/carousel-java-2.jpeg'
import image3 from '../assets/img/carousel-java-3.jpeg'
import image4 from '../assets/img/carousel-java-4.jpeg'

const RootPage = () => {
  const carouselSlides = [
    {
      image: image1,
      title: 'Discover Java',
      description: 'Explore the beautiful landscapes and rich culture of Java.',
    },
    {
      image: image2,
      title: 'Adventure Awaits',
      description: 'Embark on thrilling adventures and create unforgettable memories.',
    },
    {
      image: image3,
      title: 'Relax and Unwind',
      description: 'Find peace and tranquility in serene destinations.',
    },
    {
      image: image4,
      title: 'Cultural Experiences',
      description: 'Immerse yourself in the traditions and heritage of local communities.',
    },
  ]

  const destinations = [
    {
      image: image1,
      title: 'Jakarta',
      description: 'National Monument · Kota Tua · Ancol Dreamland',
    },
    {
      image: image2,
      title: 'Bandung',
      description: 'Tangkuban Perahu · Braga Street · Kawah Putih',
    },
    {
      image: image3,
      title: 'Yogyakarta',
      description: 'Borobudur Temple · Malioboro Street · Prambanan Temple',
    },
    {
      image: image4,
      title: 'Surabaya',
      description: 'Suramadu Bridge · Tugu Pahlawan · Mount Bromo',
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1))
  }

  return (
    <div id="top" className="flex items-center justify-center flex-col py-10 px-4 sm:px-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl md:text-4xl mb-2 font-bold bg-clip-text">
          Website Slogan
        </h1>
        <h2 className="text-sm sm:text-lg md:text-2xl mb-4 max-w-full md:max-w-3xl font-medium bg-clip-text">
          With Trava, you can easily plan your next trip and share your travel experiences with others. Our platform allows you to create and manage your travel itineraries, connect with fellow travelers, and discover new destinations. Join us today and start exploring the world with Trava!
        </h2>
        <button className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Plan Itinerary
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-16 w-full md:w-[60rem] text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Features to replace all your other tools</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {/* Feature 1 */}
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 text-3xl sm:text-4xl mb-4" />
            <h3 className="font-bold text-base sm:text-lg">Add places from guides with 1 click</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              We crawled the web so you don’t have to. Easily add mentioned places to your plan.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-3xl sm:text-4xl mb-4" />
            <h3 className="font-bold text-base sm:text-lg">Expense tracking and splitting</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Keep track of your budget and split the cost between your tripmates.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faUsers} className="text-purple-500 text-3xl sm:text-4xl mb-4" />
            <h3 className="font-bold text-base sm:text-lg">Collaborate with friends in real time</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Plan along with your friends with live syncing and collaborative editing.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faClipboardList} className="text-orange-500 text-3xl sm:text-4xl mb-4" />
            <h3 className="font-bold text-base sm:text-lg">Checklists for anything</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Stay organized with a packing list, to-do list, shopping list, any kind of list.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Carousel Section */}
      <div className="mt-16 w-full md:w-[60rem] text-center">
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
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full shadow-md transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full shadow-md transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Popular Cities Section */}
      <div className="mt-16 w-full md:w-[60rem] text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {destinations.map((destination, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl shadow-lg">
              <img src={destination.image} alt={destination.title} className="w-full h-48 sm:h-64 object-cover" />
              <div className="absolute bottom-0 left-0  text-white p-4">
                <h3 className="text-base sm:text-lg font-bold text-left">{destination.title}</h3>
                <p className="text-xs sm:text-sm text-left">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RootPage