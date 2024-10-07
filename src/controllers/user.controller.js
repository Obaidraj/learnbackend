import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async(userId) => {
try {
  const user = await User.findById(userId);
 const accessToken= user.generateAccessToken()
  const refreshToken=user.generateRefreshToken()
  user.refreshToken=refreshToken
  await user.save({validateBeforeSave:false})
  return {accessToken,refreshToken}
} catch (error) {
  throw new ApiError(500, "Something went wrong");
}
}


const registerUser = asyncHandler(async (req, res) => {
  //1- get user detail from front-end
  //2- validation  -not empty
  //3- check if user already exist: username, email
  //4- check for images, check for avatar
  //5- upload them to cloudinary, avatar
  //6- create user object - create entry in db
  //7- remove password and refresh token field from response
  //8- check for user creation
  //9- return response

  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const avatarLoaclPath = req.files?.avatar[0]?.path;
  let coverImageLoaclPath;
  if (
    req.files &&
    Array.isArray(req.files?.coverImage) &&
    req.files?.coverImage.length > 0
  ) {
    coverImageLoaclPath = req.files?.coverImage[0]?.path;
  }
  if (!avatarLoaclPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLoaclPath);
  const coverImage = await uploadOnCloudinary(coverImageLoaclPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  //1- req body -> data
  //2- username or email
  //3- find the user
  //4- check for password
  //5- access and refresh token
  //6- send cookie
  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

  const logedInUser=await User.findById(user._id).select(
    "-password -refreshToken")

    const options={
      httpOnly:true,
      secure:true
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
      user:logedInUser,
      accessToken,
      refreshToken
    }
      ,"Logged in successfully"))

});

const logoutUser=asyncHandler(async(req,res)=>{
   User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
      refreshToken:undefined
      },
      {
      new:true
      }
    })
    const options={
      httpOnly:true,
      secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"Logged out successfully"))
})

export { registerUser, loginUser, logoutUser };
