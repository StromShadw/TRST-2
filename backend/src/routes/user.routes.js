import { Router } from 'express';
import { registerUser, 
        loginUser, 
        logoutUser, 
        getCurrentUser,
        updateAccountDetails,
        refreshAccessToken,
        changeCurrentPassword,
        updateUserAvatar,
        getAllUsers,
        } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// Public routes
router.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)

// User routes (requires authentication)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

// Admin only routes
// const isAdmin = (req, res, next) => {
//     if (req.user?.role !== 'administrator') {
//         throw new ApiError(403, "Access denied. Administrators only.");
//     }
//     next();
// };

router.route("/all").get(verifyJWT, getAllUsers)

export default router;