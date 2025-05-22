import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectName, selectUserId } from '../../slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../api/login/updateProfile';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(selectUserId); // Pastikan ada selector userId
  const userName = useSelector(selectName);
  const userPicture = useSelector(state => state.auth.user_picture);

  const [username, setUsername] = useState(userName || '');
  const [image, setImage] = useState(userPicture || 'https://via.placeholder.com/150');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file)); // Preview
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      alert("Username tidak boleh kosong!");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(userId, { username, imageFile });
      alert('Profile updated!');
      // Optionally: refresh redux state/profile data here
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center">
        <div className="relative mb-4">
          <img
            src={image}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
          </label>
        </div>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4 text-center"
          placeholder="Username"
        />
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full mb-2"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;