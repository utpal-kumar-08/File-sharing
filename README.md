# File Sharing Application

A modern web application for secure file sharing and management, built with React and Node.js.

## Features

- 🔐 User Authentication (Signup/Login)
- 📤 File Upload with Progress Tracking
- 📥 Secure File Download
- 📱 Responsive Dashboard
- 🔍 File Preview
- 👤 User Profile Management
- 🔒 Secure File Storage using AWS S3
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for State Management
- Tailwind CSS for Styling
- Axios for API Calls
- React Router for Navigation

### Backend
- Node.js
- Express.js
- MongoDB for Database
- AWS S3 for File Storage
- JWT for Authentication

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB installed and running
- AWS S3 account and credentials
- Git

## Project Structure

```
project5/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── redux/        # Redux store and slices
│   │   ├── config/       # Configuration files
│   │   └── assets/       # Static assets
│   └── public/           # Public files
└── server/               # Backend Node.js application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/      # Database models
    │   ├── routes/      # API routes
    │   ├── middlewares/ # Custom middlewares
    │   └── config/      # Configuration files
    └── .env.sample      # Environment variables template
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/utpal-kumar-08/File-sharing.git
   cd file-sharing
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Environment Setup:
   - Copy `server/.env.sample` to `server/.env`
   - Update the environment variables in `server/.env` with your:
     - MongoDB connection string
     - AWS S3 credentials
     - JWT secret
     - Other configuration values

4. Start the development servers:
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/logout` - Logout user

### Files
- POST `/api/files/upload` - Upload a file
- GET `/api/files` - Get user's files
- GET `/api/files/:id` - Get file details
- DELETE `/api/files/:id` - Delete a file
- GET `/api/files/download/:id` - Download a file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Name -Utpal Kumar
Project Link: https://github.com/utpal-kumar-08/File-sharing.gitFile Sharing Application
