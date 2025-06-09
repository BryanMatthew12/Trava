import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlaces,
  appendPlaces,
  clearPlaces,
  selectPlaces,
} from "../../slices/places/placeSlice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fetchPlaces } from "../../api/places/places";
import { fetchDayId } from "../../api/dayId/fetchDayId";
import { postItinerary } from "../../api/itinerary/postItinerary";
import { deleteItinerary } from "../../api/itinerary/deleteItinerary";
import { fetchCoord } from "../../api/mapCoord/fetchCoord";
import { getItineraryDetails } from "../../api/itinerary/getItineraryDetails";
import { editName } from "../../api/itinerary/editName";
import Select from "react-select";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Success from "../../modal/successModal/Success";
import Loading from "../../modal/loading/Loading";
import ConfirmDelete from "../../modal/ConfirmDelete/ConfirmDelete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave, faStar, faArrowUp, faPen, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const PlanItinerary = ({ test, destinations, setDestinations, onDestinationsChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const places = useSelector(selectPlaces);
  const [dayId, setDayId] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(location.state?.budget || 0);
  const itineraryId = searchParams.get("params");
  const [selectPlace, setSelectPlace] = useState();
  const [activePlaceId, setActivePlaceId] = useState(null);
  const [description, setDescription] = useState(location.state?.desc || "");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [fetchedPlaces, setFetchedPlaces] = useState({});
  const [itineraryName, setItineraryName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);


  const { start, end, budget, desc, destination, destinationId } = location.state || {};
  const [totalSpent, setTotalSpent] = useState(0);
  const [visibleBudget, setVisibleBudget] = useState(budget);

  // Calculate the number of days
  const startDate = new Date(start);
  const endDate = new Date(end);
  const tripDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const days = Array.from({ length: tripDuration }, (_, i) => `Day ${i + 1}`);
  const [visibleDays, setVisibleDays] = useState(Array.from({ length: tripDuration }, () => true));
  const leftoverBudget = visibleBudget - totalSpent;

  // Fetch places based on destinationId when component mounts
  useEffect(() => {
    const fetchPlacesByDestination = async () => {
      if (destinationId) {
        try {
          const placesData = await fetchPlaces(destinationId, 1);
          dispatch(setPlaces(placesData));
        } catch (error) {
          dispatch(clearPlaces());
        }
      }
    };
    fetchPlacesByDestination();
  }, [destinationId, dispatch]);

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        const dayData = await fetchDayId(itineraryId);
        const dayIds = dayData.map((day) => day.day_id);
        setDayId(dayIds);
      } catch (error) {}
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
          if (typeof test === "function") test(latitude, longitude);
          setFetchedPlaces((prev) => ({
            ...prev,
            [selectPlace]: { latitude, longitude },
          }));
        }
      } catch (error) {}
    };
    if (!selectPlace) return;
    if (fetchedPlaces[selectPlace]) {
      const { latitude, longitude } = fetchedPlaces[selectPlace];
      if (typeof test === "function") test(latitude, longitude);
    } else {
      getCoordinates();
    }
  }, [selectPlace, test, fetchedPlaces]);

  const handleNextPage = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const newPlaces = await fetchPlaces(destinationId, nextPage);
      dispatch(appendPlaces(newPlaces));
      setPage(nextPage);
    } catch (error) {} finally {
      setIsLoading(false);
    }
  };

  const toggleDayVisibility = (index) => {
    setVisibleDays((prev) => prev.map((visible, i) => (i === index ? !visible : visible)));
  };

  const handleSelectPlace = (selectedOption, dayId) => {
    // Cek apakah sudah ada destinasi dengan place_id dan day_id yang sama
    const alreadyExists = destinations.some(
      (destination) =>
        destination.place_id === selectedOption.value &&
        destination.day_id === dayId
    );
    if (alreadyExists) {
      // Optional: alert("Place already added for this day!");
      return false; // Tidak menambah, return false
    }

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

    return true; // Berhasil menambah
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
      if (response) return;
    } catch (error) {}
  };

  const handleSaveItinerary = async () => {
    setIsLoading(true);
    try {
      const response = await postItinerary(
        itineraryId,
        destinationId,
        destinations,
        navigate
      );
      if (response) {
        setIsLoading(false);
        setShowSuccessModal(true);
        return;
      }
    } catch (error) {
      alert("An error occurred while saving the itinerary.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const setBudget = (newBudget) => setCurrentBudget(newBudget);

  const exportPDF = () => {
    setIsLoading(true);
    try {
      const doc = new jsPDF();
      let y = 10;
      doc.setFontSize(16);
      doc.text("Itinerary Report", 10, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`Destination: ${destination || "Unknown"}`, 10, y);
      y += 7;
      doc.text(`Date: ${start || "N/A"} to ${end || "N/A"}`, 10, y);
      y += 7;
      doc.text(`Budget: Rp. ${currentBudget || "0.00"}`, 10, y);
      y += 7;
      if (description) {
        doc.setFontSize(12);
        doc.text("Description:", 10, y);
        y += 6;
        const splitDescription = doc.splitTextToSize(description, 180);
        doc.text(splitDescription, 10, y);
        y += splitDescription.length * 6 + 4;
      }
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
      alert("An error occurred while exporting the PDF.");
    } finally {
      setIsLoading(false);
    }
  };

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
    setTotalSpent(newTotalSpent);
  };

  const handleRemoveBudget = (price) => {
    const newTotalSpent = totalSpent + parseInt(price);
    setTotalSpent(newTotalSpent);
  };

  const handleEditBudget = (newBudget) => {
    setVisibleBudget(parseInt(newBudget));
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
      await editName(itineraryId, newName);
    } catch (error) {}
  };

  function formatDateRange(start, end) {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startStr = startDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const endStr = endDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  }

  useEffect(() => {
    if (typeof onDestinationsChange === "function") {
      onDestinationsChange(destinations);
    }
  }, [destinations, onDestinationsChange]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {isLoading && <Loading />}

      {/* Header */}
      <div className="relative h-56 flex items-end rounded-b-3xl shadow-lg overflow-hidden">
        {/* Gradient + glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-500 to-teal-400 opacity-95" />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10" />
        {/* Optional: Decorative SVG wave */}
        <svg className="absolute bottom-0 right-0 w-48 h-24 opacity-30 pointer-events-none" viewBox="0 0 200 60" fill="none">
          <path d="M0 30 Q50 60 100 30 T200 30 V60 H0Z" fill="#fff" />
        </svg>
        <div className="relative z-10 text-white p-8 w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold drop-shadow">{itineraryName || "Trip Destination"}</h1>
            <button
              onClick={() => setIsEditingName(true)}
              className="ml-4 p-3 rounded-full bg-white/30 hover:bg-white/60 transition flex items-center justify-center border border-white/40 hover:border-white shadow-xl"
              title="Edit itinerary name"
            >
              <FontAwesomeIcon icon={faPen} className="text-white text-2xl" />
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 mt-2">
            <span className="text-lg font-semibold">{destination || "Trip Destination"}</span>
          </div>
          <span className="text-base flex items-center gap-2 mt-1">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-white/90 text-lg" />
            {formatDateRange(start, end)}
          </span>
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
                onClick={() => setIsEditingName(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  handleEditName(itineraryName);
                  setIsEditingName(false);
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
        <h2 className="text-xl font-bold border-b-2 border-blue-100 pb-2 mb-4 mt-8">Description</h2>
        <div className="bg-white shadow-md rounded-lg p-4">
          <textarea
            className="w-full h-24 border border-gray-300 rounded-lg p-2 resize-none"
            placeholder="Write or paste anything here: how to get around, tips and tricks"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Export Itinerary to PDF
            </button>
          </div>
        </div>
      </div>

      {/* Budget & Leftover */}
      <div className="p-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white shadow rounded-xl p-4 flex items-center justify-between">
          <span className="font-semibold text-gray-700">Budget</span>
          <span className="text-xl font-bold text-blue-700">{formatRupiah(visibleBudget)}</span>
          <button
            className="ml-4 p-2 rounded-full bg-blue-100 hover:bg-blue-300 transition flex items-center justify-center border border-blue-300 hover:border-blue-500 shadow"
            onClick={openModal}
            title="Edit budget"
          >
            <FontAwesomeIcon icon={faPen} className="text-blue-700 text-lg" />
          </button>
        </div>
        <div className="flex-1 bg-white shadow rounded-xl p-4 flex items-center justify-between">
          <span className="font-semibold text-gray-700">Leftover</span>
          <span className={`text-xl font-bold ${leftoverBudget < 0 ? "text-red-500" : "text-green-600"}`}>
            {formatRupiah(leftoverBudget)}
          </span>
        </div>
      </div>

      {/* Itinerary */}
      <div className="flex-grow px-6 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-gray-700 font-semibold text-lg mb-2 border-b border-blue-100 pb-2">Itinerary</h3>
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
                <div className="mt-3 space-y-4">
                  {destinations
                    .filter((destination) => destination.day_id === id)
                    .map((destination, idx) => {
                      const place = places.find(
                        (place) => place.id === destination.place_id
                      );
                      return (
                        <div
                          key={idx}
                          className={`relative p-4 bg-white rounded-xl shadow flex items-center gap-6 cursor-pointer transition-all duration-200
                            ${activePlaceId === destination.place_id
                              ? "border-2 border-blue-400 scale-[1.01] shadow-lg"
                              : "border border-gray-200 hover:shadow-lg hover:border-blue-200"}
                          `}
                          onClick={() => {
                            if (activePlaceId === destination.place_id) {
                              setActivePlaceId(null);
                            } else {
                              setSelectPlace(place?.name);
                              setActivePlaceId(destination.place_id);
                            }
                          }}
                        >
                          {/* Tombol hapus absolute */}
                          <button
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeletePlace(destination.place_id, id);
                              handleAddBudget(place?.price);
                            }}
                            title="Remove"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {/* Image */}
                          <img
                            src={place?.place_picture || "https://via.placeholder.com/100x100?text=No+Image"}
                            alt={place?.name || "Unknown Place"}
                            className="w-32 h-32 object-cover rounded-xl border border-blue-200"
                          />
                          {/* Info */}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-gray-800 text-xl truncate">{place?.name || "Unknown Place"}</h4>
                            <p className="text-gray-500 text-sm line-clamp-2">{place?.description || "No description available"}</p>
                            <span className="flex items-center gap-1 text-green-700 font-semibold mt-2">
                              <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500" />
                              {place?.price ? `Rp. ${Number(place.price).toLocaleString("id-ID", {minimumFractionDigits: 2})}` : "N/A"}
                            </span>
                            <span className="flex flex-col items-start mt-1">
                              <span className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={i < Math.floor(place?.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </span>
                              <span className="text-xs text-gray-500 mt-0.5">
                                {place?.rating ? `${place.rating} / 5` : "N/A"}
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {/* Add place */}
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 flex items-center gap-2 bg-blue-50 mt-2">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <label className="block text-gray-600 font-medium mb-0">Add a place</label>
                    <div className="flex-1">
                      <Select
                        options={places.map((place) => ({
                          value: place.id,
                          label: place.name,
                          price: place.price || 0,
                        }))}
                        onInputChange={(selectedOption) => {
                          // opsional: handle search
                        }}
                        onChange={async (selectedOption) => {
                          const added = handleSelectPlace(selectedOption, id);
                          if (added) {
                            handleRemoveBudget(selectedOption.price);
                          }
                          // Tetap fetch koordinat & panggil test untuk marker
                          const coordResult = await fetchCoord(selectedOption.label);
                          const coordinates = coordResult?.data;
                          if (coordinates && typeof test === "function") {
                            test(coordinates.latitude, coordinates.longitude);
                          }
                          setSelectPlace(selectedOption.label);
                        }}
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save/Delete Buttons */}
      <div className="px-6 pb-6 flex gap-4 justify-end">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition font-bold"
          onClick={() => setIsConfirmDeleteOpen(true)}
        >
          Delete
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition font-bold"
          onClick={handleSaveItinerary}
        >
          Save
        </button>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDelete
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          handleDelete();
          setIsConfirmDeleteOpen(false);
        }}
        message="Are you sure you want to delete this itinerary? This action cannot be undone."
      />

      {/* Edit Budget Modal */}
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
                handleEditBudget(value);
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={closeModal}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}   
    </div>
  );
};

export default PlanItinerary;