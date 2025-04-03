import React, { useState, useEffect } from "react";
import javalandscape from "../../assets/img/javalandscape.jpg";

const popDes = [
  { image: javalandscape, title: "Destination 1", desc: "Beautiful place to visit" },
  { image: javalandscape, title: "Destination 2", desc: "Enjoy the scenic views" },
  { image: javalandscape, title: "Destination 3", desc: "Great cultural experience" },
  { image: javalandscape, title: "Destination 4", desc: "Perfect for relaxation" },
  { image: javalandscape, title: "Destination 5", desc: "Adventure awaits" },
];

const RowData = () => {
  const [isMobile, setIsMobile] = useState(false);

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
          {popDes.map((item, index) => (
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
      {popDes.map((item, index) => (
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

export default RowData;