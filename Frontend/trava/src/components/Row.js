import React from "react";

function getImageSrc(place_picture) {
  if (!place_picture) return "https://via.placeholder.com/300x200?text=No+Image";
  return place_picture;
}

const Row = ({ data, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
    >
      <img
        src={getImageSrc(data.place_picture)}
        alt={data.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
        {data.name}
      </h2>
      <p className="text-gray-600 text-center text-sm truncate w-full">
        {data.description}
      </p>
      <p className="text-sm text-gray-500">Rating: {data.rating} ★</p>
    </div>
  );
};

export default Row;