import React, { useEffect, useRef } from "react";
import { fetchCoord } from "../../api/mapCoord/fetchCoord";

const DestinationInfo = ({ place, categoryMapping, onPlaceChange }) => {  
  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const destinations = await fetchCoord(place.name);
        const coordinates = destinations?.data;

        if (coordinates) {
          const { latitude, longitude } = coordinates;
          onPlaceChange(latitude, longitude); // pass to callback
        }
      } catch (error) {
        console.error("Failed to fetch coord", error.message);
      }
    };

    getCoordinates();
  }, [place]);

  if (!place) {
    return <div className="text-gray-500">Data not found.</div>;
  }

  function formatRupiah(angka) {
    if (!angka || angka === "0") return "";
    let clean = angka.toString();
    if (clean.endsWith(".00")) {
      clean = clean.slice(0, -3);
    }
    const numberString = clean.replace(/[^,\d]/g, "");
    const split = numberString.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      rupiah += (sisa ? "." : "") + ribuan.join(".");
    }
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return "Rp. " + rupiah;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{place.name}</h1>
      <img
        src={
          place.place_picture
            ? place.place_picture.startsWith("data:image")
              ? place.place_picture // use as-is if it's a data URI
              : place.place_picture // use as-is if it's a URL
            : "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={place.name}
        className="w-full h-72 object-cover rounded-lg"
      />

      <p className="text-gray-600 mb-2">
        <strong>Description:</strong> {place.description}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Location:</strong> {place.location?.location_name || "Unknown"}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Estimated Price:</strong>{" "}
        {place.price === 0
          ? "Free"
          : place.price
          ? formatRupiah(place.price)
          : "-"}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Rating:</strong> {place.rating} / 5
      </p>
      {place.operational && (
        <div className="text-gray-600 mb-2">
          <strong>Operational Hours:</strong>
          <ul className="ml-4">
            {Object.entries(JSON.parse(place.operational)).map(([day, hours]) => (
              <li key={day}>
                <span className="font-medium">{day}:</span> {hours || "Closed"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DestinationInfo;
