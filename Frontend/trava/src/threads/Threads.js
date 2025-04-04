import React from 'react';

// Import images
import jakartaImg from '../assets/img/jakarta.jpg';
import bandungImg from '../assets/img/bandung.jpg';
import baliImg from '../assets/img/bali.jpg';
import yogyakartaImg from '../assets/img/yogyakarta.jpg';
import surabayaImg from '../assets/img/surabaya.jpg';
import lombokImg from '../assets/img/lombok.jpg';
import medanImg from '../assets/img/medan.jpg';
import makassarImg from '../assets/img/makassar.jpg';
import semarangImg from '../assets/img/semarang.jpg';
import acehImg from '../assets/img/aceh.jpg';
import manadoImg from '../assets/img/manado.jpg';
import palembangImg from '../assets/img/palembang.jpg';

const Threads = () => {
  const guides = [
    {
      title: 'Jakarta: Good Cities to Stay',
      description: 'Explore Jakarta, the bustling capital city of Indonesia, known for its vibrant culture and history.',
      author: 'John Doe',
      likes: 15234,
      views: 89234,
      image: jakartaImg,
    },
    {
      title: 'Bandung: Best Culinary in Indonesia',
      description: 'Discover Bandung, a city famous for its delicious food, cool climate, and creative culture.',
      author: 'Jane Smith',
      likes: 12345,
      views: 75432,
      image: bandungImg,
    },
    {
      title: 'Bali: Island of the Gods',
      description: 'Experience Bali, a world-renowned destination for its beaches, temples, and vibrant nightlife.',
      author: 'Alex Johnson',
      likes: 9876,
      views: 65432,
      image: baliImg,
    },
    {
      title: 'Yogyakarta: Cultural Heritage',
      description: 'Visit Yogyakarta, the cultural heart of Java, known for its traditional arts and Borobudur Temple.',
      author: 'Emily Davis',
      likes: 8765,
      views: 54321,
      image: yogyakartaImg,
    },
    {
      title: 'Surabaya: City of Heroes',
      description: 'Explore Surabaya, a historic city with a rich past and modern attractions.',
      author: 'Michael Brown',
      likes: 7654,
      views: 43210,
      image: surabayaImg,
    },
    {
      title: 'Lombok: Hidden Paradise',
      description: 'Relax on the pristine beaches of Lombok, a hidden gem near Bali.',
      author: 'Sarah Wilson',
      likes: 6543,
      views: 32109,
      image: lombokImg,
    },
    {
      title: 'Medan: Gateway to Lake Toba',
      description: 'Discover Medan, the gateway to the stunning Lake Toba and Batak culture.',
      author: 'Chris Lee',
      likes: 5432,
      views: 21098,
      image: medanImg,
    },
    {
      title: 'Makassar: Culinary and History',
      description: 'Visit Makassar, known for its seafood, historical sites, and vibrant culture.',
      author: 'Anna Taylor',
      likes: 4321,
      views: 10987,
      image: makassarImg,
    },
    {
      title: 'Semarang: Blend of Cultures',
      description: 'Explore Semarang, a city with a unique blend of Javanese, Chinese, and Dutch influences.',
      author: 'David Clark',
      likes: 3210,
      views: 9876,
      image: semarangImg,
    },
    {
      title: 'Aceh: Gateway to Tsunami History',
      description: 'Learn about Aceh’s history and its resilience after the 2004 tsunami.',
      author: 'Emily Carter',
      likes: 2890,
      views: 8765,
      image: acehImg,
    },
    {
      title: 'Manado: Diving Paradise',
      description: 'Dive into the crystal-clear waters of Manado, a paradise for underwater enthusiasts.',
      author: 'James White',
      likes: 2456,
      views: 7654,
      image: manadoImg,
    },
    {
      title: 'Palembang: Culinary and History',
      description: 'Visit Palembang, famous for its Ampera Bridge and delicious Pempek.',
      author: 'Sophia Green',
      likes: 1987,
      views: 6543,
      image: palembangImg,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-center mb-2">Explore Travel</h1>
      <p className="text-center text-gray-600 mb-6">See threads made by other travellers</p>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Explore itinerary and destination"
          className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md outline-none"
        />
      </div>

      {/* Threads Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Threads</h2>
        <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
          <option>Most Popular</option>
          <option>Hidden Gem</option>
          <option>Most Viewed</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {guides.map((guide, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-md">
            <img src={guide.image} alt={guide.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{guide.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{guide.author}</span>
                <div className="flex items-center space-x-2">
                  <span>👁 {guide.views}</span>
                  <span>❤️ {guide.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See More Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
          See more
        </button>
      </div>
    </div>
  );
};

export default Threads;