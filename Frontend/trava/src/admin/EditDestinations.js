import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { updateDestinationById } from "../api/admin/updateDestinations";
import { selectDestinations } from "../slices/destination/destinationSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../config";
import ImageUploadCrop from "../api/admin/ImageUploadCrop"; // Pastikan path benar
import ConfirmSave from "../modal/ConfirmDelete/ConfirmSave"; // Pastikan path benar

// Helper untuk preview gambar (base64 atau url)
function getImageSrc(src) {
  if (!src) return "";
  if (src.startsWith("data:image") || src.startsWith("http")) return src;
  return `${BASE_URL}/${src.replace(/^\/+/, "")}`;
}

const EditDestinations = () => {
  const destinations = useSelector(selectDestinations);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [formData, setFormData] = useState({
    destination_name: "",
    description: "",
    destination_picture: "",
  });
  const imageFileRef = useRef(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Fetch all destinations if not available in redux
  const [destinationOptions, setDestinationOptions] = useState([]);
  useEffect(() => {
    if (destinations && destinations.length > 0) {
      setDestinationOptions(
        destinations.map((d) => ({
          value: d.destination_id || d.id,
          label: d.destination_name || d.name,
          ...d,
        }))
      );
    } else {
      // fallback fetch
      const fetchDestinations = async () => {
        try {
          const token = Cookies.get("token");
          const response = await axios.get(`${BASE_URL}/v1/destinations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDestinationOptions(
            response.data.map((d) => ({
              value: d.destination_id || d.id,
              label: d.destination_name || d.name,
              ...d,
            }))
          );
        } catch {
          setDestinationOptions([]);
        }
      };
      fetchDestinations();
    }
  }, [destinations]);

  // Fetch destination detail when selected
  useEffect(() => {
    const fetchDetail = async (id) => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_URL}/v1/destinations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          destination_name: response.data.destination_name || "",
          description: response.data.description || "",
          destination_picture: response.data.destination_picture || "",
        });
      } catch {
        setFormData({
          destination_name: "",
          description: "",
          destination_picture: "",
        });
      }
    };
    if (selectedDestination) {
      fetchDetail(selectedDestination.value);
    } else {
      setFormData({
        destination_name: "",
        description: "",
        destination_picture: "",
      });
    }
  }, [selectedDestination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit, kirim base64 string/link ke backend
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const doSubmit = async () => {
    setIsConfirmOpen(false);
    if (!selectedDestination) return;
    await updateDestinationById(selectedDestination.value, {
      description: formData.description,
      destination_picture: formData.destination_picture,
    });
    // Tidak ada alert di sini
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold">Edit Destination</h2>
        <Select
          options={destinationOptions}
          value={selectedDestination}
          onChange={setSelectedDestination}
          placeholder="Select destination by name"
          isClearable
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Destination Picture (upload & preview) */}
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              setFormData((prev) => ({
                ...prev,
                destination_picture: ev.target.result,
              }));
            };
            reader.readAsDataURL(file);
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />

        {/* Preview */}
        {formData.destination_picture && (
          <img
            src={getImageSrc(formData.destination_picture)}
            alt="Preview"
            className="w-48 h-32 object-cover rounded border mb-2"
          />
        )}

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
      <ConfirmSave
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={doSubmit}
        message="Are you sure you want to save the changes?"
      />
    </>
  );
};

export default EditDestinations;