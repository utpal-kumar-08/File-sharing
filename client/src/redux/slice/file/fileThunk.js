import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../../config/axiosInstance";

// Basic config
axios.defaults.withCredentials = true;

// UPLOAD FILE - Fixed to include userId
export const uploadFile = createAsyncThunk(
  "file/upload",
  async ({ formData, userId }, { rejectWithValue }) => {
    try {
      // ✅ Debug logging
      console.log('Upload Debug:');
      console.log('userId received:', userId);
      console.log('formData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      if (userId) {
        formData.append('userId', userId);
      }
      
      const res = await axiosInstance.post("/files/upload", formData);
      return res.data;
    } catch (err) {
      console.error('Upload error response:', err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
);


// GET FILE DETAILS - Fixed endpoint
export const getFileDetails = createAsyncThunk(
  "file/getDetails", 
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/files/${fileId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// DELETE FILE - Fixed endpoint
export const deleteFile = createAsyncThunk(
  "file/delete", 
  async (fileId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/files/${fileId}`);
      return fileId;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// UPDATE FILE STATUS - Fixed endpoint and method
export const updateFileStatus = createAsyncThunk(
  "file/updateStatus", 
  async ({ fileId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/files/${fileId}/status`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// GENERATE SHORT LINK
export const generateShareShortenLink = createAsyncThunk(
  "file/generateShortLink", 
  async ({ fileId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/files/generate-link", { fileId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// SEND LINK VIA EMAIL
export const sendLinkEmail = createAsyncThunk(
  "file/sendLinkEmail", 
  async ({ fileId, email }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/files/send-email", { fileId, email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// UPDATE EXPIRY - Fixed method to PUT
export const updateFileExpiry = createAsyncThunk(
  "file/updateExpiry", 
  async ({ fileId, expiresAt }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/files/${fileId}/expiry`, { expiresAt });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// UPDATE PASSWORD - Fixed method to PUT and parameter name
export const updateFilePassword = createAsyncThunk(
  "file/updatePassword", 
  async ({ fileId, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/files/${fileId}/password`, { newPassword });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// SEARCH FILES - Fixed endpoint
export const searchFiles = createAsyncThunk(
  "file/search", 
  async (query, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/files/search?query=${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// GENERATE QR - Fixed endpoint
export const generateQR = createAsyncThunk(
  "file/generateQR", 
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/files/${fileId}/qr`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// GET DOWNLOAD COUNT - Fixed endpoint
export const getDownloadCount = createAsyncThunk(
  "file/downloadCount", 
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/files/${fileId}/downloads`);
      return { fileId, count: res.data.downloadCount };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// RESOLVE SHORT LINK - Fixed endpoint
export const resolveShareLink = createAsyncThunk(
  "file/resolveLink", 
  async (code, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/files/share/${code}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// VERIFY PASSWORD
export const verifyFilePassword = createAsyncThunk(
  "file/verifyPassword", 
  async ({ fileId, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/files/verify-password", { fileId, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// GET USER FILES - Fixed endpoint
// GET USER FILES - Enhanced with better error handling
export const getUserFiles = createAsyncThunk(
  "file/getUserFiles", 
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      console.log('🔍 Frontend fetching files for userId:', userId);
      const res = await axiosInstance.get(`/files/user/${userId}`);
      
      console.log('✅ API Response Status:', res.status);
      console.log('✅ API Response Data:', res.data);
      console.log('✅ Files count:', res.data?.length || 0);
      
      return res.data;
    } catch (err) {
      console.error('❌ getUserFiles error:', err);
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

