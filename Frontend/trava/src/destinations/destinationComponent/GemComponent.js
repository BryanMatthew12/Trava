import React, { useState } from "react";
import Select from "react-select";
import RowDataGem from "./RowDataGem";

const categories = [
  { id: 1, name: "Culinary" },
  { id: 2, name: "Nature" },
];

const GemComponent = ({ province }) => {
  const [category, setCategory] = useState(1);

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption.id);
  };

  // Map categories to react-select options
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
    id: category.id,
  }));

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Hidden Gems</h3>
        <span>See all</span>
        <div className="w-48">
          <Select
            options={categoryOptions}
            defaultValue={categoryOptions.find((option) => option.id === category)}
            onChange={handleCategoryChange}
            className="text-gray-700"
          />
        </div>
      </div>
      <RowDataGem 
      category={category}
      province={province}
       />
    </div>
  );
};

export default GemComponent;