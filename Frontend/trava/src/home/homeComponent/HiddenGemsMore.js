import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchHiddenGems } from "../../api/home/homeHidden"; // API function to fetch hidden gems
import { setHome3, selectHiddenGems } from "../../slices/home/homeSlice"; // Redux actions and selectors

const HiddenGemsMore = () => {
  const hiddenGems = useSelector(selectHiddenGems); // Fetch hidden gems from Redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHiddenGems(); // Fetch data from API
        if (response) {
          dispatch(setHome3(response)); // Save data to Redux state
        }
      } catch (error) {
        console.error("Error fetching hidden gems:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [dispatch]);

  // Handle navigation to a detailed page
  const handleItemClick = (home) => {
    navigate(`/PlanningItinerary?source=hiddenGem&params=${home.id}`);
  };

  if (loading) {
    return <p>Loading hidden gems...</p>; // Show a loading message
  }

  if (!hiddenGems || hiddenGems.length === 0) {
    return <p>No hidden gems available to display.</p>; // Show a message if no data is available
  }

  return (
    <div className="flex h-screen">
      {/* Left Section: List of Hidden Gems */}
      <div className="w-1/2 bg-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold">Hidden Gems</h1>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {hiddenGems.map((home, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(home)} // Navigate on click
                className="grid grid-cols-3 gap-4 items-center bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Picture */}
                <img
                  src={home.place_picture}
                  alt={home.name}
                  className="w-full h-32 object-cover rounded-lg col-span-1"
                />
                {/* Details */}
                <div className="col-span-2 flex flex-col">
                  <h2 className="font-semibold text-lg">{home.name}</h2>
                  <p className="text-sm text-gray-600">{home.description}</p>
                  <p className="text-sm text-gray-500">Rating: {home.rating} ★</p>
                  <p className="text-sm text-gray-500">Views: {home.views}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Static Maps Box */}
      <div className="w-1/2 bg-gray-200">
        <div className="h-full flex items-center justify-center">
          <h2 className="text-gray-600 text-xl">Maps</h2>
        </div>
      </div>
    </div>
  );
};

export default HiddenGemsMore;