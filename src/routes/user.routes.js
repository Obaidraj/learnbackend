import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetail,
  updateUserAvatar,
  updateUserCoverImage,
  changeCurretPassword,
  sendOtp,
  verifyOtp,
  forgetPassword,
  getUserChannelProfile,
  getWatchHistory
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/forget-password").post(forgetPassword);

//Secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyJWT, getCurrentUser);
router.route("/update-profile").patch(verifyJWT, updateAccountDetail);
router.route("/update-Password").patch(verifyJWT, changeCurretPassword);

router.route("/update-avatar").patch(
  verifyJWT,
  upload.fields([         //also can use uload.single("avatar")  //will get req.file not files
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateUserAvatar
);
router.route("/update-coverImage").patch(
  verifyJWT,
  upload.fields([       //also can use uload.single("coverImage")  //will get req.file not files
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateUserCoverImage
);

router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router;
