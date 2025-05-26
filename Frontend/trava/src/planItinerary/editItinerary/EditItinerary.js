import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getItineraryDetails } from "../../api/itinerary/getItineraryDetails";
import { fetchPlaces } from "../../api/places/places.js";
import { setPlaces, selectPlaces } from "../../slices/places/placeSlice";
import Select from "react-select";
import { patchItinerary } from "../../api/itinerary/patchItinerary.js";
import { useNavigate } from "react-router-dom";
import { fetchDayId } from "../../api/dayId/fetchDayId";
import { deleteItinerary } from "../../api/itinerary/deleteItinerary.js";
import { selectUserId } from "../../slices/auth/authSlice";
import { patchDescription } from "../../api/itinerary/patchDescription";
import { FiEdit2 } from "react-icons/fi";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Loading from "../../modal/loading/Loading";
import Success from "../../modal/successModal/Success";
import ConfirmDelete from "../../modal/ConfirmDelete/ConfirmDelete";
import ConfirmSave from "../../modal/ConfirmDelete/ConfirmSave.js";
import { fetchCoord } from "../../api/mapCoord/fetchCoord.js";

// Tambahkan fungsi formatRupiah
function formatRupiah(angka) {
  if (!angka) return "Rp. 0";
  // Hilangkan .00 jika ada
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

const EditItinerary = ({ test }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [fetchedPlaces, setFetchedPlaces] = useState({});
  const itineraryId = searchParams.get("params");
  const [itineraryData, setItineraryData] = useState(null);
  const option = useSelector(selectPlaces);
  const [selectPlace, setSelectPlace] = useState();
  const [activePlaceId, setActivePlaceId] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const dispatch = useDispatch();
  const [destinations, setDestinations] = useState([]);
  const [dayId, setDayId] = useState([]);
  const [visibleDays, setVisibleDays] = useState([]);
  const authUserId = useSelector(selectUserId);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [description, setDescription] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(description);
  const textareaRef = useRef(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budget, setBudget] = useState(""); // angka murni

  // Modal state
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      if (itineraryId) {
        try {
          const data = await getItineraryDetails(itineraryId);
          const { places, ...restWithoutPlaces } = data;
          setItineraryData(restWithoutPlaces);
          setDestinations(data.places);
          setBudget(data.budget ? data.budget.toString() : ""); // <-- Tambahkan baris ini
          if (data) {
            const placesData = await fetchPlaces(data.destination_id, currPage);
            dispatch(setPlaces(placesData));
          }
        } catch (error) {
          console.error("Error fetching itinerary details:", error.message);
        }
      }
    };
    fetchItineraryDetails();
  }, [itineraryId, currPage, dispatch]);

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        const dayData = await fetchDayId(itineraryId);
        const dayIds = dayData.map((day) => day.day_id);
        setDayId(dayIds);
        setVisibleDays(Array.from({ length: dayIds.length }, () => true));
      } catch (error) {
        console.error("Error fetching day data:", error.message);
      }
    };
    if (itineraryId) fetchDayData();
  }, [itineraryId]);

  useEffect(() => {
    if (itineraryData?.itinerary_description !== undefined) {
      setDescription(itineraryData.itinerary_description || "");
    }
  }, [itineraryData]);

  useEffect(() => {
    setDescDraft(description);
  }, [description]);

  useEffect(() => {
    if (!isEditingDesc) return;
    function handleClickOutside(e) {
      if (textareaRef.current && !textareaRef.current.contains(e.target)) {
        setIsEditingDesc(false);
        if (descDraft !== description) {
          patchDescription(itineraryId, descDraft)
            .then(() => setSuccessMsg("Description updated!"))
            .catch(() => setSuccessMsg("Failed to update description"));
          setDescription(descDraft);
          setTimeout(() => setSuccessMsg(""), 2000);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingDesc, descDraft, description, itineraryId, setDescription]);

  const handleActivePlace = (placeId, placeName) => {
    setActivePlaceId(placeId);
    setSelectPlace(placeName);
  };

  const handleSelectPlace = (selectedOption, dayId) => {
    setSelectPlace(selectedOption.label);

    setDestinations((prevDestinations) => {
      const maxOrder = prevDestinations
        .filter((d) => d.day_id === Number(dayId))
        .reduce((max, d) => Math.max(max, d.visit_order), 0);

      if (
        prevDestinations.some(
          (d) =>
            d.day_id === Number(dayId) && d.place_id === selectedOption.value
        )
      ) {
        return prevDestinations;
      }

      const placeObj = option.find((p) => p.id === selectedOption.value);

      const newPlace = {
        day_id: Number(dayId),
        place_id: selectedOption.value,
        place_name: selectedOption.label,
        visit_order: maxOrder + 1,
        place_est_price: placeObj?.price ?? null,
        place_rating: placeObj?.rating ?? null,
        place_image: placeObj?.place_picture ?? null,
        place_description: placeObj?.description ?? null,
      };

      return [...prevDestinations, newPlace];
    });
  };

  const handleDeletePlace = (dayId, placeId, visitOrder) => {
    setDestinations((prevDestinations) =>
      prevDestinations
        .filter(
          (d) =>
            !(
              d.day_id === dayId &&
              d.place_id === placeId &&
              d.visit_order === visitOrder
            )
        )
        .map((d, idx, arr) => {
          if (d.day_id === dayId) {
            const sameDay = arr.filter((x) => x.day_id === dayId);
            sameDay.sort((a, b) => a.visit_order - b.visit_order);
            sameDay.forEach((x, i) => (x.visit_order = i + 1));
          }
          return d;
        })
    );
  };

  const handleEdit = async () => {
    if (!itineraryData || !destinations) return;

    const updatedItinerary = {
      itinerary_id: itineraryData.itinerary_id,
      destination_id: itineraryData.destination_id,
      budget: budget,
      places: destinations,
    };

    try {
      setLoading(true);
      await patchItinerary(updatedItinerary, navigate);
      setLoading(false);
      setSuccessMsg("Itinerary updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      setLoading(false);
      setSuccessMsg("Failed to update itinerary. Please try again.");
      setTimeout(() => setSuccessMsg(""), 2000);
      console.error("Error updating itinerary:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteItinerary(itineraryId, navigate);
      setLoading(false);
      if (response) {
        setSuccessMsg("Itinerary deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 2000);
        return;
      } else {
        setSuccessMsg("Failed to delete itinerary.");
        setTimeout(() => setSuccessMsg(""), 2000);
        console.error("Failed to delete itinerary:", response.message);
      }
    } catch (error) {
      setLoading(false);
      setSuccessMsg("Error deleting itinerary.");
      setTimeout(() => setSuccessMsg(""), 2000);
      console.error("Error deleting itinerary:", error.message);
    }
  };

  const toggleDayVisibility = (index) => {
    setVisibleDays((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const isAllDaysFilled =
    dayId.length > 0 &&
    dayId.every((id) =>
      destinations.some((destination) => destination.day_id === id)
    );

  const handleNextPage = () => {
    setCurrPage((prev) => prev + 1);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Itinerary Report", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(
      `Destination: ${itineraryData?.destination_name || "Unknown"}`,
      10,
      y
    );
    y += 7;
    doc.text(
      `Date: ${
        itineraryData?.start_date
          ? new Date(itineraryData.start_date).toLocaleDateString()
          : "N/A"
      } to ${
        itineraryData?.end_date
          ? new Date(itineraryData.end_date).toLocaleDateString()
          : "N/A"
      }`,
      10,
      y
    );
    y += 7;

    if (itineraryData?.itinerary_description) {
      doc.setFontSize(12);
      doc.text("Description:", 10, y);
      y += 6;
      const splitDescription = doc.splitTextToSize(
        itineraryData.itinerary_description,
        180
      );
      doc.text(splitDescription, 10, y);
      y += splitDescription.length * 6 + 4;
    }

    const grouped = destinations.reduce((acc, place) => {
      if (!acc[place.day_id]) acc[place.day_id] = [];
      acc[place.day_id].push(place);
      return acc;
    }, {});

    const sortedDayIds = Object.keys(grouped).sort((a, b) => a - b);

    sortedDayIds.forEach((dayId, idx) => {
      const dayPlaces = grouped[dayId];
      doc.setFontSize(14);
      doc.text(`Day ${idx + 1}`, 10, y);
      y += 8;

      dayPlaces.forEach((place, i) => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        doc.setFontSize(12);
        doc.text(`- ${place.place_name || "Unknown Place"}`, 12, y);
        y += 6;

        if (place.place_est_price) {
          doc.text(`  Price: Rp. ${place.place_est_price}`, 15, y);
          y += 6;
        }
        if (place.place_rating) {
          doc.text(`  Rating: ${place.place_rating} / 5`, 15, y);
          y += 6;
        }
        if (place.place_description) {
          const splitDesc = doc.splitTextToSize(place.place_description, 180);
          doc.text(splitDesc, 15, y);
          y += splitDesc.length * 6 + 4;
        }
      });
    });

    doc.save(`Itinerary_${itineraryData?.destination_name || "Unknown"}.pdf`);
  };

  // Handler untuk menyimpan budget dari modal
  const handleSaveBudget = () => {
    setItineraryData((prev) => ({
      ...prev,
      budget: budget,
    }));
    setIsBudgetModalOpen(false);
    // Jika ingin update ke backend, panggil patchItinerary di sini
  };

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const destinations = await fetchCoord(selectPlace);
        const coordinates = destinations?.data;

        if (coordinates) {
          const { latitude, longitude } = coordinates;
          console.log("Fetched coordinates:", latitude, longitude);

          // Call test function
          if (typeof test === "function") {
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
      console.log("Using cached coordinates:", latitude, longitude);
      if (typeof test === "function") {
        test(latitude, longitude);
      }
    } else {
      // Not cached, fetch coordinates
      getCoordinates();
    }
  }, [selectPlace, test, fetchedPlaces]);

  return (
    <div className="p-6">
      {itineraryData ? (
        <>
          <h2 className="text-2xl font-bold mb-4">
            {itineraryData.destination_name}
          </h2>
          <p className="text-gray-600 mb-2">
            <strong>Start Date:</strong>{" "}
            {new Date(itineraryData.start_date).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>End Date:</strong>{" "}
            {new Date(itineraryData.end_date).toLocaleDateString()}
          </p>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Description</h2>
              {authUserId &&
                Number(authUserId) === Number(itineraryData.user_id) && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-600"
                    onClick={exportPDF}
                  >
                    Export to PDF
                  </button>
                )}
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 relative">
              <textarea
                ref={textareaRef}
                className="w-full h-24 border border-gray-300 rounded-lg p-2 pr-10"
                placeholder="Write or paste anything here: how to get around, tips and tricks"
                value={descDraft}
                readOnly={!isEditingDesc}
                style={{
                  background: isEditingDesc ? "white" : "#f3f4f6",
                  cursor: isEditingDesc ? "text" : "default",
                }}
                onChange={(e) => setDescDraft(e.target.value)}
              />
              {!isEditingDesc && (
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-blue-500"
                  onClick={() => setIsEditingDesc(true)}
                  type="button"
                  tabIndex={-1}
                >
                  <FiEdit2 size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Budget Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Budgeting</h2>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
              <p className="text-xl font-bold">{formatRupiah(budget)}</p>
              <button
                className="text-blue-600 hover:underline text-sm font-medium flex items-center"
                onClick={() => setIsBudgetModalOpen(true)}
              >
                <FiEdit2 className="mr-1" /> Edit Budget
              </button>
            </div>
          </div>

          {/* Modal Edit Budget */}
          {isBudgetModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h3 className="text-lg font-semibold mb-4">Edit Budget</h3>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
                  placeholder="Masukkan budget"
                  value={formatRupiah(budget)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setBudget(value);
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={() => setIsBudgetModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSaveBudget}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {dayId.map((id, index) => {
            const places = destinations.filter((d) => d.day_id === id);
            return (
              <div
                key={id}
                className="mb-6 border border-gray-300 rounded-lg p-4"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleDayVisibility(index)}
                >
                  <h3 className="text-lg font-semibold">Day {index + 1}</h3>
                  <span className="text-blue-500">
                    {visibleDays[index] ? "▼" : "▲"}
                  </span>
                </div>
                {visibleDays[index] && (
                  <div className="mt-2">
                    {places.length === 0 ? (
                      <div className="text-gray-400 italic mb-2">
                        No places selected for this day.
                      </div>
                    ) : (
                      places
                        .sort((a, b) => a.visit_order - b.visit_order)
                        .map((place) => (
                          <div
                            onClick={() => {
                              if (activePlaceId === place.place_id) {
                                // If the place is already active, deactivate it
                                setActivePlaceId(null);
                              } else {
                                // Otherwise, activate the clicked place
                                setActivePlaceId(place.place_id);
                                setSelectPlace(place.place_name);
                              }
                            }}
                            key={place.place_id + "-" + place.visit_order}
                            className={`mb-4 p-4 border border-gray-300 rounded-lg flex items-center cursor-pointer transition-transform duration-200 ${
                              activePlaceId === place.place_id
                                ? "bg-blue-100 scale-105"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <img
                              src={
                                place.place_picture ||
                                "https://via.placeholder.com/100"
                              }
                              alt={place.place_name}
                              className="w-20 h-20 object-cover rounded-lg mr-4"
                            />
                            <div className="flex-grow">
                              <h4 className="font-semibold text-lg">
                                {place.place_name}
                              </h4>
                              <p className="text-gray-500">
                                {place.place_description}
                              </p>
                              <p className="text-gray-600">
                                <strong>Rating:</strong>{" "}
                                {place.place_rating || "N/A"} / 5
                              </p>
                              <p className="text-gray-600">
                                <strong>Estimated Price:</strong>{" "}
                                {place.place_est_price
                                  ? `Rp. ${place.place_est_price}`
                                  : "N/A"}
                              </p>
                            </div>
                            <button
                              className="text-red-500 hover:text-red-700 ml-4"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the parent onClick
                                handleDeletePlace(
                                  place.day_id,
                                  place.place_id,
                                  place.visit_order
                                );
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ))
                    )}
                    <Select
                      options={option.map((place) => ({
                        value: place.id,
                        label: place.name,
                        description: place.description,
                      }))}
                      onChange={(selectedOption) =>
                        handleSelectPlace(selectedOption, id)
                      }
                      placeholder="Search for a place"
                      className="text-gray-700"
                      onMenuScrollToBottom={handleNextPage}
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
                )}
              </div>
            );
          })}
          {authUserId &&
            Number(authUserId) === Number(itineraryData.user_id) && (
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  onClick={() => setShowSaveModal(true)}
                  disabled={!isAllDaysFilled}
                >
                  Save Changes
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Itinerary
                </button>
              </div>
            )}

          {/* Save Confirmation Modal */}
          <ConfirmSave
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onConfirm={async () => {
              setShowSaveModal(false);
              await handleEdit();
            }}
            message="Are you sure you want to save changes to this itinerary?"
          />

          {/* Delete Confirmation Modal */}
          <ConfirmDelete
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={async () => {
              setShowDeleteModal(false);
              await handleDelete();
            }}
            message="Are you sure you want to delete this itinerary? This action cannot be undone."
          />

          {/* Loading & Success Modal */}
          {loading && <Loading />}
          {successMsg && <Success message={successMsg} />}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default EditItinerary;
