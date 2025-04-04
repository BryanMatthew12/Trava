import React from 'react'

const PlanItinerary = () => {
  return (
    <div className="flex-grow p-4 overflow-y-auto">
    {/* Placeholder for dynamic content */}
    <h2 className="text-lg font-semibold mb-4">Itinerary Name</h2>
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Itinerary Date</label>
      <input
        type="date"
        className="w-full border border-gray-300 rounded-lg p-2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Budget</label>
      <input
        type="text"
        placeholder="Enter budget"
        className="w-full border border-gray-300 rounded-lg p-2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">User Notes</label>
      <textarea
        placeholder="Add your notes here"
        className="w-full border border-gray-300 rounded-lg p-2"
        rows="4"
      ></textarea>
    </div>
  </div>
  )
}

export default PlanItinerary