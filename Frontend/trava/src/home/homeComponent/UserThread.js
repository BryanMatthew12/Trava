import React from 'react';
import { useSelector } from 'react-redux';
import { selectThreadsByUserId } from '../../slices/threads/threadSlice';
import { selectName, selectUserId } from '../../slices/auth/authSlice';

const UserThread = () => {
  const userId = useSelector(selectUserId); // Get the current user ID from authSlice
  const userName = useSelector(selectName); // Get the current user's name from authSlice
  const userThreads = useSelector(selectThreadsByUserId(userId)); // Get threads for the current user

  return (
    <div className="flex-1 w-full bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{userName ? `${userName}'s Guides` : 'Your Guides'}</h2>
      </div>
      {userThreads.length > 0 ? (
        <div className="space-y-4">
          {userThreads.map((thread) => (
            <div
              key={thread.id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
            >
              <h3 className="text-xl font-bold mb-2">{thread.title}</h3>
              <p className="text-gray-600 mb-2">{thread.description}</p>
              {thread.picture && (
                <img
                  src={thread.picture}
                  alt={thread.title}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{thread.likes} Likes</span>
                <span>{thread.views} Views</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          You don’t have any guides yet.{' '}
        </p>
      )}
    </div>
  );
};

export default UserThread;