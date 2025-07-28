import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import fileRoutes from "./routes/file.routes.js";
import userRoutes from "./routes/user.routes.js"; // ✅ Add this import

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Mount API routes
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes); // ✅ Add this line

// Optional: handle unknown routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5600;

export { app };
