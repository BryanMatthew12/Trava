import React, { useState } from "react";
import TrendingRow from "./TrendingRow";
import RowDataProvince from "./RowDataProvince";
import GemComponent from "./GemComponent";

const ExploreComponent = () => {
  const [province, setProvince] = useState(1);

  const provinces = [
    { id: 1, name: "Bali" },
    { id: 2, name: "Java" },
  ];

  const handleProvinceChange = (event) => {
    setProvince(Number(event.target.value));
  };

  return (
    <div className="w-full max-w-4xl px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Province</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <select
            id="province-select"
            value={province}
            onChange={handleProvinceChange}
            className="border border-gray-300 rounded-lg p-2 text-gray-700"
          >
            {provinces.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>
        <RowDataProvince province={province} />
      </div>

      <TrendingRow province={province} />
      <GemComponent province={province} />
    </div>
  );
};

export default ExploreComponent;