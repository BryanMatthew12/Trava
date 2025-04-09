import React from 'react';

const ThreadsGrid = ({ guides }) => {
  // console.log(guides);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {guides.map((guide, index) => (
        <div key={index} className="border rounded-lg overflow-hidden shadow-md">
          <img
            src={guide.thread_picture} // Use the image URL from the API
            alt={guide.thread_title} // Use the title from the API
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold mb-1">{guide.thread_title}</h3>
            <p className="text-sm text-gray-600 mb-2">{guide.thread_content}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{guide.author || 'Unknown Author'}</span>
              <div className="flex items-center space-x-2">
                <span>👁 {guide.views}</span>
                <span>❤️ {guide.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadsGrid;