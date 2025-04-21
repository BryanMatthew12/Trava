import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "../../slices/auth/authSlice";
import { Link } from "react-router-dom";
import RowData from "./RowData";
import RowDataRecommended from "./RowDataRecommended";
import { BASE_URL } from "../../config";

const ExploreComponent = () => {
  const userId = useSelector(selectUserId); // Get the logged-in user's ID
  const [categoryIds, setCategoryIds] = useState([]); // State to store category IDs

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await fetch(`${BASE_URL}/v1/user_preferences/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user preferences: ${response.status}`);
        }
        const data = await response.json();
        setCategoryIds(data.category_ids); // Set the category IDs from the response
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    if (userId) {
      fetchUserPreferences(); // Fetch preferences only if userId is available
    }
  }, [userId]);

  return (
    <div className="w-full max-w-4xl px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore</h2>

      {/* Popular Destinations */}
      <div className="mb-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-700">
            Popular Destinations
          </h3>
          <Link
            to="/PopularDestinationsMore"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            See all
          </Link>
        </div>
        <RowData />
      </div>

      {/* Recommended Experiences */}
      <div className="mb-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-700">
            Recommended Experiences
          </h3>
          <span>See all</span>
        </div>
        <RowDataRecommended userId={userId} categoryIds={categoryIds} />
      </div>

      {/* Hidden Gems */}
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Hidden Gems</h3>
          <span>See all</span>
        </div>
        <RowData />
      </div>
    </div>
  );
};

export default ExploreComponent;
