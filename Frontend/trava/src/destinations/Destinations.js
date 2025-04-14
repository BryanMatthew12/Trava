import React, {useEffect} from 'react'
import DestinationBanner from './destinationComponent/DestinationBanner'
import ProvinceComponent from './destinationComponent/ProvinceComponent'
import { useDispatch } from 'react-redux'
import { fetchDestinations } from '../api/destination/destination'
import { setDestinations } from '../slices/destination/destinationSlice'

const Destinations = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const destinations = await fetchDestinations(); // Fetch the data
        dispatch(setDestinations(destinations)); // Dispatch the data to Redux
      } catch (error) {
        console.error('Failed to fetch destinations:', error.message);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <DestinationBanner/>
      <ProvinceComponent dispatch={dispatch}/>
    </div>
  )
}

export default Destinations