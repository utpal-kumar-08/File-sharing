import express from "express";
import multer from "multer";
import { 
  getUsers, getUserById, registerUser, loginUser, 
  updateUser, deleteUser, logoutUser, uploadProfilePic 
} from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middlewares.js";

const router = express.Router();

// ✅ Configure multer for profile picture uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// ✅ Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protect following routes (authentication required)
router.use(authenticate);

router.get("/", getUsers);                 // GET /api/users
router.get("/:userId", getUserById);       // GET /api/users/:userId
router.put("/:userId", updateUser);        // PUT /api/users/:userId
router.delete("/:userId", deleteUser);     // DELETE /api/users/:userId
router.post("/logout", logoutUser);        // POST /api/users/logout

// ✅ Profile picture upload route
router.post("/upload-profile-pic", upload.single('profilePic'), uploadProfilePic);

export default router;
