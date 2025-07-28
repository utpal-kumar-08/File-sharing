import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, updateUser } from "../../redux/slice/auth/authThunk";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";

const UserProfile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  
  // ✅ Profile picture upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && user.username) setNewUsername(user.username);
  }, [user]);

  if (!user) {
    return <div className="p-6 text-gray-500">Loading user profile...</div>;
  }

  // ✅ Enhanced profile picture with fallbacks
  const getProfilePicture = () => {
    if (imagePreview) return imagePreview; // Show preview if uploading
    if (user.profilePic && user.profilePic !== '') return user.profilePic;
    
    // Fallback: Generate avatar with user's initials
    const userName = user.fullname || user.username || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=ffffff&size=128&format=png`;
  };

  // ✅ Handle profile picture selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Upload profile picture
 const handleImageUpload = async () => {
  if (!selectedImage || !user._id) return;
  
  setUploading(true);
  try {
    const formData = new FormData();
    formData.append('profilePic', selectedImage);
    formData.append('userId', user._id);
    
    // ✅ Use axiosInstance instead of fetch
    const response = await axiosInstance.post('/users/upload-profile-pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.status === 200 && response.data.success) {
      // Update Redux state with new profile picture URL
      dispatch(updateUser({ 
        userId: user._id, 
        profilePic: response.data.profilePicUrl 
      }));
      
      toast.success('Profile picture updated successfully!');
      setSelectedImage(null);
      setImagePreview(null);
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Profile picture upload error:', error);
    toast.error(error.response?.data?.message || 'Failed to upload profile picture');
  } finally {
    setUploading(false);
  }
};
  // ✅ Cancel image selection
  const handleCancelImageUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleUpdate = () => {
    if (user && user._id) {
      dispatch(updateUser({ userId: user._id, username: newUsername }));
      setEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (user && user._id) {
      dispatch(deleteUser(user._id));
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl mx-auto mt-10 max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h2>

      <div className="flex items-center gap-6">
        {/* ✅ Profile Picture Section with Upload */}
        <div className="relative group">
          <img
            src={getProfilePicture()}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=6b7280&color=ffffff&size=128`;
            }}
          />
          
          {/* ✅ Upload Overlay - This is the key part you were missing! */}
          <label 
            htmlFor="profile-upload" 
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
          >
            <div className="text-center text-white">
              <div className="text-2xl mb-1">📷</div>
              <div className="text-xs">Change Photo</div>
            </div>
          </label>
          
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={uploading}
          />
          
          {/* ✅ Status indicator */}
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="text-2xl font-semibold text-gray-900">{user.fullname || user.username}</h3>
          <p className="text-gray-600 text-lg">@{user.username}</p>
          <p className="text-gray-700">{user.email}</p>
          <p className="text-sm text-gray-500">
            User ID: <span className="text-xs text-gray-700 font-mono">{user._id || 'N/A'}</span>
          </p>
        </div>
      </div>

      {/* ✅ Profile Picture Upload Controls */}
      {selectedImage && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-blue-700 font-medium">New profile picture selected</span>
              <span className="text-sm text-blue-600">({selectedImage.name})</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCancelImageUpload}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setEditModalOpen(true)}
          className="flex-1 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors duration-200 font-medium"
        >
          Edit Profile
        </button>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="flex-1 px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition-colors duration-200 font-medium"
        >
          Delete Account
        </button>
      </div>

      {/* ✅ Edit Username Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Username</h3>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new username"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Account Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
