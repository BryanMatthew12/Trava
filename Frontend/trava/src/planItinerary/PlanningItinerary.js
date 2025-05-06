import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PlanItinerary from './contentPage/PlanItinerary';
import DestinationInfo from './contentPage/DestinationInfo';
import { selectHome3ById, selectHome2ById, selectHomeById } from '../slices/home/homeSlice';
import { selectPlacesById } from '../slices/places/placeSlice';
import { useSelector } from 'react-redux';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import GOOGLE_MAPS_API_KEY from '../api/googleKey/googleKey'; 

const categoryMapping = {
  1: 'Adventure',
  2: 'Culinary',
  3: 'Shopping',
  4: 'Culture',
  5: 'Religious',
};


const PlanningItinerary = () => {
  const [latitude, setLatitude] = useState(0);
  const [langitude, setLangitude] = useState(0);

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: latitude,
    lng: langitude,
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get('source');
  const params = Number(queryParams.get('params'));

  const place = useSelector(selectPlacesById(params));
  const home = useSelector(selectHomeById(params));
  const home2 = useSelector(selectHome2ById(params));
  const home3 = useSelector(selectHome3ById(params));

  const sourceComponents = {
    header: PlanItinerary,
    destination: DestinationInfo,
    home: DestinationInfo,
    recommended: DestinationInfo,
    hiddenGem: DestinationInfo,
  };

  const ContentComponent = sourceComponents[source] || (() => <div>Invalid source</div>);
  const contentData = (() => {
    if (source === 'home') {
      return home;
    } else if (source === 'recommended') {
      return home2;
    } else if (source === 'hiddenGem') {
      return home3;
    } else {
      return place;
    }
  })();

  // State to store the destination name received from DestinationInfo
  const [destinationName, setDestinationName] = useState('');

  // Callback function to receive the destination name
  const handleCoordinates = (lat, lng) => {
    setLangitude(lng);
    setLatitude(lat);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: Content */}
      <div className="w-1/2 bg-gray-100 overflow-y-auto">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <Link to="/home" className="text-xl font-bold text-gray-800 hover:underline">
            Trava
          </Link>
          <button className="text-blue-500 hover:underline">Export to PDF</button>
        </div>
        <div className="p-4">
          {/* {contentData ? ( */}
            <ContentComponent
              place={contentData}
              categoryMapping={categoryMapping}
              onPlaceChange={handleCoordinates} // Pass the callback function
            />
          {/* // ) : (
          //   <p>Loading place details...</p>
          // )} */}
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
            {/* Use destinationName for markers or other map logic */}
            <p>{destinationName}</p>
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default PlanningItinerary;