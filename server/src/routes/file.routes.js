import express, { Router } from "express";
import upload from "../middlewares/upload.middlewares.js";
import { 
  deleteFile, 
  downloadFile, 
  generateQR, 
  generateShareShortenLink, 
  getDownloadCount, 
  getFileDetails, 
  getUserFiles, 
  resolveShareLink, 
  searchFiles, 
  sendLinkEmail, 
  updateFileExpiry, 
  updateFilePassword, 
  updateFileStatus, 
  uploadFiles, 
  verifyFilePassword 
} from "../controllers/file.controller.js";

const router = Router();

// Upload multiple files
router.post("/upload", upload.array('files'), uploadFiles);

// Download a file by ID
router.get("/:fileId/download", downloadFile);

// Delete a file by ID
router.delete("/:fileId", deleteFile);

// Update file status (active/inactive)
router.put("/:fileId/status", updateFileStatus);

// Update file expiry date
router.put("/:fileId/expiry", updateFileExpiry);

// Update file password protection
router.put("/:fileId/password", updateFilePassword);

// Get file details by ID
router.get("/:fileId", getFileDetails);

// Generate a shortened share link for a file
router.post('/:fileId/generate-share-link', generateShareShortenLink);

// Send share link via email
router.post('/:fileId/send-email', sendLinkEmail);

// Search files via query parameter
router.get('/search', searchFiles);

// Generate QR code for a file
router.get("/:fileId/qr", generateQR);

// Get download count for a file
router.get("/:fileId/downloads", getDownloadCount);

// Resolve share link by code
router.get("/share/:code", resolveShareLink);

// Verify password for a file
router.post("/:fileId/verify-password", verifyFilePassword);

// Get all files uploaded by a specific user
router.get("/user/:userId", getUserFiles);

export default router;
