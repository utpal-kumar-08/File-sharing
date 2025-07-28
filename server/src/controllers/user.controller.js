import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import express, { Router } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinary.js"; // ✅ Add cloudinary import

const generateUniqueId = () => {
  return uuidv4();
};

// Function to create a new user
const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    if (fullname.length < 6) {
      return res
        .status(400)
        .json({ message: "Fullname must be at least 6 characters long." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const cleanedFullname = fullname.trim().replace(/\s+/g, '');
    const username = `${cleanedFullname.substring(0, 4).toLowerCase()}${generateUniqueId().substring(0, 5)}`;

    const pic = Math.floor(Math.random() * 100) + 1;
    const profilePic = `https://avatar.iran.liara.run/public/${pic}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password,
      profilePic
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Error during registration" });
  }
};

// logoutUser
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // ✅ Don't return passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('-password'); // ✅ Don't return password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// ✅ Enhanced updateUser to handle profile picture updates
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, profilePic } = req.body; // ✅ Added profilePic support

  try {
    const updateData = {};
    
    // Build update object based on provided fields
    if (username) {
      updateData.username = username;
    }
    
    if (profilePic) {
      updateData.profilePic = profilePic;
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Fix deleteUser
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const loginUser = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    user.lastLogin = new Date();
    await user.save();

    // set token in cookie and send response
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id, // ✅ Changed from 'id' to '_id' for consistency
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// ✅ NEW: Profile Picture Upload Function
const uploadProfilePic = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Validate user ID
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Verify user is updating their own profile (if you have auth middleware)
    // if (req.user && req.user._id.toString() !== userId) {
    //   return res.status(403).json({ message: 'Unauthorized to update this profile' });
    // }

    console.log('📸 Uploading profile picture for user:', userId);

    // Upload to Cloudinary with optimizations
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'profile_pictures', // Organize uploads in folders
          public_id: `user_${userId}_${Date.now()}`, // Unique filename
          transformation: [
            { 
              width: 400, 
              height: 400, 
              crop: 'fill', 
              gravity: 'face', // Focus on face if detected
              quality: 'auto:good' // Optimize quality
            }
          ],
          format: 'jpg' // Convert to JPG for smaller file size
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result.secure_url);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    // Update user profile picture in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        profilePic: result.secure_url,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password'); // Don't return password

    if (!updatedUser) {
      return res.status(404).json({ message: 'Failed to update user profile' });
    }

    console.log('✅ Profile picture updated successfully for user:', userId);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePicUrl: result.secure_url,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Profile picture upload error:', error);
    
    // Handle specific Cloudinary errors
    if (error.name === 'CloudinaryError') {
      return res.status(400).json({ 
        message: 'Image upload failed. Please try again.' 
      });
    }
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File size too large. Maximum size is 5MB.' 
      });
    }
    
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ 
        message: 'Invalid file type. Only image files are allowed.' 
      });
    }
    
    // Generic error
    res.status(500).json({ 
      success: false,
      message: 'Internal server error. Failed to upload profile picture.' 
    });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  });
};

export {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  verifyToken,
  generateUniqueId,
  logoutUser,
  uploadProfilePic, // ✅ Export the new function
};
