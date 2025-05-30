import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PlanItinerary from "./contentPage/PlanItinerary";
import DestinationInfo from "./contentPage/DestinationInfo";
import ItineraryDetails from "./contentPage/ItineraryDetails";
import EditItinerary from "./editItinerary/EditItinerary";
import {
  selectHome3ById,
  selectHome2ById,
  selectHomeById,
} from "../slices/home/homeSlice";
import { selectPlacesById } from "../slices/places/placeSlice";
import { useSelector } from "react-redux";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import GOOGLE_MAPS_API_KEY from "../api/googleKey/googleKey";
import { exportToThreads } from "../api/itinerary/exportToThreads"; // Import fungsi exportToThreads

const categoryMapping = {
  1: "Adventure",
  2: "Culinary",
  3: "Shopping",
  4: "Culture",
  5: "Religious",
};

const PlanningItinerary = () => {
  const [latitude, setLatitude] = useState(0);
  const [langitude, setLangitude] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // State untuk status upload
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: latitude,
    lng: langitude,
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const params = Number(queryParams.get("params"));

  const place = useSelector(selectPlacesById(params));
  const home = useSelector(selectHomeById(params));
  const home2 = useSelector(selectHome2ById(params));
  const home3 = useSelector(selectHome3ById(params));

  const sourceComponents = {
    header: PlanItinerary,
    preview: ItineraryDetails,
    destination: DestinationInfo,
    home: DestinationInfo,
    recommended: DestinationInfo,
    hiddenGem: DestinationInfo,
    edit: EditItinerary,
    search: DestinationInfo,
  };

  const ContentComponent =
    sourceComponents[source] || (() => <div>Invalid source</div>);
  const placeFromState = location.state?.place;

  const contentData = (() => {
    if (placeFromState) return placeFromState;
    if (source === "home") {
      return home;
    } else if (source === "recommended") {
      return home2;
    } else if (source === "hiddenGem") {
      return home3;
    } else {
      return place;
    }
  })();

  // State to store the destination name received from DestinationInfo
  const [destinationName, setDestinationName] = useState("");

   const addMarker = (location) => {
    setMarkers((prevMarkers) => [...prevMarkers, location]);
  };

  const handleMapClick = (e) => {
    const newMarker = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    addMarker(newMarker);
  };

  // Callback function to receive the destination name
  const handleCoordinates = (lat, lng) => {
  // Check if the marker already exists
  const markerExists = markers.some(
    (marker) => marker.lat === lat && marker.lng === lng
  );

  if (!markerExists) {
    addMarker({ lat, lng }); // Add marker to the map
    setLangitude(lng);
    setLatitude(lat);
  } else {
    console.log("Marker with the same coordinates already exists.");
  }
};

  const handleUploadToThreads = () => {
    setIsModalOpen(true); // Buka modal konfirmasi
  };

  const handleConfirmUpload = async () => {
    setIsModalOpen(false); // Tutup modal
    setIsUploading(true); // Set status upload ke true
    try {
      const response = await exportToThreads(params); // Panggil fungsi exportToThreads
      alert("Itinerary successfully posted to Threads!");
    } catch (error) {
      console.error("Failed to post itinerary to Threads:", error.message);
      alert("Failed to post itinerary to Threads. Please try again.");
    } finally {
      setIsUploading(false); // Set status upload ke false
    }
  };

  const handleCancelUpload = () => {
    setIsModalOpen(false); // Tutup modal
  };


  return (
    <div className="flex h-screen">
      {/* Left Section: Content */}
      <div className="w-1/2 bg-gray-100 overflow-y-auto">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <Link
            to="/home"
            className="text-xl font-bold text-gray-800 hover:underline"
          >
            Trava
          </Link>
          <button
            className="text-blue-500 hover:underline"
            onClick={handleUploadToThreads}
            disabled={isUploading} // Disable tombol saat sedang upload
          >
            {isUploading ? "Uploading..." : "Upload to Threads"}
          </button>
        </div>
        <div className="p-4">
          <ContentComponent
            place={contentData}
            categoryMapping={categoryMapping}
            test={handleCoordinates}
            handleMapClick={handleMapClick}
          />
        </div>
      </div>

      {/* Right Section: Google Map */}
      <div className="w-1/2 bg-gray-200">
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker}
            // onClick={() => removeMarker(index)}
          />
        ))}
            <p>{destinationName}</p>
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Modal Konfirmasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <p className="text-gray-700 mb-4">
              Are you sure want to post it to Threads?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                onClick={handleCancelUpload}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmUpload}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningItinerary;
