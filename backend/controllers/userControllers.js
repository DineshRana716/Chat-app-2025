const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

/**
 * @desc    Register a new user
 * @route   POST /api/user
 * @access  Public
 * @param   {Object} req - Request object containing user details (name, email, password, pic)
 * @param   {Object} res - Response object
 * @returns {Object} User object with token if successful, error otherwise
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("failed to create the user");
  }
});

/**
 * @desc    Authenticate a user and generate token
 * @route   POST /api/user/login
 * @access  Public
 * @param   {Object} req - Request object containing email and password
 * @param   {Object} res - Response object
 * @returns {Object} User object with token if successful, error otherwise
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

/**
 * @desc    Search for users based on name or email
 * @route   GET /api/user?search=query
 * @access  Private (requires authentication)
 * @param   {Object} req - Request object containing search query
 * @param   {Object} res - Response object
 * @returns {Array} List of users matching the search criteria (excluding the current user)
 */
const allUsers = asyncHandler(async (req, res) => {
  console.log("Search query received:", req.query.search);
  console.log("User making request:", req.user);

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  console.log("Search keyword:", keyword);

  try {
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    console.log("Found users:", users);
    res.send(users);
  } catch (error) {
    console.error("Error in allUsers:", error);
    res.status(500).send({ message: "Error searching users" });
  }
});

module.exports = { registerUser, authUser, allUsers };
