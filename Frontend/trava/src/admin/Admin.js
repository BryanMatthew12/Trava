import React from 'react';
import EditPlaces from './EditPlaces';
import EditPlacesById from './EditPlacesById';
import EditDestinations from './EditDestinations';
import ControlThreads from './ControlThreads';

const Admin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <EditPlaces />
      <EditPlacesById />
      <EditDestinations />
      <ControlThreads />
    </div>
  );
};

export default Admin;