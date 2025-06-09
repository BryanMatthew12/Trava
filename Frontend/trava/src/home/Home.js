import React ,{useEffect}from "react";
import ImageBanner from "./homeComponent/ImageBanner";
import ExploreComponent from "./homeComponent/ExploreComponent";
import UsertripThreads from "./homeComponent/UsertripThreads";
import { useDispatch } from 'react-redux'
import { fetchDestinations } from '../api/destination/destination'
import { setDestinations } from '../slices/destination/destinationSlice'

const Home = () => {
  const dispatch = useDispatch()
  const fetchDestination = async () => {
    try {
      const destinations = await fetchDestinations(); // Fetch the data
      dispatch(setDestinations(destinations)); // Dispatch the data to Redux
    } catch (error) {
      console.error('Failed to fetch destinations:', error.message);
    }
  };



  useEffect(() => {

    fetchDestination();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 mb-4">
        <ImageBanner/>
        <UsertripThreads/>
        <ExploreComponent/>
    </div>
  );
};

export default Home;