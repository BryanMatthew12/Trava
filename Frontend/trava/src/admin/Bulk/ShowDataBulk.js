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

  // Handler untuk input deskripsi/harga
  const handleInputChange = (index, field, value) => {
    const updatedData = [...bulkData.results];
    updatedData[index][field] = value;
    setBulkData({ results: updatedData });
  };

  // Format harga ke rupiah
  const formatRupiah = (angka) => {
    if (!angka || angka === "0") return "";
    let clean = angka.toString().replace(/[^,\d]/g, "");
    const split = clean.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);
    if (ribuan) {
      rupiah += (sisa ? "." : "") + ribuan.join(".");
    }
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return "Rp " + rupiah;
  };

  // Contoh submit bulk data
  const handleBulkSubmit = () => {
    const cleanedData = bulkData.results.map((item) => ({
      ...item,
      place_est_price: item.place_est_price
        ? parseInt(item.place_est_price, 10)
        : 0,
    }));
    // Kirim cleanedData ke backend
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
              {/* Hapus Price Level */}
              <div className="mb-2">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded text-sm"
                  value={item.description || ""}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                  placeholder="Input description"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Harga
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm"
                  value={item.place_est_price || ""}
                  onChange={(e) => {
                    // Hanya angka
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    handleInputChange(index, "place_est_price", value);
                  }}
                  placeholder="Input harga (angka saja)"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {item.place_est_price ? formatRupiah(item.place_est_price) : ""}
                </div>
              </div>
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
