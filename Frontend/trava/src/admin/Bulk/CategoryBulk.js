import React from 'react'
import Select from "react-select";

const CategoryBulk = ({setSelectedCategory}) => {
    const categories = [
  { id: 1, name: "Adventure" },
  { id: 2, name: "Culinary" },
  { id: 3, name: "Shopping" },
  { id: 4, name: "Culture" },
  { id: 5, name: "Religious" },
];
  return (
    <Select
        options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
        isMulti
        onChange={(selectedOptions) => {
          const selectedValues = selectedOptions.map((option) => option.value);
          setSelectedCategory(selectedValues);
        }}
        placeholder="Select categories"
      />
  )
}

export default CategoryBulk