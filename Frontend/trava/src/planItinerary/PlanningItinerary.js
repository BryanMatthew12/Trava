import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PlanItinerary from './contentPage/PlanItinerary';
import DestinationInfo from './contentPage/DestinationInfo';
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
  const place = useSelector(selectPlacesById(params));

  const sourceComponents = {
    header: PlanItinerary,
    destination: DestinationInfo,
  };



  const ContentComponent = sourceComponents[source] || (() => <div>Invalid source</div>);

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
          {place ? (
            <ContentComponent place={place} categoryMapping={categoryMapping} />
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