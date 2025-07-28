// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, updateUser, deleteUser, getUser } from './authThunk.js';
console.log('✅ Imports:', { registerUser, loginUser, updateUser, deleteUser, getUser });

// ✅ Enhanced initial state with _id extraction
const stored = localStorage.getItem('user');
const token = localStorage.getItem('token');

let initialUser = null;
if (stored && token) {
  try {
    initialUser = JSON.parse(stored);
    
    // If user doesn't have _id but token exists, extract it
    if (!initialUser._id && token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        initialUser._id = tokenPayload.userId;
        console.log('✅ Extracted _id from stored token on app load:', initialUser._id);
        
        // Update localStorage with the corrected user data
        localStorage.setItem('user', JSON.stringify(initialUser));
      } catch (error) {
        console.error('❌ Error parsing stored token on app load:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error parsing stored user on app load:', error);
    initialUser = null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: token || null,
    isLoggedIn: !!(initialUser && token),
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    
    // ✅ Enhanced loadUserFromStorage with _id extraction
    loadUserFromStorage: (state) => {
      const stored = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (stored && token) {
        try {
          let userData = JSON.parse(stored);
          
          // ✅ Extract _id from token if missing
          if (!userData._id && token) {
            try {
              const tokenPayload = JSON.parse(atob(token.split('.')[1]));
              userData._id = tokenPayload.userId;
              console.log('✅ Extracted _id in loadUserFromStorage:', userData._id);
              
              // Update localStorage with the corrected user data
              localStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
              console.error('❌ Error parsing token in loadUserFromStorage:', error);
            }
          }
          
          state.user = userData;
          state.token = token;
          state.isLoggedIn = true;
        } catch (error) {
          console.error('❌ Error parsing stored user data:', error);
          state.user = null;
          state.token = null;
          state.isLoggedIn = false;
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        
        // ✅ Handle different response formats
        const responseData = action.payload;
        const userData = responseData.user || responseData;
        const token = responseData.token;
        
        // ✅ Extract _id from token if missing from user data
        if (!userData._id && token) {
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            userData._id = tokenPayload.userId;
            console.log('✅ Added _id to registered user:', userData._id);
          } catch (error) {
            console.error('❌ Error parsing token during registration:', error);
          }
        }
        
        state.user = userData;
        state.token = token;
        state.isLoggedIn = true;
        
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
          localStorage.setItem('token', token);
        }
        
        console.log('✅ User registered successfully with _id:', userData);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        
        const userData = action.payload;
        console.log('🔍 Raw login payload:', userData);
        
        // ✅ Extract userId from JWT token and add it to user object
        if (!userData._id && userData.token) {
          try {
            // Decode JWT token to get userId
            const tokenPayload = JSON.parse(atob(userData.token.split('.')[1]));
            console.log('🔍 Decoded token payload:', tokenPayload);
            
            // Add _id from token to user object
            userData._id = tokenPayload.userId;
            console.log('✅ Added _id to user object:', userData._id);
          } catch (error) {
            console.error('❌ Error parsing JWT token:', error);
          }
        }
        
        state.user = userData;
        state.token = userData.token;
        state.isLoggedIn = true;
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        
        console.log('✅ User logged in successfully with _id:', userData);
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log(action);
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        
        const userData = action.payload;
        
        // ✅ Preserve _id if it exists in current state but not in update response
        if (!userData._id && state.user?._id) {
          userData._id = state.user._id;
          console.log('✅ Preserved _id during user update:', userData._id);
        }
        
        state.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Update failed';
      })

      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // ✅ Fixed typo here
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Delete failed';
      })

      // GET USER
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        
        const userData = action.payload;
        
        // ✅ Preserve _id if it exists in current state but not in fresh user data
        if (!userData._id && state.user?._id) {
          userData._id = state.user._id;
          console.log('✅ Preserved _id during user fetch:', userData._id);
        }
        
        state.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Get user failed';
      })
  }
});

export const { logoutUser, loadUserFromStorage, clearError } = authSlice.actions;
export default authSlice.reducer;
