import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserId } from "../../slices/auth/authSlice";
import { fetchUserPreferences } from "../../api/home/fetchUserPreference";
import { Link } from "react-router-dom";
import SearchData from "./SearchData";
import RowData from "./RowData";
import RowDataRecommended from "./RowDataRecommended";
import RowDataHiddenGem from "./RowDataHiddenGem";
import { BASE_URL } from "../../config";

const ExploreComponent = () => {
  const userId = useSelector(selectUserId); // Get the logged-in user's ID
  const [categoryIds, setCategoryIds] = useState([]); // State to store category IDs
  useEffect(() => {
  const fetchPreferences = async () => {
    try {
      const response = await fetchUserPreferences(userId);
      // response.data sudah berisi hasilnya
      setCategoryIds(response.data.category_ids); // atau sesuaikan dengan struktur data
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };
  fetchPreferences();
}, [userId]);


  return (
    <div className="w-full max-w-4xl px-4">
      <SearchData />
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
          <Link
            to="/RecommendedDestinationsMore"
            className="text-blue-500 cursor-pointer hover:underline"
          >
          See all
          </Link>
        </div>
        <RowDataRecommended userId={userId} />
      </div>

      {/* Hidden Gems */}
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Hidden Gems</h3>
          <Link
            to="/HiddenGemsMore"
            className="text-blue-500 cursor-pointer hover:underline"
          >
          See all
          </Link>
        </div>
        <RowDataHiddenGem />
      </div>
    </div>
  );
};

export default ExploreComponent;
