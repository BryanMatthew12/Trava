import React, { useState } from "react";
import { SearchBarBulk } from "./Bulk/SearchBarBulk";
import ShowDataBulk from "./Bulk/ShowDataBulk";
import CategoryBulk from "./Bulk/CategoryBulk";
import { postBulkPlace } from "../api/admin/postBulkPlace";

const AddBulkPlace = () => {
  const [bulkdata, setBulkData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [destinationId, setDestinationId] = useState(null);

  const handleAddBulk = async () => {
    if (bulkdata.results.length === 0 || selectedCategory.length === 0) {
      console.error("No bulk data or categories selected.");
      return;
    }
    try {
      // Map over bulkdata to construct the places array
      const places = bulkdata.results.map((item, index) => {
        // Extract Monday hours from weekday_text
        const mondayHours = JSON.stringify(
          item.opening_hours?.weekday_text?.[0]?.split(": ")[1] || "Unknown Hours"
        );

        return {
          destination_id: destinationId, // Auto-generate destination_id starting at 1
          place_name: item.name || "Unknown Place",
          place_description: item.description || "No description available",
          location_name: item.formatted_address || "Unknown Location",
          place_rating: item.rating || 0,
          place_picture: item.place_picture || "",
          place_est_price: item.price_level || 0,
          operational: mondayHours, // Use formatted Monday hours
          views: item.views || 0,
          category_ids: selectedCategory, // Use selectedCategory for category_ids
        };
      });

      // Construct the body object
      const requestBody = { places };

      console.log("Request Body:", requestBody); // Debugging

      // Send the request using postBulkPlace
      const response = await postBulkPlace(requestBody);
      console.log("Response:", response);
    } catch (error) {
      console.error("Error adding bulk places:", error.message);
    }
  };

  return (
    <>
      <SearchBarBulk setBulkData={setBulkData} setDestinationId={setDestinationId}/>
      <CategoryBulk setSelectedCategory={setSelectedCategory} />
      <button onClick={handleAddBulk} className="px-3 py-2 bg-blue-500 text-white rounded">
        Add Bulk Data
      </button>
      <ShowDataBulk bulkData={bulkdata} setBulkData={setBulkData}/>
    </>
  );
};

export default AddBulkPlace;
