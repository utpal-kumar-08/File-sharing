import React, { useRef, useState } from "react";
import "./FileUploader.css";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile, getUserFiles } from "../../../redux/slice/file/fileThunk";
import { toast } from "react-toastify";

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.auth);

  const [files, setFiles] = useState([]);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFiles = (fileList) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
      'application/pdf'
    ];

    const newFiles = Array.from(fileList).filter((file) => {
      // Enhanced validation
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return false;
      }
      
      return true;
    });

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) added!`);
    }
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    // Enhanced user validation
    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    console.log('🔼 UPLOAD userId:', userId); // Debug log

    const formData = new FormData();
    files.forEach((file, index) => {
      console.log(`File ${index}:`, { name: file.name, size: file.size, type: file.type });
      formData.append("files", file);
    });
    
    formData.append("userId", userId);
    formData.append("hasExpiry", enableExpiry);

    if (enableExpiry && expiryDate) {
      const hours = Math.ceil(
        (new Date(expiryDate) - new Date()) / (1000 * 60 * 60)
      );
      console.log('Expiry hours:', hours);
      formData.append("expiresAt", hours);
    }

    formData.append("isPassword", enablePassword);
    if (enablePassword && password) {
      formData.append("password", password);
    }

    try {
      console.log('🚀 Starting upload...');
      // Updated to match the corrected thunk signature
      // console.log(userId);
      const result = await dispatch(uploadFile({ formData, userId })).unwrap();
      console.log('✅ Upload result:', result);
      
      toast.success("Files uploaded successfully!");
      
      // Clear form state
      setFiles([]);
      setPassword("");
      setExpiryDate("");
      setEnablePassword(false);
      setEnableExpiry(false);
      
      // Refresh files list instead of full page reload
      console.log('🔄 Refetching files after upload...');
      dispatch(getUserFiles(userId));
      
    } catch (err) {
      console.error('❌ Upload error:', err);
      toast.error(err?.error || err?.message || "Upload failed");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>File Upload</h1>
        <p>Drag & drop files or click to browse</p>
      </div>

      <div
        className="dropbox"
        onClick={handleBrowseClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="dropbox-icon">📁</div>
        <div className="dropbox-text">Drop files here</div>
        <div className="dropbox-subtext">
          Supported formats: JPG, PNG, PDF, MP4, MOV, AVI, MKV (Max 10MB)
        </div>
        <button
          className="browse-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
        >
          Browse Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".jpg,.jpeg,.webp,.png,.mp4,.avi,.mov,.mkv,.mk3d,.mks,.mka,.pdf"
          onChange={handleFileInputChange}
        />
      </div>

      <div className="extra-options">
        <div className="switch-container">
          <label className="switch-label">
            <span className="label-text">Set Password</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={enablePassword}
                onChange={(e) => setEnablePassword(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </label>
          {enablePassword && (
            <input
              type="password"
              className="password-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>

        <div className="switch-container">
          <label className="switch-label">
            <span className="label-text">Set Expiry Date</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={enableExpiry}
                onChange={(e) => setEnableExpiry(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </label>
          {enableExpiry && (
            <input
              type="datetime-local"
              className="expiry-input"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="upload-stats">
          <div className="stats-header">
            <div className="stats-title">Upload Summary</div>
          </div>
          <div className="stats-info">
            <div className="stat-item">
              <div className="stat-value">{files.length}</div>
              <div className="stat-label">Files</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {totalSize > 1024 * 1024
                  ? `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
                  : `${(totalSize / 1024).toFixed(2)} KB`}
              </div>
              <div className="stat-label">Total Size</div>
            </div>
          </div>
          <div className="progress-bar" style={{ marginTop: "15px" }}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(
                  (totalSize / (50 * 1024 * 1024)) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {files.length === 0 ? (
        <div className="empty-state">No files uploaded yet</div>
      ) : (
        <div className="file-previews">
          {files.map((file, index) => (
            <div className="file-preview" key={index}>
              <div className="preview-img-container">
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="preview-img"
                  />
                ) : file.type.startsWith("video") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="preview-video"
                    controls
                    muted
                    width="100"
                    height="80"
                  />
                ) : (
                  <div className="file-icon">📄</div>
                )}
              </div>
              <div className="file-info">
                <div className="file-name" title={file.name}>
                  {(() => {
                    const dotIndex = file.name.lastIndexOf(".");
                    const name = file.name.slice(0, dotIndex);
                    const ext = file.name.slice(dotIndex);
                    return name.length > 30
                      ? `${name.slice(0, 27)}...${ext}`
                      : file.name;
                  })()}
                </div>
                <div className="file-size">
                  {file.size > 1024 * 1024
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : `${(file.size / 1024).toFixed(2)} KB`}
                </div>
                <div className="file-actions">
                  <button
                    className="remove-btn"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="upload-action">
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading || files.length === 0}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
