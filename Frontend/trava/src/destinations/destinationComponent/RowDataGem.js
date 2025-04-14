import React, { useState, useEffect } from "react";
import javalandscape from "../../assets/img/javalandscape.jpg";
import balilandscape from "../../assets/img/carousel-java-1.jpeg";

const culinaryBali = [
  { id: 1, name: "Bali Culinary 1", image: balilandscape, description: "A culinary experience in Bali." },
  { id: 2, name: "Bali Culinary 2", image: balilandscape, description: "A culinary experience in Bali." },
  { id: 3, name: "Bali Culinary 3", image: balilandscape, description: "A culinary experience in Bali." },
  { id: 4, name: "Bali Culinary 4", image: balilandscape, description: "A culinary experience in Bali." },
];

const natureBali = [
  { id: 1, name: "Bali Nature 1", image: javalandscape, description: "Nature experience in Bali." },
  { id: 2, name: "Bali Nature 2", image: javalandscape, description: "Nature experience in Bali." },
  { id: 3, name: "Bali Nature 3", image: javalandscape, description: "Nature experience in Bali." },
  { id: 4, name: "Bali Nature 4", image: javalandscape, description: "Nature experience in Bali." },
];

const culinaryJava = [
  { id: 1, name: "Java Culinary 1", image: balilandscape, description: "A culinary experience in Java." },
  { id: 2, name: "Java Culinary 2", image: balilandscape, description: "A culinary experience in Java." },
  { id: 3, name: "Java Culinary 3", image: balilandscape, description: "A culinary experience in Java." },
  { id: 4, name: "Java Culinary 4", image: balilandscape, description: "A culinary experience in Java." },
];

const natureJava = [
  { id: 1, name: "Java Nature 1", image: javalandscape, description: "Nature experience in Java." },
  { id: 2, name: "Java Nature 2", image: javalandscape, description: "Nature experience in Java." },
  { id: 3, name: "Java Nature 3", image: javalandscape, description: "Nature experience in Java." },
  { id: 4, name: "Java Nature 4", image: javalandscape, description: "Nature experience in Java." },
];

const RowDataGem = ({ category, province }) => {
  const [isMobile, setIsMobile] = useState(false);

  let data = [];
  if (category === 1 && province === 1) {
    data = culinaryBali;
  } else if (category === 2 && province === 1) {
    data = natureBali;
  } else if (category === 1 && province === 2) {
    data = culinaryJava;
  } else if (category === 2 && province === 2) {
    data = natureJava;
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {

    return (
      <div className="w-full overflow-x-auto">
        <div className="flex gap-4 p-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
                {item.name}
              </h2>
              <p className="text-gray-600 text-center text-sm truncate w-full">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full">
      {data.map((item, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
            {item.name}
          </h2>
          <p className="text-gray-600 text-center text-sm truncate w-full">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RowDataGem;