import { createSlice } from "@reduxjs/toolkit";
import {
  uploadFile,
  getFileDetails,
  deleteFile,
  updateFileStatus,
  generateShareShortenLink,
  sendLinkEmail,
  updateFileExpiry,
  updateFilePassword,
  searchFiles,
  generateQR,
  getDownloadCount,
  resolveShareLink,
  verifyFilePassword,
  getUserFiles,
} from "./fileThunk";

const fileSlice = createSlice({
  name: "file",
  initialState: {
    files: [],
    userFiles: [],
    uploadFiles: [],
    selectedFile: null,
    qrCodeUrl: null,
    downloadCounts: {},
    resolvedFile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearQR: (state) => {
      state.qrCodeUrl = null;
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload File
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        // After upload, trigger getUserFiles to refresh the list
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get File Details
      .addCase(getFileDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFile = action.payload;
      })
      .addCase(getFileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete File
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter((f) => f._id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update File Status
      .addCase(updateFileStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFileStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.map((f) =>
          f._id === action.payload._id ? action.payload : f
        );
      })
      .addCase(updateFileStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate Share Link
      .addCase(generateShareShortenLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateShareShortenLink.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFile = action.payload;
      })
      .addCase(generateShareShortenLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send Link Email
      .addCase(sendLinkEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLinkEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendLinkEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update File Expiry
      .addCase(updateFileExpiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFileExpiry.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFile = action.payload;
      })
      .addCase(updateFileExpiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update File Password
      .addCase(updateFilePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFilePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFile = action.payload;
      })
      .addCase(updateFilePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Files
      .addCase(searchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(searchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate QR
      .addCase(generateQR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQR.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCodeUrl = action.payload;
      })
      .addCase(generateQR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Download Count
      .addCase(getDownloadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDownloadCount.fulfilled, (state, action) => {
        state.loading = false;
        const { fileId, count } = action.payload;
        state.downloadCounts[fileId] = count;
      })
      .addCase(getDownloadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Resolve Share Link
      .addCase(resolveShareLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveShareLink.fulfilled, (state, action) => {
        state.loading = false;
        state.resolvedFile = action.payload;
      })
      .addCase(resolveShareLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify File Password
      .addCase(verifyFilePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyFilePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resolvedFile = action.payload;
      })
      .addCase(verifyFilePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Files
      .addCase(getUserFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // In your extraReducers, update getUserFiles handling:
.addCase(getUserFiles.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  state.files = action.payload || []; // ✅ Handle null/undefined responses
  console.log('✅ Redux updated with files:', action.payload?.length || 0);
})
.addCase(getUserFiles.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
  state.files = []; // ✅ Reset files on error
  console.log('❌ Redux error:', action.payload);
})

  },
});

export const { clearQR, clearSelectedFile } = fileSlice.actions;
export default fileSlice.reducer;
