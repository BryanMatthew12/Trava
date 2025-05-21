import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setHome, selectHome } from "../../slices/home/homeSlice";
import { viewPlace } from "../../api/places/viewPlace";
import { BASE_URL } from "../../config";
import Cookies from "js-cookie"; // Import js-cookie to access cookies

const RowData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const homes = useSelector(selectHome); // Get homes from Redux state

  useEffect(() => {
    const fetchHomes = async () => {
      // const data = await response.json();
      // console.log(data);
      
      try {
        const token = Cookies.get("token"); // Get the token from cookies

        const response = await fetch(`${BASE_URL}/v1/places?sort_by=descending`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token as a Bearer token
          },
        });
        if (!response.ok) {
          const errorText = await response.text(); // Get error details
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dispatch(setHome(data)); // Dispatch the data to Redux
      } catch (error) {
      }
    };

    fetchHomes();
  }, [dispatch]);

  // Handle navigation to a detailed page
  const handleItemClick = async (home) => {
    try {
      await viewPlace(home.id); // home.id = place_id
    } catch (e) {
      console.error(e);
    }
    navigate(`/PlanningItinerary?source=home&params=${home.id}`);
  };


  if (!homes || homes.length === 0) {
    return <p>No homes available to display.</p>; // Show a message if no homes are available
  }

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {homes.map((home, index) => {
      console.log("place_picture:", home.place_picture); // Log the place_picture here
        // console.log("home object:", home); // Add this line

      return (
        <div
          key={index}
          onClick={async () => await handleItemClick(home)}
          className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
        >
          <img
            src={
              home.place_picture
                ? home.place_picture
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={home.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
            {home.name}
          </h2>
          <p className="text-gray-600 text-center text-sm truncate w-full">
            {home.description}
          </p>
          <p className="text-sm text-gray-500">Rating: {home.rating} ★</p>
        </div>
      );
    })}
  </div>
);
};

export default RowData;