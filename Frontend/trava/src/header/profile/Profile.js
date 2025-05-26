import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectName, selectUserId, setUserPicture } from '../../slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../api/login/updateProfile';
import { getProfile } from '../../api/login/getProfile';
import { FaUserCircle } from 'react-icons/fa';
import ConfirmSave from "../../modal/ConfirmDelete/ConfirmSave"; // Tambahkan import

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(selectUserId);
  const userName = useSelector(selectName);
  const userPicture = useSelector(state => state.auth.user_picture);

  const [username, setUsername] = useState(userName || '');
  const [image, setImage] = useState(userPicture || '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // State modal

  function getImageSrc(place_picture) {
    if (!place_picture) return "https://via.placeholder.com/300x200?text=No+Image";
    return place_picture;
  }

  // GET profile setiap refresh/mount
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      if (userId) {
        const profile = await getProfile(userId, navigate);
        if (profile) {
          setUsername(profile.username || "");
          setImage(profile.user_picture || "");
          dispatch(setUserPicture(profile.user_picture || ""));
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // navigate('/login') is already handled in getProfile
    }
  };

  fetchProfile();
}, [userId, navigate, dispatch]);


  useEffect(() => {
    setImage(userPicture || '');
  }, [userPicture]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 300;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/png');
          setImage(dataUrl);
          setImageFile(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      alert("Username tidak boleh kosong!");
      return;
    }
    setLoading(true);
    try {
      const result = await updateProfile(userId, { username, imageFile });
      if (result.user && result.user.user_picture) {
        setImage(result.user.user_picture);
        setImageFile(null);
        dispatch(setUserPicture(result.user.user_picture));
      }
    } catch (err) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  const handleSaveClick = () => {
    setShowConfirm(true); // Tampilkan modal saat tombol Save diklik
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    await handleSave(); // Jalankan fungsi save asli
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center">
        <div className="mb-2 text-lg font-semibold">
          Hello, {username}
        </div>
        <div className="relative mb-4">
          {image ? (
            <img
              src={getImageSrc(image)}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <FaUserCircle className="w-28 h-28 text-gray-300" />
          )}
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
        <div className="w-full mb-4 flex items-center">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border rounded px-3 py-2 w-full text-center"
            placeholder="Username"
          />
        </div>
        <button
          onClick={handleSaveClick} // Ganti ke handleSaveClick
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full mb-2"
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
      {/* Modal ConfirmSave */}
      <ConfirmSave
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        message="Are you sure you want to save your profile changes?"
      />
    </div>
  );
};

export default Profile;