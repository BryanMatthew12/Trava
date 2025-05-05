import React from 'react';
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
  const containerStyle = {
    width: '100%', // Full width
    height: '100%', // Full height
  };

  const center = {
    lat: -6.2088, // Jakarta latitude
    lng: 106.8456, // Jakarta longitude
  };

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get('source'); // Get the source
  const params = Number(queryParams.get('params')); // Convert params to a number

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
            <ContentComponent place={contentData} categoryMapping={categoryMapping} />
          {/* ) : (
            <p>Loading place details...</p>
          )} */}
        </div>
      </div>

      {/* Right Section: Google Map */}
      <div className="w-1/2 bg-gray-200">
        {/* <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}> */}
          {/* <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          > */}
            {/* Add markers or other components here */}
          {/* </GoogleMap> */}
        {/* </LoadScript> */}
      </div>
    </div>
  );
};

export default PlanningItinerary;