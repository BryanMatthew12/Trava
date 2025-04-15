import React from 'react';

const DestinationInfo = ({ place, categoryMapping }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{place.name}</h1>
      <img
        src={place.place_picture}
        alt={place.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <p className="text-gray-600 mb-2">
        <strong>Category:</strong>{' '}
        {Array.isArray(place.category)
          ? place.category.map((id) => categoryMapping[id]).join(', ')
          : categoryMapping[place.category]}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Description:</strong> {place.description}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Location:</strong> {place.location}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Estimated Price:</strong> ${parseFloat(place.price).toFixed(2)}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Rating:</strong> {place.rating} / 5
      </p>
    </div>
  );
};

export default DestinationInfo;