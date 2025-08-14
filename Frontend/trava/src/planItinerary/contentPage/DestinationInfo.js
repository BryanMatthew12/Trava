import React, { useEffect } from "react";
import { fetchCoord } from "../../api/mapCoord/fetchCoord";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faMapMarkedAlt, faMoneyBillWave, faStar, faClock } from "@fortawesome/free-solid-svg-icons";

const DestinationInfo = ({ place, addMarker, test }) => {  
  useEffect(() => {
    console.log(place);
    
    if (!place) return;
    const getCoordinates = async () => {
      try {
        const destinations = await fetchCoord(place.name);
        const coordinates = destinations?.data;
        if (coordinates) {
          const { latitude, longitude } = coordinates;
          console.log("Fetched coordinates:", latitude, longitude);
          test(latitude, longitude);
          addMarker({lat : latitude, lng: longitude});
        }
      } catch (error) {
        console.error("Failed to fetch coord", error.message);
      }
    };
    getCoordinates();
  }, [place, test]);

  if (!place) {
    return <div className="text-gray-500 text-center py-10">Data not found.</div>;
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
    <div className="max-w-2xl mx-auto p-0 mt-8">
      <h1 className="text-3xl font-extrabold mb-3 text-gray-800">{place.name}</h1>
      <img
        src={
          place.place_picture
            ? place.place_picture.startsWith("data:image")
              ? place.place_picture
              : place.place_picture
            : "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={place.name}
        className="w-full h-72 object-cover mb-4 rounded-xl border"
        style={{ boxShadow: "none" }}
      />

      {place.description && (
        <p className="text-base text-gray-700 font-semibold mb-6">{place.description}</p>
      )}

      {/* Info utama pakai icon saja */}
      <div className="space-y-5 text-lg mb-2">
        {/* Description
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-600 text-xl" />
          </span>
          <span className="text-gray-800">{place.description}</span>
        </div> */}
        {/* Location */}
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
            <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-700 text-xl" />
          </span>
          <span className="text-gray-800">{place.location?.location_name || place.location || "Unknown"}</span>
        </div>
        {/* Estimated Price */}
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-700 text-xl" />
          </span>
          <span className="text-gray-800 font-semibold">
            {place.price === 0
              ? "Free"
              : place.price
              ? formatRupiah(place.price)
              : "-"}
          </span>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-50">
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl" />
          </span>
          <span className="flex flex-col items-start">
            <span className="flex items-center gap-1">
              {/* Bintang dinamis */}
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className={
                    i < Math.floor(place.rating)
                      ? "text-yellow-400 text-lg"
                      : "text-gray-300 text-lg"
                  }
                />
              ))}
            </span>
            <span className="text-xs font-bold text-gray-500 mt-1">{place.rating} / 5</span>
          </span>
        </div>
      </div>

      {/* Operational Hours */}
      {place.operational && (
        <div className="mt-8">
          <strong className="block text-xl mb-3 text-blue-700">Operational Hours</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
            {Object.entries(JSON.parse(place.operational)).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-3">
                <FontAwesomeIcon icon={faClock} className="text-blue-400 mr-1" />
                <span className="font-semibold text-base text-gray-900 w-28">{day}</span>
                <span className={hours ? "text-base font-mono text-gray-700" : "text-red-500 font-semibold"}>
                  {hours || "Closed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationInfo;