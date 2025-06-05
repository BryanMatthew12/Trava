import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlaces,
  appendPlaces,
  clearPlaces,
  selectPlaces,
} from "../../slices/places/placeSlice";
import { useLocation } from "react-router-dom";
import { fetchPlaces } from "../../api/places/places"; // Import fetchPlaces
import { editBudget } from "../../api/itinerary/editBudget";
import Select from "react-select"; // Import React-Select
import { useSearchParams } from "react-router-dom";
import { fetchDayId } from "../../api/dayId/fetchDayId"; // Import fetchDayId
import { useNavigate } from "react-router-dom";
import { postItinerary } from "../../api/itinerary/postItinerary";
import { deleteItinerary } from "../../api/itinerary/deleteItinerary"; // Import deleteItinerary
import { fetchCoord } from "../../api/mapCoord/fetchCoord"; // Import fetchCoord
import { patchDescription } from "../../api/itinerary/patchDescription";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Success from "../../modal/successModal/Success"; // Import Success modal
import Loading from "../../modal/loading/Loading";
import ConfirmDelete from "../../modal/ConfirmDelete/ConfirmDelete"; // Import ConfirmDelete
import { getItineraryDetails } from "../../api/itinerary/getItineraryDetails";
import { editName } from "../../api/itinerary/editName";

const PlanItinerary = ({ test }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const places = useSelector(selectPlaces); // Get places from Redux store
  const [dayId, setDayId] = useState([]); // State to store dayId
  const [page, setPage] = useState(1); // State to manage pagination
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control success modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(
    location.state?.budget || 0
  ); // State untuk budget
  const itineraryId = searchParams.get("params"); // Get itineraryId from URL params
  const [destinations, setDestinations] = useState([]); // State to store destinations
  const [selectPlace, setSelectPlace] = useState(); // State to store selected places
  const [activePlaceId, setActivePlaceId] = useState(null); // State to track active place ID
  const [description, setDescription] = useState(location.state?.desc || ""); // State to store description
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [fetchedPlaces, setFetchedPlaces] = useState({});
  const [itineraryName, setItineraryName] = useState(""); // State to store itinerary name
  const [isEditingName, setIsEditingName] = useState(false); // State to track editing mode for itinerary name

  const { start, end, budget, desc, destination, destinationId } =
    location.state || {}; // Destructure the state object
  const [totalSpent, setTotalSpent] = useState(0); // State to track total spent
  const [visibleBudget, setVisibleBudget] = useState(budget); // State to track visibility of budget

  // Calculate the number of days
  const startDate = new Date(start);
  const endDate = new Date(end);
  const tripDuration =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start day

  // Generate an array of days
  const days = Array.from({ length: tripDuration }, (_, i) => `Day ${i + 1}`);

  // State to track visibility of each day's details
  const [visibleDays, setVisibleDays] = useState(
    Array.from({ length: tripDuration }, () => true) // Default: all days visible
  );

  // Calculate leftover budget dynamically
  const leftoverBudget = visibleBudget - totalSpent;

  // Fetch places based on destinationId when component mounts
  useEffect(() => {
    const fetchPlacesByDestination = async () => {
      if (destinationId) {
        try {
          const placesData = await fetchPlaces(destinationId, 1); // Fetch initial places (page 1)
          dispatch(setPlaces(placesData)); // Dispatch places to Redux store
        } catch (error) {
          console.error(
            "Error fetching places by destinationId:",
            error.message
          );
          dispatch(clearPlaces()); // Clear places if there's an error
        }
      }
    };

    fetchPlacesByDestination();
  }, [destinationId, dispatch]);

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        const dayData = await fetchDayId(itineraryId); // Fetch the day data
        const dayIds = dayData.map((day) => day.day_id); // Extract all day_id values
        setDayId(dayIds); // Set the dayId state with the extracted day_id values
      } catch (error) {
        console.error("Error fetching day data:", error.message);
      }
    };

    fetchDayData();
  }, [itineraryId]);

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const destinations = await fetchCoord(selectPlace);
        const coordinates = destinations?.data;

        if (coordinates) {
          const { latitude, longitude } = coordinates;

          // Call test function
          if (typeof test === "function") {
            console.log("Coordinates fetched:", latitude, longitude);
            test(latitude, longitude);
          }

          // Store in cache
          setFetchedPlaces((prev) => ({
            ...prev,
            [selectPlace]: { latitude, longitude },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch coord", error.message);
      }
    };

    if (!selectPlace) return;

    // If coordinates are already cached for this place
    if (fetchedPlaces[selectPlace]) {
      const { latitude, longitude } = fetchedPlaces[selectPlace];
      if (typeof test === "function") {
        test(latitude, longitude);
      }
    } else {
      // Not cached, fetch coordinates
      getCoordinates();
    }
  }, [selectPlace, test, fetchedPlaces]); // Include selectPlace in the dependency array

  // Handle loading more places when scrolling to the bottom
  const handleNextPage = async () => {
    if (isLoading) return; // Prevent multiple requests if already loading
    setIsLoading(true); // Set loading state to true

    try {
      const nextPage = page + 1; // Increment the page
      const newPlaces = await fetchPlaces(destinationId, nextPage); // Fetch places for the next page
      dispatch(appendPlaces(newPlaces)); // Append new places to Redux store
      setPage(nextPage); // Update the current page
    } catch (error) {
      console.error("Error loading more places:", error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const toggleDayVisibility = (index) => {
    setVisibleDays((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const handleSelectPlace = (selectedOption, dayId) => {
    setSelectPlace(selectedOption.label);

    setDestinations((prevDestinations) => {
      const filteredDestinations = prevDestinations.filter(
        (destination) =>
          !(
            destination.place_id === selectedOption.value &&
            destination.day_id === dayId
          )
      );

      const visitOrder =
        filteredDestinations.filter(
          (destination) => destination.day_id === dayId
        ).length + 1;

      const newDestination = {
        place_id: selectedOption.value,
        day_id: dayId,
        visit_order: visitOrder,
      };

      return [...filteredDestinations, newDestination];
    });
  };

  const handleDeletePlace = (placeId, dayId) => {
    setDestinations((prevDestinations) =>
      prevDestinations.filter(
        (destination) =>
          !(destination.place_id === placeId && destination.day_id === dayId)
      )
    );
  };

  const handleDelete = async () => {
    try {
      const response = await deleteItinerary(itineraryId, navigate);
      if (response) {
        return;
      } else {
        console.error("Failed to delete itinerary:", response.message);
      }
    } catch (error) {
      console.error("Error deleting itinerary:", error.message);
    }
  };

  const handleSaveItinerary = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      // PATCH description dulu
      // await patchDescription(itineraryId, description);

      // Lalu POST destinations
      const response = await postItinerary(
        itineraryId,
        destinationId,
        destinations,
        navigate
      );
    
      if (response) {
        setIsLoading(false); // Reset loading state
        setShowSuccessModal(true); // Show success modal
        return;
      } else {
        console.error("Failed to save itinerary:", response.message);
      }
    } catch (error) {
      console.error("Error saving itinerary:", error.message);
      alert("An error occurred while saving the itinerary.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const setBudget = (newBudget) => {
    setCurrentBudget(newBudget); // Perbarui state `currentBudget`
  };

  const exportPDF = () => {
    setIsLoading(true); // Set loading state to true
    try {
      const doc = new jsPDF();
      let y = 10;

      // Header
      doc.setFontSize(16);
      doc.text("Itinerary Report", 10, y);
      y += 10;

      // Itinerary Info
      doc.setFontSize(12);
      doc.text(`Destination: ${destination || "Unknown"}`, 10, y);
      y += 7;
      doc.text(`Date: ${start || "N/A"} to ${end || "N/A"}`, 10, y);
      y += 7;
      doc.text(`Budget: Rp. ${currentBudget || "0.00"}`, 10, y);
      y += 7;

      // Description
      if (description) {
        doc.setFontSize(12);
        doc.text("Description:", 10, y);
        y += 6;
        const splitDescription = doc.splitTextToSize(description, 180);
        doc.text(splitDescription, 10, y);
        y += splitDescription.length * 6 + 4;
      }

      // Group destinations by day_id and map to sequential days
      const grouped = destinations.reduce((acc, destination) => {
        if (!acc[destination.day_id]) acc[destination.day_id] = [];
        acc[destination.day_id].push(destination);
        return acc;
      }, {});

      const sortedDayIds = Object.keys(grouped).sort((a, b) => a - b);
      const dayMapping = sortedDayIds.reduce((map, dayId, index) => {
        map[dayId] = `Day ${index + 1}`;
        return map;
      }, {});

      sortedDayIds.forEach((dayId) => {
        const dayPlaces = grouped[dayId];
        const dayLabel = dayMapping[dayId];

        doc.setFontSize(14);
        doc.text(dayLabel, 10, y);
        y += 8;

        dayPlaces.forEach((destination, index) => {
          const place = places.find(
            (place) => place.id === destination.place_id
          );

          if (y > 270) {
            doc.addPage();
            y = 10;
          }

          doc.setFontSize(12);
          doc.text(`- ${place?.name || "Unknown Place"}`, 12, y);
          y += 6;

          if (place?.price) {
            doc.text(`  Price: Rp. ${place.price}`, 15, y);
            y += 6;
          }

          if (place?.rating) {
            doc.text(`  Rating: ${place.rating} / 5`, 15, y);
            y += 6;
          }

          const splitDescription = doc.splitTextToSize(
            place?.description || "No description available",
            180
          );
          doc.text(splitDescription, 15, y);
          y += splitDescription.length * 6 + 4;
        });
      });

      doc.save(`Itinerary_${destination || "Unknown"}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error.message);
      alert("An error occurred while exporting the PDF.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Tambahkan fungsi formatRupiah
  function formatRupiah(angka) {
    if (!angka) return "Rp. 0";
    const numberString = angka.toString().replace(/[^,\d]/g, "");
    const split = numberString.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      rupiah += (sisa ? "." : "") + ribuan.join(".");
    }
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return `Rp. ${rupiah}`;
  }

  const handleAddBudget = (price) => {
    const newTotalSpent = totalSpent - parseInt(price);
    setTotalSpent(newTotalSpent); // Update the total spent state
  };

  const handleRemoveBudget = (price) => {
    const newTotalSpent = totalSpent + parseInt(price);
    setTotalSpent(newTotalSpent); // Update the total spent state
  };

  const handleEditBudget = (newBudget) => {
    setVisibleBudget(parseInt(newBudget)); // Update the visible budget state
  };

  useEffect(() => {
    if (itineraryId) {
      getItineraryDetails(itineraryId).then((data) => {
        setItineraryName(data.itinerary_name);
      });
    }
  }, [itineraryId]);

  const handleEditName = async (newName) => {
    try {
      await editName(itineraryId, newName); // Call the API to update the name
      console.log("Itinerary name updated successfully!");
    } catch (error) {
      console.error("Error updating itinerary name:", error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {isLoading && <Loading />}
      {/* Header */}
      <div
        className="relative bg-cover bg-center h-64"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1500x500')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white p-6">
          <div className="relative">
            {isEditingName ? (
              <div></div>
            ) : (
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">
                  {itineraryName || "Trip Destination"}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)} // Enter edit mode
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <h1 className="text-md font-bold">
            {destination || "Trip Destination"}
          </h1>
          <p className="text-lg mt-2">
            {start} - {end}
          </p>
        </div>
      </div>

      {/* Edit Name Modal */}
      {isEditingName && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Edit Itinerary Name</h3>
            <input
              type="text"
              value={itineraryName}
              onChange={(e) => setItineraryName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
              placeholder="Enter itinerary name"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setIsEditingName(false)} // Close modal
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  handleEditName(itineraryName); // Save changes
                  setIsEditingName(false); // Close modal
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Export Itinerary to PDF
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <textarea
            className="w-full h-24 border border-gray-300 rounded-lg p-2 resize-none"
            placeholder="Write or paste anything here: how to get around, tips and tricks"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Budget */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Budget</h2>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
          <p className="text-xl font-bold">{formatRupiah(visibleBudget)}</p>
          <button
            className="text-blue-600 hover:underline text-sm font-medium"
            onClick={openModal}
          >
            Edit Budget
          </button>
        </div>
      </div>

      {/* Itinerary */}
      <div className="flex-grow px-6 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-gray-700 font-semibold text-lg mb-2">
            Itinerary
          </h3>
          {dayId.map((id, index) => (
            <div
              key={id}
              className="mb-4 border border-gray-300 rounded-lg p-4 bg-white"
            >
              {/* Day Toggle */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleDayVisibility(index)}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {new Date(
                    startDate.getTime() + index * 86400000
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <span className="text-blue-600 text-lg">
                  {visibleDays[index] ? "▼" : "▲"}
                </span>
              </div>

              {/* Places */}
              {visibleDays[index] && (
                <div className="mt-3 space-y-2">
                  {destinations
                    .filter((destination) => destination.day_id === id)
                    .map((destination, idx) => {
                      const place = places.find(
                        (place) => place.id === destination.place_id
                      );

                      return (
                        <div
                          key={idx}
                          className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer ${
                            activePlaceId === destination.place_id
                              ? "bg-blue-100 scale-[1.01]"
                              : "hover:bg-gray-100"
                          } transition-transform duration-200`}
                          onClick={() => {
                            if (activePlaceId === destination.place_id) {
                              // If the place is already active, deactivate it
                              setActivePlaceId(null);
                            } else {
                              // Otherwise, activate the clicked place
                              setSelectPlace(place?.name);
                              setActivePlaceId(destination.place_id);
                            }
                          }}
                        >
                          {/* Image */}
                          <img
                            src={
                              place?.place_picture ||
                              "https://via.placeholder.com/100x100?text=No+Image"
                            }
                            alt={place?.name || "Unknown Place"}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                          />

                          {/* Info */}
                          <div className="flex-grow">
                            <h4 className="font-semibold text-gray-800">
                              {place?.name || "Unknown Place"}
                            </h4>
                            <p className="text-gray-500 text-sm line-clamp-2">
                              {place?.description || "No description available"}
                            </p>
                            <p className="text-gray-700 text-sm">
                              <strong>Price:</strong> Rp.{" "}
                              {place?.price || "N/A"}
                            </p>
                            <p className="text-gray-700 text-sm">
                              <strong>Rating:</strong> {place?.rating || "N/A"}{" "}
                              / 5
                            </p>
                          </div>

                          {/* Delete */}
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlace(destination.place_id, id);
                              handleAddBudget(place?.price);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}

                  {/* Add place */}
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      Add a place
                    </label>
                    <Select
                      options={places.map((place) => ({
                        value: place.id,
                        label: place.name,
                        price: place.price || 0, // Include price in options
                      }))}
                      onInputChange={(selectedOption) => {
                        console.log(selectedOption)}}
                      onChange={(selectedOption) => [
                        handleSelectPlace(selectedOption, id),
                        handleRemoveBudget(selectedOption.price),
                      ]}
                      placeholder="Search for a place"
                      className="text-gray-700"
                      onMenuScrollToBottom={handleNextPage}
                      isLoading={isLoading}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }),
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leftover Budget Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Leftover Budget</h2>
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
          <p
            className={`text-xl font-bold ${
              leftoverBudget < 0 ? "text-red-500" : "text-green-600"
            }`}
          >
            {formatRupiah(leftoverBudget)}
          </p>
        </div>
      </div>

      {/* Save/Delete Buttons */}
      <div className="px-6 pb-6 flex gap-4 justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          onClick={handleSaveItinerary}
        >
          Save
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition"
          onClick={() => setIsConfirmDeleteOpen(true)} // Open ConfirmDelete modal
        >
          Delete
        </button>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDelete
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)} // Close modal
        onConfirm={() => {
          handleDelete(); // Call delete handler
          setIsConfirmDeleteOpen(false); // Close modal after confirming
        }}
        message="Are you sure you want to delete this itinerary? This action cannot be undone."
      />

      {/* Tambahkan modal edit budget di bawah return utama */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Edit Budget</h3>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
              placeholder="Enter new budget"
              value={formatRupiah(visibleBudget)}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleEditBudget(value); // Update budget dynamically
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={closeModal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanItinerary;