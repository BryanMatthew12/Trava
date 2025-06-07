import React, { useState } from "react";
import { SearchBarBulk } from "./Bulk/SearchBarBulk";
import ShowDataBulk from "./Bulk/ShowDataBulk";
import CategoryBulk from "./Bulk/CategoryBulk";
import { postBulkPlace } from "../api/admin/postBulkPlace";
import Success from "../modal/successModal/Success";
import Loading from "../modal/loading/Loading"; // <-- import Loading

const AddBulkPlace = () => {
  const [bulkdata, setBulkData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [destinationId, setDestinationId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // <-- state loading

  const parseWeekdayTextToOperational = (weekdayTextArr) => {
    // weekdayTextArr: ["Monday: 7:00 AM – 10:00 PM", ...]
    const operational = {};
    if (!Array.isArray(weekdayTextArr)) return operational;
    weekdayTextArr.forEach((line) => {
      const [day, times] = line.split(": ");
      if (!times || times.toLowerCase().includes("closed")) {
        operational[day] = "";
      } else {
        // Example times: "7:00 AM – 10:00 PM"
        const [startRaw, endRaw] = times.split("–").map((s) => s.trim());
        const to24 = (t) => {
          if (!t) return "";
          const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
          if (!match) return "";
          let h = parseInt(match[1], 10);
          let m = parseInt(match[2], 10);
          const period = match[3];
          if (period) {
            if (/pm/i.test(period) && h !== 12) h += 12;
            if (/am/i.test(period) && h === 12) h = 0;
          }
          return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        };
        operational[day] = `${to24(startRaw)}-${to24(endRaw)}`;
      }
    });
    return operational;
  };

  const handleAddBulk = async () => {
    if (bulkdata.results.length === 0 || selectedCategory.length === 0) {
      console.error("No bulk data or categories selected.");
      return;
    }
    setIsLoading(true); // <-- mulai loading
    try {
      const places = bulkdata.results.map((item, index) => {
        const operational = parseWeekdayTextToOperational(
          item.opening_hours?.weekday_text
        );
        return {
          destination_id: destinationId,
          place_name: item.name || "Unknown Place",
          place_description: item.description || "No description available",
          location_name: item.formatted_address || "Unknown Location",
          place_rating: item.rating || 0,
          place_picture: item.place_picture || "",
          place_est_price: item.place_est_price || 0,
          operational: JSON.stringify(operational),
          views: item.views || 0,
          category_ids: selectedCategory,
        };
      });

      const batchSize = 1;
      for (let i = 0; i < places.length; i += batchSize) {
        const batch = places.slice(i, i + batchSize);
        const response = await postBulkPlace({ places: batch });
        console.log(`Batch ${i / batchSize + 1} response:`, response);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding bulk places:", error.message);
    } finally {
      setIsLoading(false); // <-- selesai loading
    }
  };

  return (
    <>
      {isLoading && <Loading />} {/* <-- tampilkan loading */}
      <SearchBarBulk setBulkData={setBulkData} setDestinationId={setDestinationId}/>
      <CategoryBulk setSelectedCategory={setSelectedCategory} />
      <button onClick={handleAddBulk} className="px-3 my-10 py-2 bg-blue-500 text-white rounded">
        Add Bulk Data
      </button>
      <ShowDataBulk bulkData={bulkdata} setBulkData={setBulkData}/>
      {showSuccess && <Success message="Bulk sudah updated" />}
    </>
  );
};

export default AddBulkPlace;