import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlaces } from "../../api/places/places";
import { selectPlaces } from "../../slices/places/placeSlice";
import { useSelector } from "react-redux";


const RowDataProvince = ({}) => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const places = useSelector(selectPlaces);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleItemClick = (item) => {
    navigate('/PlanningItinerary?source=rowdataprovince')
  };

  if (isMobile) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex gap-4 p-4">
          {places.map((place, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(place)}
              className="flex-shrink-0 w-64 border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
            >
              <img
                src={place.place_picture}
                alt={place.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
                {place.name}
              </h2>
              <p className="text-gray-600 text-center text-sm truncate w-full">
                {place.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 w-full">
      {places.map((place, index) => (
        <div
          key={index}
          onClick={() => handleItemClick(place)}
          className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
        >
          <img
            src={place.place_picture}
            alt={place.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
            {place.name}
          </h2>
          <p className="text-gray-600 text-center text-sm truncate w-full">
            {place.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RowDataProvince;