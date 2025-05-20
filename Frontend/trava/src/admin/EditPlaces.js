import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectDestinations } from "../slices/destination/destinationSlice";
import Select from "react-select";
import { editPlace } from "../api/admin/editPlace";

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
    { id: 1, name: 'Adventure'},
    { id: 2, name: 'Culinary' },
    { id: 3, name: 'Shopping'},
    { id: 4, name: 'Culture'},
    { id: 5, name: 'Religious'},
  ];

const ratingOptions = Array.from({ length: 11 }, (_, i) => (i * 0.5).toFixed(1));

export default function EditPlaces() {
  const destinations = useSelector(selectDestinations);

   const mappedDestinations = destinations.map((destination) => ({
    value: destination.id,
    label: destination.name,
  }));

  const [formData, setFormData] = useState({
    destination_id: "",
    place_name: "",
    place_description: "",
    location_id: "2",
    place_rating: "0.0",
    place_picture: "",
    place_est_price: 0,
    operational: {},
    views: 0,
    category_ids: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_ids") {
      const categories = value.split(",").map((id) => parseInt(id.trim()));
      setFormData({ ...formData, category_ids: categories });
    } else if (daysOfWeek.includes(name.split("-")[0])) {
      // Example: name = "monday-start" or "monday-end"
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
      setFormData({ ...formData, [name]: value });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Format operational hours like "08:00-17:00"
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

  try {
    const result = await editPlace(finalData); // Await the result
    console.log("Success:", result);
    // Optionally reset form or show success toast
  } catch (err) {
    console.error("Error submitting form:", err.message);
    // Optionally show error message to the user
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">Add New Place</h2>

      <Select
        options={mappedDestinations}
        onChange={(option) => setFormData({ ...formData, destination_id: option.value })}
        placeholder="Select a destination"
        />
      <input name="place_name" placeholder="Place Name" onChange={handleChange} required className="w-full p-2 border rounded" />
      <textarea name="place_description" placeholder="Description" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="place_picture" placeholder="Image URL" onChange={handleChange} required className="w-full p-2 border rounded" />
      <input name="place_est_price" placeholder="Estimated Price" type="number" onChange={handleChange} required className="w-full p-2 border rounded" />

      <div>
        <label className="block mb-1 font-medium">Rating</label>
        <select name="place_rating" onChange={handleChange} className="w-full p-2 border rounded">
          {ratingOptions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <Select
        options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
        isMulti
        onChange={(selectedOptions) => {
          const selectedValues = selectedOptions.map((option) => option.value);
          setFormData({ ...formData, category_ids: selectedValues });
        }}
        placeholder="Select categories"
        />

      <fieldset className="border p-3 rounded">
        <legend className="font-semibold">Operational Hours</legend>
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center space-x-2 mb-2">
            <span className="capitalize w-24">{day}</span>
            <input
              type="time"
              name={`${day}-start`}
              onChange={handleChange}
              className="border p-1 rounded"
            />
            <span>to</span>
            <input
              type="time"
              name={`${day}-end`}
              onChange={handleChange}
              className="border p-1 rounded"
            />
          </div>
        ))}
      </fieldset>

      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}
