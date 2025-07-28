import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dvhb3cll0",
  api_key: process.env.CLOUDINARY_API_KEY || "341385485276689",
  api_secret: process.env.CLOUDINARY_API_SECRET || "3HxBzFW23IkD-1UkCogVsrgYxwI",
});

export default cloudinary;