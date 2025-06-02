import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectDestinations } from "../slices/destination/destinationSlice";
import Select from "react-select";
import { editPlace } from "../api/admin/editPlace";
import GOOGLE_MAPS_API_KEY from "../api/googleKey/googleKey";
import { getPlaceGoogle } from "../api/admin/getPlaceGoogle";
import ConfirmSave from "../modal/ConfirmDelete/ConfirmSave"; // Pastikan path benar
import Success from "../modal/successModal/Success"; // Pastikan path benar

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

export default function EditPlaces() {
  const destinations = useSelector(selectDestinations);

  const mappedDestinations = destinations.map((destination) => ({
    value: destination.id,
    label: destination.name,
  }));

  const [formData, setFormData] = useState({
    google_place_id: "",
    destination_id: "",
    place_name: "",
    place_description: "",
    location_name: "",
    place_rating: "0.0",
    place_picture: "",
    place_est_price: 0,
    operational: {},
    views: 0,
    category_ids: [],
  });

  const [searchName, setSearchName] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "place_name") {
      // Update both place_name and location_name
      setFormData({ ...formData, place_name: value, location_name: value });
    } else if (name === "category_ids") {
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
    } else if(name == 'place_description'){
      setFormData({ ...formData, place_description : value });
    }else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const doSubmit = async () => {
    setIsConfirmOpen(false);

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
      place_picture: "",
      place_rating: parseFloat(formData.place_rating),
      place_est_price: parseInt(formData.place_est_price),
      operational: JSON.stringify(formattedOperational),
    };

    try {
      await editPlace(finalData);
      setShowSuccess(true); // Tampilkan modal sukses
      setTimeout(() => setShowSuccess(false), 2000); // Sembunyikan otomatis setelah 2 detik
    } catch (err) {
      console.error("Error submitting form:", err.message);
      // Optionally show error message to the user
    }
  };

  const handleLocalSearch = async () => {
    setSearchLoading(true);
    setSearchError("");
    try {
      const data = await getPlaceGoogle(searchName);

      // Parse operational hours from weekday_text
      let operational = {};
      if (data.opening_hours && data.opening_hours.weekday_text) {
        operational = parseWeekdayTextToOperational(
          data.opening_hours.weekday_text
        );
      }

      setFormData((prev) => ({
        ...prev,
        place_name: data.name || "",
        place_description: data.description || "",
        location_name: data.formatted_address || "",
        place_picture:
          data.photos && data.photos.length > 0
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
            : "",
        place_rating: data.rating ? data.rating.toString() : "0.0",
        operational, // <-- autofill operational hours!
      }));
    } catch (err) {
      setSearchError("Failed to fetch place data.");
    }
    setSearchLoading(false);
  };

  function parseWeekdayTextToOperational(weekdayTextArr) {
    // Example: "Tuesday: 6:00 AM – 4:30 PM"
    const operational = {};
    weekdayTextArr.forEach((line) => {
      const [day, times] = line.split(": ");
      if (!times || times.toLowerCase().includes("closed")) {
        operational[day] = { start: "", end: "" };
      } else {
        // Example times: "6:00 AM – 4:30 PM"
        const [startRaw, endRaw] = times.split("–").map((s) => s.trim());
        // Convert to 24-hour "HH:mm" format
        const to24 = (t) => {
          if (!t) return "";
          const [time, period] = t.split(/(AM|PM|am|pm)/i);
          let [h, m] = time.trim().split(":").map(Number);
          if (/pm/i.test(period) && h !== 12) h += 12;
          if (/am/i.test(period) && h === 12) h = 0;
          return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`;
        };
        operational[day] = {
          start: to24(startRaw),
          end: to24(endRaw),
        };
      }
    });
    return operational;
  }

  // Buat ratingOptions kelipatan 0.5
  let ratingOptions = Array.from({ length: 11 }, (_, i) =>
    (i * 0.5).toFixed(1)
  );

  // Jika formData.place_rating ada dan belum ada di ratingOptions, tambahkan
  if (formData.place_rating && !ratingOptions.includes(formData.place_rating)) {
    ratingOptions = [...ratingOptions, formData.place_rating].sort(
      (a, b) => parseFloat(a) - parseFloat(b)
    );
  }

  function formatRupiah(angka) {
    if (!angka || angka === "0") return ""; // <-- ubah di sini
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

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-xl mx-auto p-4 bg-white rounded shadow"
      >
        <h2 className="text-xl font-bold">Add New Place</h2>

        <Select
          options={mappedDestinations}
          onChange={(option) =>
            setFormData({ ...formData, destination_id: option.value })
          }
          placeholder="Select a destination"
        />
        <div className="flex gap-2 items-center">
          <input
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search place name (local API)"
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleLocalSearch}
            className="px-3 py-2 bg-blue-500 text-white rounded"
            disabled={searchLoading || !searchName}
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </div>
        {searchError && <div className="text-red-500">{searchError}</div>}
        <input
          name="place_name"
          value={formData.place_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="place_address"
          placeholder="Address"
          value={formData.location_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

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
            required
            className="w-full p-2 border rounded"
            placeholder="Input rating (0 - 5)"
          />
        </div>
        <input
          name="place_est_price"
          placeholder="Estimated Price"
          type="text"
          value={formatRupiah(formData.place_est_price)}
          onChange={e => {
            // Hanya simpan angka tanpa titik/koma/leading zero
            let value = e.target.value.replace(/[^0-9]/g, "");
            // Hilangkan leading zero
            if (value.startsWith("0")) value = value.replace(/^0+/, "");
            setFormData({ ...formData, place_est_price: value });
          }}
          required
          className="w-full p-2 border rounded"
        />

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
          Submit
        </button>
      </form>
      <ConfirmSave
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={doSubmit}
        message="Are you sure you want to save the changes?"
      />
      {showSuccess && <Success message="Data successfully saved!" />}
    </>
  );
}
