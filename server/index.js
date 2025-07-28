// ✅ Load env first!
import dotenv from "dotenv";
const result = dotenv.config(); // This must be before anything else uses process.env

import connectDB from "./src/db/index.js";
import fileRoutes from "./src/routes/file.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import path from "path";
const __dirname = path.resolve();

import { app } from "./src/app.js";
import express from "express";
import cors from "cors";

if (result.error) {
  console.error("❌ dotenv failed to load:", result.error);
} else {
  console.log("✅ dotenv loaded:", result.parsed);
}
// console.log(process.env.PORT); // ✅ Should now print your PORT from .env
// console.log(process.env.CLOUDINARY_CLOUD_NAME); // ✅ Should now work


const PORT = process.env.PORT || 5600;

const startServer = async () => {
  try {
    await connectDB();

    // Register routes
    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes); // 👈 Now you can use /api/users endpoints

    app.use(express.static(path.join(__dirname, "/client")));

    app.get("/f/:shortCode", (req, res) => {
      res.sendFile(path.join(__dirname, "/client/index.html"));
    });

    

    console.log(process.env.CLOUDINARY_CLOUD_NAME);

    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();
