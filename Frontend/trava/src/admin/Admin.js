import React, { useState } from 'react';
import EditPlaces from './EditPlaces';
import EditPlacesById from './EditPlacesById';
import EditDestinations from './EditDestinations';
import ControlThreads from './ControlThreads';
import AddBulkPlace from './AddBulkPlace';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('EditPlaces'); // State to track the active tab

  return (
    <div className="relative min-h-screen bg-white">
      {/* Tabs */}
      <div className="absolute top-0 left-0 w-full bg-white shadow-md z-10">
        <div className="flex flex-wrap justify-center space-x-4 p-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'EditPlaces' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('EditPlaces')}
          >
            Add New Places
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'AddBulkPlace' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('AddBulkPlace')}
          >
            Add Bulk Place
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'EditPlacesById' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('EditPlacesById')}
          >
            Edit Places By ID
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'EditDestinations' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('EditDestinations')}
          >
            Edit Destinations
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'ControlThreads' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('ControlThreads')}
          >
            Control Threads
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 w-full max-w-4xl mx-auto">
        {activeTab === 'EditPlaces' && <EditPlaces />}
        {activeTab === 'AddBulkPlace' && <AddBulkPlace />}
        {activeTab === 'EditPlacesById' && <EditPlacesById />}
        {activeTab === 'EditDestinations' && <EditDestinations />}
        {activeTab === 'ControlThreads' && <ControlThreads />}
      </div>
    </div>
  );
};

export default Admin;