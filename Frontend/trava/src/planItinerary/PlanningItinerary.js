import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PlanItinerary from './contentPage/PlanItinerary';
import DestinationInfo from './contentPage/DestinationInfo';
import { selectHome3ById, selectHome2ById, selectHomeById } from '../slices/home/homeSlice';
import { selectPlacesById } from '../slices/places/placeSlice';
import { useSelector } from 'react-redux';

const categoryMapping = {
  1: 'Adventure',
  2: 'Culinary',
  3: 'Shopping',
  4: 'Culture',
  5: 'Religious',
};

const PlanningItinerary = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get('source'); // Get the source
  const params = Number(queryParams.get('params')); // Convert params to a number

  // Select data based on the source
  const place = useSelector(selectPlacesById(params));
  const home = useSelector(selectHomeById(params)); // Get the home by ID from Redux state
  const home2 = useSelector(selectHome2ById(params)); // Get the recommended home by ID from Redux state
  const home3 = useSelector(selectHome3ById(params)); // Get the hidden gem home by ID from Redux state
  // Map source to components and data
  const sourceComponents = {
    header: PlanItinerary,
    destination: DestinationInfo,
    home: DestinationInfo,
    recommended: DestinationInfo,
    hiddenGem: DestinationInfo, // Use DestinationInfo for Home source
  };

  const ContentComponent = sourceComponents[source] || (() => <div>Invalid source</div>);
  const contentData = (() => {
    if (source === 'home') {
      return home; // Use home if source is 'home'
    } else if (source === 'recommended') {
      return home2; // Use home2 if source is 'recommended'
    } else if (source === 'hiddenGem') {
      return home3; // Use home3 if source is 'hiddenGem'
    } else {
      return place; // Default to place for other sources
    }
  })();

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <Link to="/home" className="text-xl font-bold text-gray-800 hover:underline">
            Trava
          </Link>
          <button className="text-blue-500 hover:underline">Export to PDF</button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          {contentData ? (
            <ContentComponent place={contentData} categoryMapping={categoryMapping} />
          ) : (
            <p>Loading place details...</p>
          )}
        </div>
      </div>
      <div className="w-1/2 bg-gray-200">
        <div className="h-full flex items-center justify-center">
          <h2 className="text-gray-600 text-xl">Maps</h2>
        </div>
      </div>
    </div>
  );
};

export default PlanningItinerary;