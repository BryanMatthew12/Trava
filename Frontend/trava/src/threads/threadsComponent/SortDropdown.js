import React from 'react';

const SortDropdown = ({ handleSortChange }) => {
  const sortOptions = [
    { value: 1, label: 'Most Recent' },
    { value: 2, label: 'Most Popular' },
    { value: 3, label: 'Most Liked' },
  ];

  return (
    <div className="mb-4">
      <select
        className="border border-gray-300 rounded-md px-4 py-2"
        onChange={(e) => handleSortChange(sortOptions.find((opt) => opt.value === parseInt(e.target.value)))}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;