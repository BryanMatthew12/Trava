import React from 'react'

const UserThread = () => {
  return (
    <div className="flex-1 w-full bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Your guides</h2>
          <button className="bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            + Create new guide
          </button>
        </div>
        <p className="text-gray-600">
          You don’t have any guides yet.{" "}
          <span className="text-red-500 cursor-pointer">Create a new guide.</span>
        </p>
      </div>
  )
}

export default UserThread