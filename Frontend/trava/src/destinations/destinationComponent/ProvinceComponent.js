import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import TrendingRow from "./TrendingRow";
import RowDataProvince from "./RowDataProvince";
import GemComponent from "./GemComponent";
import { selectDestinations } from "../../slices/destination/destinationSlice";
import { fetchPlaces } from "../../api/places/places";
import { setPlaces } from "../../slices/places/placeSlice";

const ExploreComponent = ({ dispatch, getBannerId }) => {
  const destinations = useSelector(selectDestinations);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedProvinceLabel, setSelectedProvinceLabel] = useState("");

  const mappedDestinations = destinations.map((destination) => ({
    value: destination.id,
    label: destination.name,
  }));

  useEffect(() => {
    if (destinations.length > 0) {
      setSelectedProvinceId(destinations[0].id);
      setSelectedProvinceLabel(destinations[0].name);
    }
    getBannerId(destinations[0]?.id || null);
  }, [destinations]);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const places = await fetchPlaces(selectedProvinceId);
        dispatch(setPlaces(places));
      } catch (error) {
        console.error("Failed to fetch destinations:", error.message);
      }
    };

    fetchPlace();
  }, [selectedProvinceId]);

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvinceId(selectedOption?.value || null);
    setSelectedProvinceLabel(selectedOption?.label || "");
    getBannerId(selectedOption?.value || null);
  };

  return (
    <div className="w-full max-w-4xl px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Province</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Select
            id="province-select"
            options={mappedDestinations}
            value={mappedDestinations.find(
              (option) => option.value === selectedProvinceId
            )}
            onChange={handleProvinceChange}
            className="w-full"
            placeholder="Select a province"
          />
        </div>
        {/* {selectedProvinceId && (
          <RowDataProvince id={selectedProvinceId} />
        )} */}
      </div>

      {selectedProvinceId && (
        <>
          <TrendingRow provinceId={selectedProvinceId} provinceName={selectedProvinceLabel} />
          {/* <GemComponent province={selectedProvinceId} /> */}
        </>
      )}
    </div>
  );
};

export default ExploreComponent;