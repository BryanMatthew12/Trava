import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchHiddenGems } from "../../api/home/homeHidden"; // Import fetchHiddenGems
import { setHome3, selectHiddenGems } from "../../slices/home/homeSlice";
import { viewPlace } from "../../api/places/viewPlace";

const RowDataHiddenGem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hiddenGems = useSelector(selectHiddenGems); // Ambil data hidden gems dari Redux
  const [loading, setLoading] = useState(true); // State untuk loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchHiddenGems(); // Fetch data dari API
        console.log("Fetched hidden gemsxdxdd:", response); // Log data yang diambil
        if (response) {
          dispatch(setHome3(response)); // Simpan data ke state.home3
        }
      } catch (error) {
        console.error("Error fetching hidden gems:", error);
      } finally {
        setLoading(false); // Hentikan loading
      }
    };

    fetchData(); // Fetch data saat komponen dimuat
  }, [dispatch]);

  const handleItemClick = async (home) => {
    try {
      await viewPlace(home.id); // home.id = place_id dari slice
    } catch (e) {
      console.error(e);
    }
    navigate(`/PlanningItinerary?source=hiddenGem&params=${home.id}`);
  };

  if (loading) {
    return <p>Loading hidden gems...</p>; // Tampilkan pesan loading
  }

  if (!hiddenGems || hiddenGems.length === 0) {
    return <p>No hidden gems available to display.</p>; // Tampilkan pesan jika data kosong
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {hiddenGems.map((home, index) => (
        <div
          key={index}
          onClick={() => handleItemClick(home)}
          className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow"
        >
          <img
            src={home.place_picture}
            alt={home.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold mt-2 text-center truncate w-full">
            {home.name}
          </h2>
          <p className="text-gray-600 text-center text-sm truncate w-full">
            {home.description}
          </p>
          <p className="text-sm text-gray-500">Rating: {home.rating} ★</p>
          <p className="text-sm text-gray-500">Location: {home.location}</p>
          <p className="text-sm text-gray-500">Views: {home.views}</p>
        </div>
      ))}
    </div>
  );
};

export default RowDataHiddenGem;