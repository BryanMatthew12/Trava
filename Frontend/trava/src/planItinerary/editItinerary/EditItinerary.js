import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getItineraryDetails } from "../../api/itinerary/getItineraryDetails";
import { fetchPlaces } from "../../api/places/places.js";
import {
  setPlaces,
  selectPlaces,
  appendPlaces,
} from "../../slices/places/placeSlice";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faStar,
  faPen,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
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
import { editBudget } from "../../api/itinerary/editBudget";
import { editName } from "../../api/itinerary/editName";
import { getPlaceByName } from "../../api/places/getPlaceByName.js";
import { getPlaceByIdAndName } from "../../api/places/getPlaceByIdAndName.js";

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

function getTotalSpent(destinations) {
  if (!destinations || !Array.isArray(destinations)) return 0;
  return destinations.reduce((sum, place) => {
    const price = place.place_est_price ? parseInt(place.place_est_price) : 0;
    return sum + price;
  }, 0);
}

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

const EditItinerary = ({ test, destinations, setDestinations, onDestinationsChange }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [fetchedPlaces, setFetchedPlaces] = useState({});
  const [destinationId, setDestinationId] = useState('')
  const itineraryId = searchParams.get("params");
  const [itineraryData, setItineraryData] = useState(null);
  const option = useSelector(selectPlaces);
  const [selectPlace, setSelectPlace] = useState();
  const [activePlaceId, setActivePlaceId] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const dispatch = useDispatch();
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [placeOptions, setPlaceOptions] = useState([]);

  // Modal state
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (option.length > 0) {
      const options = option.map((place) => ({
        value: place.id,
        label: place.name,
        price: place.price || 0,
        place_picture: place.place_picture, // Include picture in the option data
      }));
      setPlaceOptions(options);
    }
  }, []);

  useEffect(() => {
  const fetchItineraryDetails = async () => {
      if (itineraryId) {
        try {
          const data = await getItineraryDetails(itineraryId);
          const { places, ...restWithoutPlaces } = data;
          setItineraryData(restWithoutPlaces);
          setDestinations(data.places);
          setDestinationId(data.destination_id);
          setBudget(data.budget ? data.budget.toString() : ""); // <-- Tambahkan baris ini
          if (data) {
            const placesData = await fetchPlaces(data.destination_id, currPage);

            if (placesData && Array.isArray(placesData)) {
              // Filter and append only unique places to placeOptions
              setPlaceOptions((prevOptions) => {
                const existingIds = new Set(
                  prevOptions.map((option) => option.value)
                );

                const newOptions = placesData
                  .filter((place) => !existingIds.has(place.place_id))
                  .map((place) => ({
                    value: place.place_id,
                    label: place.place_name,
                    price: place.place_est_price || 0,
                    place_picture: place.place_picture,
                  }));

                // Dispatch only unique places to Redux
                const newUniquePlaces = placesData.filter(
                  (place) => !existingIds.has(place.place_id)
                );
                if (newUniquePlaces.length > 0) {
                  dispatch(appendPlaces(newUniquePlaces));
                }

                return [...prevOptions, ...newOptions];
              });
            }
          }
        } catch (error) {
          console.error("Error fetching itinerary details:", error.message);
        }
      }
    };
    fetchItineraryDetails();
  }, [itineraryId, currPage, dispatch]);

  const DEBOUNCE_DELAY = 500;

  // Fetch places based on destinationId when component mounts
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchPlaces = async () => {
        try {
          const response = await getPlaceByIdAndName(
            searchPlace,
            destinationId
          );
          if (response) {
            setPlaceOptions((prevOptions) => {
              const existingIds = new Set(
                prevOptions.map((option) => option.value)
              );

              const filteredOptions = response
                .filter((place) => !existingIds.has(place.place_id))
                .map((place) => ({
                  value: place.place_id,
                  label: place.place_name,
                  price: place.place_est_price || 0,
                  place_picture: place.place_picture,
                }));

              const newPlaces = response.filter(
                (place) => !existingIds.has(place.place_id)
              );
              if (newPlaces.length > 0) {
                dispatch(appendPlaces(newPlaces));
              }

              return [...prevOptions, ...filteredOptions];
            });
          }
        } catch (error) {
          console.error("Error fetching places by name:", error.message);
        }
      };

      if (searchPlace) {
        fetchPlaces();
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler); // Clear timeout if input changes before delay
  }, [searchPlace, dispatch]);

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

  useEffect(() => {
    console.log("Destinations in child:", destinations);
    if (typeof onDestinationsChange === "function") {
      onDestinationsChange(destinations);
    }
  }, [destinations, onDestinationsChange]);

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
  const handleSaveBudget = async () => {
    try {
      await editBudget(itineraryId, Number(budget)); // Pastikan Number(budget)
      setIsBudgetModalOpen(false);
      setSuccessMsg("Budget updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      setSuccessMsg(error.message || "Failed to update budget");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  // Sync draft with itineraryData
  useEffect(() => {
    if (itineraryData?.itinerary_name !== undefined) {
      setNameDraft(itineraryData.itinerary_name || "");
    }
  }, [itineraryData]);

  const handleSaveName = async () => {
    if (!nameDraft.trim() || nameDraft === itineraryData.itinerary_name) {
      setIsEditingName(false);
      return;
    }
    try {
      setLoading(true);
      await editName(itineraryData.itinerary_id, nameDraft);
      setItineraryData((prev) => ({
        ...prev,
        itinerary_name: nameDraft,
      }));
      setIsEditingName(false);
      setSuccessMsg("Itinerary name updated!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      setSuccessMsg("Failed to update itinerary name.");
      setTimeout(() => setSuccessMsg(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const destinations = await fetchCoord(selectPlace);
        const coordinates = destinations?.data;

        if (coordinates) {
          const { latitude, longitude } = coordinates;

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
      if (typeof test === "function") {
        test(latitude, longitude);
      }
    } else {
      // Not cached, fetch coordinates
      getCoordinates();
    }
  }, [selectPlace, test, fetchedPlaces]);

  const totalSpent = getTotalSpent(destinations);
  const leftoverBudget =
    (budget && !isNaN(Number(budget)) ? Number(budget) : 0) - totalSpent;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      {itineraryData && (
        <div className="relative h-56 flex items-end rounded-b-3xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-500 to-teal-400 opacity-95" />
          <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10" />
          <svg
            className="absolute bottom-0 right-0 w-48 h-24 opacity-30 pointer-events-none"
            viewBox="0 0 200 60"
            fill="none"
          >
            <path d="M0 30 Q50 60 100 30 T200 30 V60 H0Z" fill="#fff" />
          </svg>
          <div className="relative z-10 text-white p-8 w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold drop-shadow">
                {itineraryData.itinerary_name}
              </h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="ml-4 p-3 rounded-full bg-white/30 hover:bg-white/60 transition flex items-center justify-center border border-white/40 hover:border-white shadow-xl"
                title="Edit itinerary name"
              >
                <FontAwesomeIcon icon={faPen} className="text-white text-2xl" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 mt-2">
              <span className="text-lg font-semibold">
                {itineraryData.destination_name}
              </span>
            </div>
            <span className="text-base flex items-center gap-2 mt-1">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-white/90 text-lg"
              />
              {formatDateRange(
                itineraryData.start_date,
                itineraryData.end_date
              )}
            </span>
          </div>
        </div>
      )}

      {/* Modal Edit Name */}
      {isEditingName && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Edit Itinerary Name</h3>
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
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
                onClick={handleSaveName}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="p-6">
        <h2 className="text-xl font-bold border-b-2 border-blue-100 pb-2 mb-4 mt-8">
          Description
        </h2>
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
            onBlur={async () => {
              if (isEditingDesc) {
                setIsEditingDesc(false);
                if (descDraft !== description) {
                  try {
                    await patchDescription(itineraryId, descDraft);
                    setDescription(descDraft);
                    setSuccessMsg("Description saved!");
                    setTimeout(() => setSuccessMsg(""), 2000);
                  } catch {
                    setSuccessMsg("Failed to update description");
                    setTimeout(() => setSuccessMsg(""), 2000);
                  }
                }
              }
            }}
          />
          {!isEditingDesc && (
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-500"
              onClick={() => {
                setIsEditingDesc(true);
                setTimeout(() => {
                  textareaRef.current?.focus();
                }, 0);
              }}
              type="button"
              tabIndex={-1}
            >
              <FiEdit2 size={20} />
            </button>
          )}
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
          <span className="text-xl font-bold text-blue-700">
            {formatRupiah(budget)}
          </span>
          <button
            className="ml-4 p-3 rounded-full bg-blue-100 hover:bg-blue-300 transition flex items-center justify-center border border-blue-300 hover:border-blue-500 shadow"
            onClick={() => setIsBudgetModalOpen(true)}
            title="Edit budget"
          >
            <FontAwesomeIcon icon={faPen} className="text-blue-700 text-xl" />
          </button>
        </div>
        <div className="flex-1 bg-white shadow rounded-xl p-4 flex items-center justify-between">
          <span className="font-semibold text-gray-700">Leftover</span>
          <span
            className={`text-xl font-bold ${
              leftoverBudget < 0 ? "text-red-500" : "text-green-600"
            }`}
          >
            {leftoverBudget < 0
              ? `- ${formatRupiah(Math.abs(leftoverBudget))}`
              : formatRupiah(leftoverBudget)}
          </span>
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

      {/* Itinerary Mapping */}
      <div className="flex-grow px-6 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-gray-700 font-semibold text-lg mb-2 border-b border-blue-100 pb-2">
            Itinerary
          </h3>
          {dayId.map((id, index) => {
            const places = destinations.filter((d) => d.day_id === id);
            const startDate = itineraryData?.start_date
              ? new Date(itineraryData.start_date)
              : null;
            const thisDate = startDate
              ? new Date(startDate.getTime() + index * 86400000)
              : null;
            return (
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
                    {thisDate
                      ? thisDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })
                      : `Day ${index + 1}`}
                  </h3>
                  <span className="text-blue-600 text-lg">
                    {visibleDays[index] ? "▼" : "▲"}
                  </span>
                </div>
                {/* Places */}
                {visibleDays[index] && (
                  <div className="mt-3 space-y-4">
                    {places.length === 0 && (
                      <div className="text-gray-400 italic mb-2">
                        No places selected for this day.
                      </div>
                    )}
                    {places
                      .sort((a, b) => a.visit_order - b.visit_order)
                      .map((place) => (
                        <div
                          onClick={() => {
                            if (activePlaceId === place.place_id) {
                              setActivePlaceId(null);
                            } else {
                              setActivePlaceId(place.place_id);
                              setSelectPlace(place.place_name);
                            }
                          }}
                          key={place.place_id + "-" + place.visit_order}
                          className={`relative p-4 bg-white rounded-xl shadow flex items-center gap-6 cursor-pointer transition-all duration-200
                            ${
                              activePlaceId === place.place_id
                                ? "border-2 border-blue-400 scale-[1.01] shadow-lg"
                                : "border border-gray-200 hover:shadow-lg hover:border-blue-200"
                            }
                          `}
                        >
                          {/* Tombol hapus absolute */}
                          <button
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlace(
                                place.day_id,
                                place.place_id,
                                place.visit_order
                              );
                            }}
                            title="Remove"
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
                          {/* Image */}
                          <img
                            src={
                              place.place_image ||
                              place.place_picture ||
                              "https://via.placeholder.com/100x100?text=No+Image"
                            }
                            alt={place.place_name}
                            className="w-24 h-24 object-cover rounded-xl border border-blue-200"
                          />
                          {/* Info */}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-gray-800 text-xl truncate">
                              {place.place_name || "Unknown Place"}
                            </h4>
                            <p className="text-gray-500 text-sm line-clamp-2">
                              {place.place_description ||
                                "No description available"}
                            </p>
                            <span className="flex items-center gap-1 text-green-700 font-semibold mt-2">
                              <FontAwesomeIcon
                                icon={faMoneyBillWave}
                                className="text-green-500"
                              />
                              {place.place_est_price
                                ? `Rp. ${Number(
                                    place.place_est_price
                                  ).toLocaleString("id-ID", {
                                    minimumFractionDigits: 2,
                                  })}`
                                : "N/A"}
                            </span>
                            <span className="flex flex-col items-start mt-1">
                              <span className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <FontAwesomeIcon
                                    key={i}
                                    icon={faStar}
                                    className={
                                      i < Math.floor(place.place_rating || 0)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </span>
                              <span className="text-xs text-gray-500 mt-0.5">
                                {place.place_rating
                                  ? `${place.place_rating} / 5`
                                  : "N/A"}
                              </span>
                            </span>
                          </div>
                        </div>
                      ))}
                    {/* Add place */}
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 flex items-center gap-2 bg-blue-50 mt-2">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <label className="block text-gray-600 font-medium mb-0">
                        Add a place
                      </label>
                      <div className="flex-1">
                        <Select
                          options={placeOptions}
                          onInputChange={(inputValue) => {
                            setSearchPlace(inputValue);
                          }}
                          onChange={(selectedOption) =>
                            handleSelectPlace(selectedOption, id)
                          }
                          placeholder="Search for a place"
                          className="text-gray-700"
                          components={{
                            Option: (props) => (
                              <div
                                {...props.innerProps}
                                className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                              >
                                <img
                                  src={
                                    props.data.place_picture ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt={props.data.label}
                                  className="w-10 h-10 object-cover rounded mr-3"
                                  style={{ minWidth: 40, minHeight: 40 }}
                                />
                                <span>{props.data.label}</span>
                              </div>
                            ),
                          }}
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
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save/Delete Buttons */}
      {itineraryData &&
        authUserId &&
        Number(authUserId) === Number(itineraryData.user_id) && (
          <div className="px-6 pb-6 flex gap-4 justify-end">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition font-bold"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Itinerary
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition font-bold"
              onClick={() => setShowSaveModal(true)}
              disabled={!isAllDaysFilled}
            >
              Save Changes
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
    </div>
  );
};

export default EditItinerary;