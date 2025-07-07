# File Sharing Application

A modern, secure file sharing platform built with React and Node.js that allows users to upload, share, and manage files with advanced features like password protection, expiry dates, and QR code generation.

## 🚀 Features

### Core Functionality
- **File Upload**: Drag & drop interface for easy file uploads
- **Secure Sharing**: Generate short links for file sharing
- **Password Protection**: Protect files with passwords
- **Expiry Management**: Set automatic expiration dates for files
- **QR Code Generation**: Generate QR codes for easy mobile sharing
- **File Preview**: Preview files before downloading
- **Download Tracking**: Monitor download statistics

### User Management
- **User Authentication**: Secure login/signup system
- **User Dashboard**: Comprehensive dashboard with file management
- **Profile Management**: Update user profile and settings
- **File Statistics**: Track uploads, downloads, and file types

### Advanced Features
- **Cloud Storage**: Files stored securely on Cloudinary
- **Multiple File Types**: Support for images, videos, documents, and more
- **Email Sharing**: Send file links via email
- **File Search**: Search through uploaded files
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live dashboard updates

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Dropzone** - Drag & drop file uploads
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **Cloudinary** - Cloud storage service
- **Nodemailer** - Email functionality
- **QRCode** - QR code generation
- **ShortID** - Short URL generation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd filesharing/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   BASE_URL=http://localhost:5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ../client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

### Getting Started
1. Open your browser and navigate to `http://localhost:5173`
2. Create a new account or sign in
3. Access your dashboard to start uploading files

### Uploading Files
1. Click on the "Upload" tab in the dashboard
2. Drag and drop files or click to browse
3. Configure options:
   - Set password protection (optional)
   - Set expiry date (optional)
4. Click "Upload" to complete the process

### Sharing Files
1. After upload, files appear in your dashboard
2. Click on a file to view details
3. Copy the generated short link
4. Share the link with others
5. Optionally generate QR code for mobile sharing

### Downloading Files
1. Recipients click on the shared link
2. If password protected, enter the password
3. Click download to save the file

## 📁 Project Structure

```
filesharing/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Dashboard/  # Dashboard components
│   │   │   └── ...
│   │   ├── redux/          # Redux store and slices
│   │   ├── config/         # Configuration files
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── config/         # Configuration files
│   │   └── ...
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Files
- `POST /api/files/upload` - Upload files
- `GET /api/files/user` - Get user's files
- `GET /api/files/:fileId` - Get file details
- `DELETE /api/files/:fileId` - Delete file
- `PUT /api/files/:fileId/status` - Update file status
- `PUT /api/files/:fileId/expiry` - Update file expiry
- `PUT /api/files/:fileId/password` - Update file password
- `POST /api/files/:fileId/download` - Download file
- `POST /api/files/:fileId/verify-password` - Verify file password
- `GET /api/files/share/:code` - Resolve share link

### Utilities
- `POST /api/files/:fileId/qr` - Generate QR code
- `POST /api/files/:fileId/email` - Send file via email
- `GET /api/files/search` - Search files

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **File Encryption**: Optional password protection for files
- **CORS Protection**: Cross-origin resource sharing security
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against abuse

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Configure MongoDB connection
4. Set up Cloudinary credentials

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to platforms like Vercel, Netlify, or GitHub Pages
3. Update API endpoints in configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 👨‍💻 Developer

**Utpal Kumar**
- GitHub: [@utpal-kumar-08](https://github.com/utpal-kumar-08)

## 🔄 Version History

- **v1.0.0** - Initial release with core file sharing features
- Basic authentication and file management
- Cloud storage integration
- QR code generation
- Email sharing functionality

---

**Built with ❤️ using React and Node.js**