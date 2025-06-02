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
import { deletePlace } from "../api/admin/deletePlace"; // Tambahkan import
import ConfirmSave from "../modal/ConfirmDelete/ConfirmSave"; // Pastikan path benar

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const categories = [
  { id: 1, name: "Adventure" },
  { id: 2, name: "Culinary" },
  { id: 3, name: "Shopping" },
  { id: 4, name: "Culture" },
  { id: 5, name: "Religious" },
];

const ratingOptions = Array.from({ length: 11 }, (_, i) =>
  (i * 0.5).toFixed(1)
);

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Fetch all places for defaultOptions
  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_URL}/v1/places/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    if (placeId) {
      fetchPlaceDetail(placeId).then((detail) => {
        if (detail) {
          setFormData(mapPlaceDetailToForm(detail));
        }
      });
    }
  }, [placeId]);

  const fetchPlaceDetail = async (place_id) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${BASE_URL}/v1/places/${place_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch {
      return null;
    }
  };

  function mapPlaceDetailToForm(place) {
    // Pastikan parsedOperational adalah object { Monday: "08:00-22:00", ... }
    let parsedOperational = {};
    if (typeof place.operational === "string") {
      try {
        parsedOperational = JSON.parse(place.operational);
      } catch {
        // Jika gagal parse, coba deteksi format weekdayText Google
        // Misal: "Monday: 08:00–22:00, Tuesday: 08:00–22:00, ..."
        const regex = /([A-Za-z]+):\s*([\d:]+)[–-]([\d:]+)/g;
        let match;
        while ((match = regex.exec(place.operational))) {
          parsedOperational[match[1]] = `${match[2]}-${match[3]}`;
        }
      }
    } else if (typeof place.operational === "object" && place.operational !== null) {
      parsedOperational = place.operational;
    }

    // Pastikan setiap hari ada, meskipun kosong
    const formattedOperational = {};
    for (const day of daysOfWeek) {
      if (parsedOperational[day]) {
        const hours = parsedOperational[day];
        if (typeof hours === "string" && hours.includes("-")) {
          const [start, end] = hours.split("-");
          formattedOperational[day] = { start, end };
        } else {
          formattedOperational[day] = { start: "", end: "" };
        }
      } else {
        formattedOperational[day] = { start: "", end: "" };
      }
    }

    return {
      place_id: place.place_id || "",
      destination_id: place.destination_id || "",
      place_name: place.place_name || "",
      place_description: place.place_description || "",
      location_id: place.location_id || "",
      place_rating: place.place_rating
        ? parseFloat(place.place_rating).toFixed(1)
        : "0.0",
      place_picture: place.place_picture || "",
      place_est_price: place.place_est_price
        ? parseInt(place.place_est_price)
        : 0,
      operational: formattedOperational,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
    setPendingSubmit(true);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;
    try {
      await deletePlace(formData.place_id);
      alert("Place deleted successfully!");
      // Redirect, clear form, atau navigate sesuai kebutuhan
      // Misal: window.location.href = "/admin/places";
    } catch (err) {
      alert(err.message);
    }
  };

  const doSubmit = async () => {
    setIsConfirmOpen(false);
    setPendingSubmit(false);

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
      place_est_price: formData.place_est_price,
      operational: JSON.stringify(formattedOperational),
    };

    await updatePlace(formData.place_id, finalData, placeId2, {
      "Content-Type": "application/json",
    });

    // ...handle image upload if needed...
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto p-4 bg-white rounded shadow"
    >
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
              const mapped = mapPlaceDetailToForm(detail);
              console.log("Payload setelah pilih place:", mapped); // Tambahkan log ini
              setPlaceId2(detail.place_id);
              setFormData(mapped);
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
      <input
        name="place_name"
        value={formData.place_name}
        placeholder="Place Name"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      {/* place description */}
      <textarea
        name="place_description"
        value={formData.place_description}
        placeholder="Description"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      {/* place image */}
      <ImageUploadCrop
        onImageCropped={(base64) => {
          setFormData({ ...formData, place_picture: base64 });
          imageFileRef.current = null;
        }}
      />

      {/* place est price */}
      <input
        name="place_est_price"
        placeholder="Estimated Price"
        type="text"
        value={formatRupiah(formData.place_est_price)}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9]/g, "");
          if (value.startsWith("0")) value = value.replace(/^0+/, "");
          setFormData({ ...formData, place_est_price: value });
        }}
        required
        className="w-full p-2 border rounded"
      />

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
        value={categories
          .filter((cat) => formData.category_ids.includes(cat.id))
          .map((cat) => ({ value: cat.id, label: cat.name }))}
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

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
      <button
        type="button"
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
        onClick={handleDelete}
      >
        Delete
      </button>

      <ConfirmSave
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={doSubmit}
        message="Are you sure you want to save the changes?"
      />
    </form>
  );
};

function formatRupiah(angka) {
  if (!angka || angka === "0") return "";
  let clean = angka.toString();
  if (clean.endsWith(".00")) {
    clean = clean.slice(0, -3);
  }
  const numberString = clean.replace(/[^,\d]/g, "");
  const split = numberString.split(",");
  let sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    rupiah += (sisa ? "." : "") + ribuan.join(".");
  }
  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  return "Rp. " + rupiah;
}

export default EditPlacesById;
