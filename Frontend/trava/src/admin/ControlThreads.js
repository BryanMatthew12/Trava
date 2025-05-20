import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { searchThread } from '../api/thread/searchThread';
import { deleteThread } from '../api/thread/deleteThread';
import { useNavigate } from 'react-router-dom';

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: 44,
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    borderColor: '#d1d5db',
    boxShadow: 'none',
    backgroundColor: '#fff',
  }),
  input: (provided) => ({
    ...provided,
    fontSize: 16,
  }),
  option: (provided) => ({
    ...provided,
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: 16,
  }),
};

const ControlThreads = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // modal state
  const [deleting, setDeleting] = useState(false);

  // Load options for AsyncSelect (tidak tampilkan dropdown, hanya trigger search)
  const loadThreadOptions = async (inputValue) => {
    setLoading(true);
    try {
      const result = await searchThread({
        name: inputValue,
      });
      const threads = result.data || [];
      setThreads(threads);
      setLoading(false);
      // Tidak perlu return options, karena tidak pakai dropdown
      return [];
    } catch {
      setThreads([]);
      setLoading(false);
      return [];
    }
  };

  // Handle click pada grid
  const handleThreadClick = (thread) => {
    setSelectedThreadId(thread.thread_id || thread.id);
    // Navigasi jika mau, atau lakukan aksi lain
    // navigate(`/threads/${thread.thread_id || thread.id}`);
  };

  const handleDelete = async () => {
    if (!selectedThreadId) return;
    setDeleting(true);
    try {
      await deleteThread(selectedThreadId);
      setThreads((prev) => prev.filter(
        (t) => (t.thread_id || t.id) !== selectedThreadId
      ));
      setSelectedThreadId(null);
      setShowModal(false);
    } catch (e) {
      // Bisa tambahkan pesan error di modal jika mau
    }
    setDeleting(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <div className="bg-white rounded-lg shadow p-6 w-full">
        <label className="block text-gray-700 text-base font-semibold mb-2">
          Manage Threads
        </label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadThreadOptions}
          // onInputChange={loadThreadOptions}
          placeholder="Search and select a thread by itinerary name"
          isClearable
          styles={customStyles}
          className="w-full mb-6"
          classNamePrefix="react-select"
          menuIsOpen={false} // Hide dropdown
        />

        {/* Grid hasil search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {threads.length === 0 && !loading && (
            <div className="text-center col-span-full text-gray-500">No threads found.</div>
          )}
          {threads.map((thread) => (
            <div
              key={thread.thread_id || thread.id}
              className={`border rounded-lg overflow-hidden shadow-md cursor-pointer transition-all ${
                selectedThreadId === (thread.thread_id || thread.id)
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'hover:ring-2 hover:ring-blue-300'
              }`}
              onClick={() => setSelectedThreadId(thread.thread_id || thread.id)}
            >
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">
                  {thread.itinerary?.itinerary_name || `Thread #${thread.thread_id || thread.id}`}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {thread.thread_content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-2 ml-auto">
                    <span>👁 {thread.views}</span>
                    <span>❤️ {thread.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-center col-span-full text-gray-500">Loading...</div>
          )}
        </div>

        {/* Button Delete */}
        <button
          className={`mt-6 w-full py-2 rounded bg-red-600 text-white font-semibold transition ${
            selectedThreadId
              ? 'hover:bg-red-700'
              : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!selectedThreadId}
          onClick={() => setShowModal(true)}
        >
          Delete Selected Thread
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Delete Thread</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this thread? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded bg-red-600 text-white font-semibold ${
                  deleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlThreads;