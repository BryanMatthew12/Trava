import React from "react";

const ShowDataBulk = ({ bulkData, setBulkData }) => {
  const data = bulkData?.results || []; // Ensure data is an empty array if null or undefined

  const handleFileUpload = (file, index) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result; // Get Base64 string
      const updatedData = [...bulkData.results]; // Create a copy of bulkData
      updatedData[index].place_picture = base64; // Update the place_picture for the specific index
      setBulkData({ results: updatedData }); // Update the bulkData state
    };
    reader.readAsDataURL(file); // Read the file as Base64
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bulk Data</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((item, index) => (
            <div
              key={item.place_id}
              className="border border-gray-300 rounded-lg p-4 shadow-md bg-white"
            >
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600 text-sm">
                <strong>Address:</strong> {item.formatted_address}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Rating:</strong> {item.rating || "N/A"}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Price Level:</strong> {item.price_level || "N/A"}
              </p>
              <div className="mt-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  Upload Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0], index)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
              {item.place_picture && (
                <img
                  src={item.place_picture}
                  alt="Uploaded"
                  className="mt-4 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No data available.</p>
      )}
    </div>
  );
};


export default ShowDataBulk;
