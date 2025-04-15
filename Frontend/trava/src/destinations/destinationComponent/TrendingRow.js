import React from "react";
import { useNavigate } from "react-router-dom";
import RowDataTrending from "./RowDataTrending";

const TrendingRow = ({ provinceId, provinceName }) => {
  const navigate = useNavigate();

  const handleSeeAllClick = () => {
    navigate(`/TrendingMore?province=${provinceName}`); // Pass province name as a query parameter
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Trending</h3>
        <span
          onClick={handleSeeAllClick}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          See all
        </span>
      </div>
      <RowDataTrending />
    </div>
  );
};

export default TrendingRow;