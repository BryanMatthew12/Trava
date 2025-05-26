import React, { useEffect, useState } from 'react'
import DestinationBanner from './destinationComponent/DestinationBanner'
import ProvinceComponent from './destinationComponent/ProvinceComponent'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDestinations } from '../api/destination/destination'
import { setDestinations, selectDestinations } from '../slices/destination/destinationSlice'

const Destinations = () => {
  const dispatch = useDispatch()
  const destinations = useSelector(selectDestinations)
  const [bannerId, setBannerId] = useState();
  const getBannerId = (id) => {
    setBannerId(id);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destinations = await fetchDestinations();
        console.log('Fetched destinationsxxxxx:', destinations);
        dispatch(setDestinations(destinations));
      } catch (error) {
        console.error('Failed to fetch destinations:', error.message);
      }
    };
    
    fetchData();
  }, [dispatch]);

  // Ambil destinasi pertama sebagai contoh
  const firstDestination = destinations && destinations.length > 0 ? destinations[0] : null;
  const destinationId = firstDestination ? firstDestination.destination_id : null;
  const selectedDestination = destinations.find(d => d.destination_id === destinationId);

  return (
    <div className="flex flex-col items-center space-y-6">
      <DestinationBanner destination={selectedDestination} bannerId={bannerId} />
      <ProvinceComponent dispatch={dispatch} getBannerId={getBannerId}/>
    </div>
  )
}

export default Destinations