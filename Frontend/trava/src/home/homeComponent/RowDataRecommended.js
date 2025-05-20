import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHomes } from "../../api/home/home";
import { useSelector } from "react-redux";
import { selectUserId } from "../../slices/auth/authSlice";
import { setHome2 } from "../../slices/home/homeSlice";
import { useDispatch } from "react-redux";
import { viewPlace } from "../../api/places/viewPlace";

const RowDataRecommended = ({ home2 }) => {
  const navigate = useNavigate();
  const [recommendedHomes, setRecommendedHomes] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const id = useSelector(selectUserId); // Get user ID from Redux
  const dispatch = useDispatch(); // Get dispatch function from Redux
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHomes(id); // Fetch data using the API function
        if (response) {
          setRecommendedHomes(response); // Set the fetched data
          dispatch(setHome2(response));
        }
      } catch (error) {
        console.error("Error fetching recommended places:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (id) {
      fetchData(); // Fetch data only if userId is available
    }
  }, [id]);

  // Handle navigation to a detailed page
  const handleItemClick = async (home) => {
    try {
      await viewPlace(home.place_id); // gunakan place_id untuk API
    } catch (e) {
      console.error(e);
    }
    navigate(`/PlanningItinerary?source=recommended&params=${home.place_id}`);
  };

  // if (loading) {
  //   return <p>Loading recommended places...</p>; // Show a loading message
  // }

  if (!recommendedHomes || recommendedHomes.length === 0) {
    return <p>No recommended places available to display.</p>; // Show a message if no data is available
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {recommendedHomes.map((home) => (
        <div
          key={home.id}
          onClick={async () => await handleItemClick(home)}
          className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
        >
          <img
            src={home.place_picture}
            alt={home.place_name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
            {home.place_name}
          </h2>
          <p className="text-gray-600 text-center text-sm truncate w-full">
            {home.place_description}
          </p>
          <p className="text-sm text-gray-500">Rating: {home.place_rating} ★</p>
          <p className="text-sm text-gray-500">
            Categories:{" "}
            {home.categories.map((category) => category.name).join(", ")}
          </p>
          <p className="text-sm text-gray-500">Location: {home.location}</p>
          <p className="text-sm text-gray-500">Views: {home.views}</p>
        </div>
      ))}
    </div>
  );
};

export default RowDataRecommended;