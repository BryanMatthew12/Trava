import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { updatePlace } from "../api/admin/updatePlace";
import AsyncSelect from "react-select/async";
import { editPlaceByName } from "../api/admin/editPlaceByName";
import { selectDestinations } from "../slices/destination/destinationSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../config";
import ImageUploadCrop from "../api/admin/ImageUploadCrop"; // Pastikan path benar


const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const categories = [
  { id: 1, name: 'Adventure' },
  { id: 2, name: 'Culinary' },
  { id: 3, name: 'Shopping' },
  { id: 4, name: 'Culture' },
  { id: 5, name: 'Religious' },
];

const ratingOptions = Array.from({ length: 11 }, (_, i) => (i * 0.5).toFixed(1));

const EditPlacesById = () => {
  const { placeId } = useParams(); // Pastikan route: /admin/edit-place/:placeId
  const destinations = useSelector(selectDestinations);
    const [placeId2, setPlaceId2] = useState(placeId);
  const mappedDestinations = destinations.map((destination) => ({
    value: destination.id,
    label: destination.name,
  }));
  // const [placeName, setPlaceName] = useState("");
  // const [placeDescription, setPlaceDescription] = useState("");
  // const [placeRating, setPlaceRating] = useState("0.0");

  const [formData, setFormData] = useState({
    destination_id: "",
    place_name: "",
    place_description: "",
    location_id: "",
    place_rating: "0.0",
    place_picture: "",
    place_est_price: 0,
    operational: {},
    views: 0,
    category_ids: [],
  });

  const [defaultPlaceOptions, setDefaultPlaceOptions] = useState([]);
  const imageFileRef = useRef(null);


  // Fetch all places for defaultOptions
  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${BASE_URL}/v1/places/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const options = response.data.map((place) => ({
          value: place.place_name,
          label: place.place_name,
          place_id: place.place_id,
          destination_id: place.destination_id,
        }));
        setDefaultPlaceOptions(options);
      } catch {
        setDefaultPlaceOptions([]);
      }
    };
    fetchAllPlaces();
  }, []);

  const loadPlaceOptions = async (inputValue, callback) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${BASE_URL}/v1/places?name=${encodeURIComponent(inputValue)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const options = response.data.map((place) => ({
        value: place.place_name,
        label: place.place_name,
        place_id: place.place_id,
        destination_id: place.destination_id,
      }));
      callback(options);
    } catch {
      callback([]);
    }
  };

  // Fetch place data by id (implement your own API if needed)
  useEffect(() => {
    // TODO: fetch place detail by placeId and setFormData with result
    // Example:
    // fetchPlaceById(placeId).then(data => setFormData({...data, operational: JSON.parse(data.operational)}));
  }, [placeId]);

  const fetchPlaceDetail = async (place_id) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${BASE_URL}/v1/places/${place_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch {
      return null;
    }
  };

  function mapPlaceDetailToForm(place) {
    const parsedOperational = typeof place.operational === "string"
      ? JSON.parse(place.operational)
      : (place.operational || {});

    const formattedOperational = {};
    for (const [day, hours] of Object.entries(parsedOperational)) {
      const [start, end] = hours.split("-");
      formattedOperational[day] = { start, end };
    }

    return {
      place_id: place.place_id || "",
      destination_id: place.destination_id || "",
      place_name: place.place_name || "",
      place_description: place.place_description || "",
      location_id: place.location_id || "",
      place_rating: place.place_rating ? parseFloat(place.place_rating).toFixed(1) : "0.0",
      place_picture: place.place_picture || "",
      place_est_price: place.place_est_price ? parseInt(place.place_est_price) : 0,
      operational: formattedOperational, // Autofill operational hours
      views: place.views || 0,
      category_ids: place.categories
        ? place.categories.map((cat) => cat.category_id)
        : [],
    };
  }

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "category_ids") {
    const categories = value.split(",").map((id) => parseInt(id.trim()));
    setFormData({ ...formData, category_ids: categories });
  } else if (daysOfWeek.includes(name.split("-")[0])) {
    // Handle operational hours
    const [day, type] = name.split("-");
    setFormData({
      ...formData,
      operational: {
        ...formData.operational,
        [day]: {
          ...formData.operational[day],
          [type]: value,
        },
      },
    });
  } else {
    // Handle other fields like place_name, place_description, and place_rating
    setFormData({ ...formData, [name]: value });
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Format operational hours
  const formattedOperational = {};
  for (const day of daysOfWeek) {
    const dayData = formData.operational[day];
    if (dayData?.start && dayData?.end) {
      formattedOperational[day] = `${dayData.start}-${dayData.end}`;
    }
  }

  const finalData = {
    ...formData,
    place_rating: parseFloat(formData.place_rating),
    place_est_price: parseInt(formData.place_est_price),
    operational: JSON.stringify(formattedOperational),
  };

  await updatePlace(formData.place_id, finalData, placeId2, { "Content-Type": "application/json" });

  let payload;
  let headers = {};

  // Handle image file from imageFileRef
  if (imageFileRef.current instanceof Blob) {
    // Create a File from the Blob to ensure it has a name/type
    const file = new File([imageFileRef.current], "image.jpg", {
      type: imageFileRef.current.type || "image/jpeg",
    });

    payload = new FormData();
    Object.entries(finalData).forEach(([key, value]) => {
      if (key === "category_ids") {
        value.forEach((v) => payload.append("category_ids[]", v));
      } else {
        payload.append(key, value);
      }
    });

    payload.append("place_picture", file);
    headers = {}; // Let browser set Content-Type to multipart/form-data
  } else {
    // No image file, send JSON normally
    payload = finalData;
    headers["Content-Type"] = "application/json";
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Edit Place</h2>

      <AsyncSelect
        cacheOptions
        defaultOptions={defaultPlaceOptions}
        loadOptions={loadPlaceOptions}
        value={
          formData.place_name
            ? { value: formData.place_name, label: formData.place_name }
            : null
        }
        onChange={async (option) => {
          if (option) {
            const detail = await fetchPlaceDetail(option.place_id);
            if (detail) {
                setPlaceId2(detail.place_id);
              setFormData(mapPlaceDetailToForm(detail));
            }
          } else {
            setFormData({
              destination_id: "",
              place_name: "",
              place_description: "",
              location_id: "",
              place_rating: "0.0",
              place_picture: "",
              place_est_price: 0,
              operational: {},
              views: 0,
              category_ids: [],
            });
          }
        }}
        placeholder="Search and select a place by name"
      />

      {/* place name */}
      <input name="place_name" value={formData.place_name} placeholder="Place Name" onChange={handleChange} required className="w-full p-2 border rounded" />
      
      {/* place description */}
      <textarea name="place_description" value={formData.place_description} placeholder="Description" onChange={handleChange} required className="w-full p-2 border rounded" />
      
      {/* place image */}
      <ImageUploadCrop
        onImageCropped={base64 => {
          setFormData({ ...formData, place_picture: base64 });
          imageFileRef.current = null;
        }}
      />

      {/* place est price */}
      <input name="place_est_price" value={formData.place_est_price} placeholder="Estimated Price" type="number" onChange={handleChange} required className="w-full p-2 border rounded" />

      {/* place rating */}
      <div>
        <label className="block mb-1 font-medium">Rating</label>
        <input
          name="place_rating"
          type="number"
          step="0.01"
          min="0"
          max="5"
          value={formData.place_rating}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Input rating (0 - 5)"
        />
      </div>

      {/* category place */}
      <Select
        options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
        isMulti
        value={categories.filter(cat => formData.category_ids.includes(cat.id)).map(cat => ({ value: cat.id, label: cat.name }))}
        onChange={(selectedOptions) => {
          const selectedValues = selectedOptions.map((option) => option.value);
          setFormData({ ...formData, category_ids: selectedValues });
        }}
        placeholder="Select categories"
      />

      {/* place operational hours */}
      <fieldset className="border p-3 rounded">
        <legend className="font-semibold">Operational Hours</legend>
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center space-x-2 mb-2">
            <span className="capitalize w-24">{day}</span>
            <input
              type="time"
              name={`${day}-start`}
              value={formData.operational[day]?.start || ""}
              onChange={handleChange}
              className="border p-1 rounded"
            />
            <span>to</span>
            <input
              type="time"
              name={`${day}-end`}
              value={formData.operational[day]?.end || ""}
              onChange={handleChange}
              className="border p-1 rounded"
            />
          </div>
        ))}
      </fieldset>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  );
};

export default EditPlacesById;