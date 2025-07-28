// src/features/auth/authThunks.js
console.log('🔍 authThunk.js file loaded!');
// src/features/auth/authThunk.js


import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
 import axiosInstance from '../../../config/axiosInstance.js'; // ← Comment this out temporarily

console.log('🔍 Reached after imports');



//import axiosInstance from '../../../config/axiosInstance';

// Enhanced error handling helper
const handleThunkError = (err, defaultMessage) => {
  console.error('❌ Thunk error:', err);
  
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  if (err.response?.data?.error) {
    return err.response.data.error;
  }
  if (err.message) {
    return err.message;
  }
  return defaultMessage;
};

// REGISTER
export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    console.log('🔍 Registration attempt:', formData);
    const res = await axiosInstance.post('/users/register', formData);
    
    // ✅ DEBUG: Log the ENTIRE response structure
    console.log('🔍 FULL API RESPONSE:', res);
    console.log('🔍 RESPONSE DATA:', res.data);
    console.log('🔍 Response keys:', Object.keys(res.data));
    console.log('🔍 res.data.user:', res.data.user);
    console.log('🔍 res.data._id:', res.data._id);
    console.log('🔍 res.data.id:', res.data.id);
    
    return res.data;
  } catch (err) {
    console.error('❌ Registration API Error:', err);
    return rejectWithValue(handleThunkError(err, 'Registration failed'));
  }
});

// LOGIN
export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    console.log('🔍 Login attempt:', formData);
    const res = await axiosInstance.post('/users/login', formData);
    
    // ✅ CRITICAL DEBUG - See the exact response
    console.log('🔍 FULL LOGIN RESPONSE:', res);
    console.log('🔍 RESPONSE DATA:', res.data);
    console.log('🔍 Response type:', typeof res.data);
    console.log('🔍 Response keys:', Object.keys(res.data));
    console.log('🔍 res.data._id:', res.data._id);
    console.log('🔍 res.data.id:', res.data.id);
    console.log('🔍 res.data.user:', res.data.user);
    console.log('🔍 res.data.token:', res.data.token);
    
    return res.data;
  } catch (err) {
    console.error('❌ Login API Error:', err);
    return rejectWithValue(handleThunkError(err, 'Login failed'));
  }
});

// UPDATE USER - ✅ Fixed route path and parameters
export const updateUser = createAsyncThunk('auth/updateUser', async (data, { rejectWithValue }) => {
  try {
    const { userId, username, profilePic } = data;
    console.log('🔍 Updating user:', { userId, username, profilePic });
    
    // ✅ Validate input
    if (!userId) {
      throw new Error('User ID is required for update');
    }
    
    // ✅ Build update payload
    const updatePayload = {};
    if (username) updatePayload.username = username;
    if (profilePic) updatePayload.profilePic = profilePic;
    
    if (Object.keys(updatePayload).length === 0) {
      throw new Error('At least one field is required to update');
    }
    
    // ✅ Fixed route path to match backend
    const res = await axiosInstance.put(`/users/${userId}`, updatePayload);
    
    console.log('✅ Update user response:', res.data);
    
    return res.data;
  } catch (err) {
    return rejectWithValue(handleThunkError(err, 'Update failed'));
  }
});

// DELETE USER - ✅ Fixed route path
export const deleteUser = createAsyncThunk('auth/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    console.log('🔍 Deleting user:', userId);
    
    // ✅ Validate input
    if (!userId) {
      throw new Error('User ID is required for deletion');
    }
    
    // ✅ Fixed route path to match backend
    await axiosInstance.delete(`/users/${userId}`);
    
    console.log('✅ User deleted successfully');
    
    return userId;
  } catch (err) {
    return rejectWithValue(handleThunkError(err, 'Delete failed'));
  }
});

// GET USER - ✅ Fixed route path
export const getUser = createAsyncThunk('auth/getUser', async (userId, { rejectWithValue }) => {
  try {
    console.log('🔍 Getting user with ID:', userId);
    
    // ✅ Validate input
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // ✅ Fixed route path to match backend
    const res = await axiosInstance.get(`/users/${userId}`);
    
    console.log('✅ Get user response:', res.data);
    
    return res.data;
  } catch (err) {
    return rejectWithValue(handleThunkError(err, 'Get user failed'));
  }
});

// ✅ ADD: Upload Profile Picture Thunk
export const uploadProfilePic = createAsyncThunk('auth/uploadProfilePic', async (data, { rejectWithValue }) => {
  try {
    const { userId, formData } = data;
    console.log('🔍 Uploading profile picture for user:', userId);
    
    if (!userId || !formData) {
      throw new Error('User ID and form data are required');
    }
    
    const res = await axiosInstance.post('/users/upload-profile-pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Profile picture upload response:', res.data);
    
    return res.data;
  } catch (err) {
    return rejectWithValue(handleThunkError(err, 'Profile picture upload failed'));
  }
});
console.log('🔍 Exports check:', { registerUser, loginUser, updateUser, deleteUser, getUser });

