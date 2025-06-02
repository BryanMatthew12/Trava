import React, { useEffect, useState } from "react";
import { addBulkPlace } from "../../api/admin/addBulkPlace";
import Select from "react-select";
import { useSelector } from "react-redux";
import { selectDestinations } from "../../slices/destination/destinationSlice";

export const SearchBarBulk = ({setBulkData, setDestinationId}) => {
      const destinations = useSelector(selectDestinations);
  const [body, setBody] = useState({
    query: "",
    destination_id: "",
  });

  const mappedDestinations = destinations.map((destination) => ({
    value: destination.id,
    label: destination.name,
  }));
  

  const handleSearch = async () => {
    try{
        const response = await addBulkPlace(body);
       setBulkData(response);
        // Handle the response as needed, e.g., display results or update state
    }
    catch (error) {
        console.error("Error during search:", error);
        // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 mt-20">
      <Select
        options={mappedDestinations}
        onChange={(option) =>[
            setDestinationId(option.value),// Set the destination ID
            setBody((prev) => ({ ...prev, destination_id: option.value }))
        ]
        }
        placeholder="Select a destination"
      />
      <div className="flex gap-2 items-center">
        <input
          value={body.query}
          onChange={(e) =>
            setBody((prev) => ({ ...prev, query: e.target.value }))
          }
          placeholder="Search place name (local API)"
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          {"Search"}
        </button>
      </div>
    </div>
  )
}
