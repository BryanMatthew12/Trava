import React, { useState, useEffect } from "react";
import javalandscape from "../../assets/img/javalandscape.jpg";
import balilandscape from "../../assets/img/carousel-java-1.jpeg";

const baliDes = [
  { image: balilandscape, title: "Bali 1", desc: "Beautiful place to visit" },
  { image: balilandscape, title: "Bali 2", desc: "Enjoy the scenic views" },
  { image: balilandscape, title: "Bali 3", desc: "Great cultural experience" },
  { image: balilandscape, title: "Bali 4", desc: "Perfect for relaxation" },
  { image: balilandscape, title: "Bali 5", desc: "Adventure awaits" },
];

const javaDes = [
  { image: javalandscape, title: "Java 1", desc: "Beautiful place to visit" },
  { image: javalandscape, title: "Java 2", desc: "Enjoy the scenic views" },
  { image: javalandscape, title: "Java 3", desc: "Great cultural experience" },
  { image: javalandscape, title: "Java 4", desc: "Perfect for relaxation" },
  { image: javalandscape, title: "Java 5", desc: "Adventure awaits" },
];

const RowDataProvince = ({ province }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Determine the data to display based on the selected province
  const data = province === 1 ? baliDes : javaDes;

  // Check if the viewport is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile if width is less than 768px
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    // Horizontal scrollable list for mobile view
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
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
                {item.title}
              </h2>
              <p className="text-gray-600 text-center text-sm truncate w-full">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid for desktop view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full">
      {data.map((item, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
            {item.title}
          </h2>
          <p className="text-gray-600 text-center text-sm truncate w-full">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RowDataProvince;