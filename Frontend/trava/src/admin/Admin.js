import React from 'react';
import EditPlaces from './EditPlaces';
import ControlThreads from './ControlThreads';

const Admin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <EditPlaces />
      <ControlThreads />
    </div>
  );
};

export default Admin;