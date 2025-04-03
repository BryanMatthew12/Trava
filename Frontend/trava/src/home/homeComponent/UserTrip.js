import React from 'react'

const existingTrips = [
    { title: "Trip to Bali", date: "2023-10-01" },
    { title: "Trip to Japan", date: "2023-09-15" },
  ];

const UserTrip = () => {
  return (
    <div className="flex-1 w-full bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Your trips</h2>
          <button className="bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            + Plan new trip
          </button>
        </div>
        {existingTrips.length > 0 ? (
          <ul className="space-y-2">
            {existingTrips.map((trip, index) => (
              <li
                key={index}
                className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                <h3 className="font-semibold">{trip.title}</h3>
                <p className="text-sm text-gray-600">{trip.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            You don’t have any trip plans yet.{" "}
            <span className="text-red-500 cursor-pointer">Plan a new trip.</span>
          </p>
        )}
      </div>
  )
}

export default UserTrip