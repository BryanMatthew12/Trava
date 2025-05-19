import React from 'react';
import Select from 'react-select';

const controlThreadsOptions = [
  { value: 1, label: 'Thread A' },
  { value: 2, label: 'Thread B' },
  // Tambahkan data lain sesuai kebutuhan
];

const selectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#dddddd',
    border: 'none',
    minHeight: '48px',
    boxShadow: 'none',
  }),
  input: (provided) => ({
    ...provided,
    color: '#888',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#888',
  }),
};

const ControlThreads = () => (
  <>
    <h2 className="text-xl font-bold mb-4">Control Threads</h2>
    <div className="w-80">
      <Select
        options={controlThreadsOptions}
        placeholder="Find Threads to Control"
        isSearchable
        classNamePrefix="react-select"
        styles={selectStyles}
      />
    </div>
  </>
);

export default ControlThreads;