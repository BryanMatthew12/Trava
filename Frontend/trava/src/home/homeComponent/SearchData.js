import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import Cookies from "js-cookie";
import { viewPlace } from "../../api/places/viewPlace";

// Custom option component to show image and name
const OptionWithImage = (props) => (
  <div
    {...props.innerProps}
    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
  >
    <img
      src={props.data.place_picture}
      alt={props.data.place_name}
      className="w-10 h-10 object-cover rounded mr-3"
      style={{ minWidth: 40, minHeight: 40 }}
    />
    <span>{props.data.place_name}</span>
  </div>
);

const SearchData = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Load options for AsyncSelect
  const loadPlaceOptions = async (inputValue, callback) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${BASE_URL}/v1/places?name=${encodeURIComponent(inputValue)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      const options = data.map((place) => ({
        value: place.place_id,
        label: place.place_name,
        ...place,
      }));
      callback(options);
    } catch {
      callback([]);
    }
  };

  // Handle select
  const handleSelect = async (option) => {
    if (!option) return;
    setSelectedPlace(option);
    setSearchResults(option ? [option] : []);

    try {
      await viewPlace(option.place_id); // increment views
    } catch (e) {
      console.error(e);
    }

    // Mapping payload agar DestinationInfo tidak error
    const mappedPlace = {
      ...option,
      name: option.place_name,
      description: option.place_description,
      rating: option.place_rating,
      price: option.place_est_price,
      // tambahkan mapping lain jika perlu
    };

    navigate(
      `/PlanningItinerary?source=search&params=${option.place_id}`,
      { state: { place: mappedPlace } }
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <AsyncSelect
        cacheOptions
        loadOptions={loadPlaceOptions}
        onChange={handleSelect}
        placeholder="Search any place"
        isClearable
        components={{ Option: OptionWithImage }}
        noOptionsMessage={() => "No places found"}
      />
    </div>
  );
};

export default SearchData;