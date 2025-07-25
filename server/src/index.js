import { app } from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import fileRoutes from "./routes/file.routes.js"
import userRoutes from "./routes/user.routes.js"
import path from 'path';
const __dirname = path.resolve();

import express from "express"
import cors from "cors"


dotenv.config();

const PORT=process.env.PORT || 5600;

const startServer = async () => {
     try {
    await connectDB();

    // Register routes
    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes); // 👈 Now you can use /api/users endpoints

    app.use(express.static(path.join(__dirname, '/client')));

app.get('/f/:shortCode', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
  };
  
  startServer();