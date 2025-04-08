import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useEffect, useState } from 'react';

const SortDropdown = ({ sortOptions, handleSortChange }) => {
  return (
    <div className="w-48">
      <Select
        options={sortOptions}
        defaultValue={sortOptions[0]}
        onChange={handleSortChange}
        className="text-gray-700"
      />
    </div>
  );
};

export default SortDropdown;