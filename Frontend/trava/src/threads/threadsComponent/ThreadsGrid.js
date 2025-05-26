import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { viewThread } from "../../api/thread/viewThread";
import { FaUserCircle } from "react-icons/fa"; // Tambahkan import ini

const ThreadsGrid = ({ guides, loading }) => {
  const navigate = useNavigate();

  function getImageSrc(user_picture) {
    if (!user_picture) return null; // Kembalikan null jika tidak ada gambar
    return user_picture;
  }

  const handleThreadClick = async (guide) => {
    try {
      await viewThread(guide.thread_id);
    } catch (e) {
      // Optional: handle error
    }
    navigate(
      `/threads/details?threads_id=${guide.thread_id}&itineraries_id=${guide.itinerary_id}`
    );
  };

  if (!guides || guides.length === 0) {
    return (
      <div className="text-center col-span-full">No threads available.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {guides.map((guide) => (
        <div
          key={guide.thread_id}
          className="border rounded-lg overflow-hidden shadow-md cursor-pointer flex flex-col h-full"
          onClick={() => handleThreadClick(guide)}
        >
          <img
            src={guide.thread_picture}
            alt={guide.itinerary.itinerary_name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-1">
              {guide.itinerary.itinerary_name}
            </h3>
            <h3 className="text-xs font-md mb-1">
              {guide.itinerary.itinerary_description ||
                "No description available."}
            </h3>
            <p className="text-sm text-gray-600">
              {guide.thread_content}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100"
                 style={{marginTop: "auto"}}>
              <div className="flex items-center space-x-2">
                {getImageSrc(guide.user?.user_picture) ? (
                  <img
                    src={getImageSrc(guide.user?.user_picture)}
                    alt={guide.user?.username || "User"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6 text-gray-300" />
                )}
                <span>by {guide.user?.username || "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👁 {guide.views}</span>
                <span>❤️ {guide.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {loading && <div className="text-center col-span-full">Loading...</div>}
    </div>
  );
};

export default ThreadsGrid;
